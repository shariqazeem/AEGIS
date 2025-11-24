#!/usr/bin/env python3
"""
Natural Language Query Engine for AEGIS
Uses Parallax AI to answer questions about security footage and events
🏆 COMPETITION FEATURE: Shows intelligent AI reasoning over historical data!
"""

import json
import re
from datetime import datetime, timedelta
from typing import Optional, Dict
from event_store import EventStore


def clean_json_response(content: str) -> str:
    """Remove markdown code blocks and clean JSON from AI response"""
    # Remove ```json ... ``` markdown blocks
    content = re.sub(r'```json\s*', '', content)
    content = re.sub(r'```\s*$', '', content)
    content = content.strip()
    return content


class QueryEngine:
    """
    Answer natural language questions about security events using Parallax AI.

    Examples:
    - "Was anyone home at 3pm?"
    - "What happened this morning?"
    - "Any threats detected today?"
    - "How many people visited?"
    """

    def __init__(self, parallax_client, event_store: EventStore):
        self.client = parallax_client
        self.event_store = event_store
        self.model = "Qwen/Qwen3-0.6B"  # Use the same model as threat detection

    def query(self, question: str) -> Dict:
        """
        Answer a natural language question using Parallax AI

        Returns:
        {
            "answer": "Human-readable answer",
            "confidence": 0.95,
            "supporting_events": [...],
            "inference_time_ms": 1234
        }
        """
        import time
        start_time = time.time()

        # Step 1: Determine time range from question
        time_range = self._parse_time_range(question)

        # Step 2: Get relevant events from database
        events = self.event_store.get_events(
            start_time=time_range['start'],
            end_time=time_range['end'],
            limit=200
        )

        # Step 3: Build context for Parallax AI
        context = self._build_context(events, question)

        # Step 4: Ask Parallax AI to answer the question
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"""You are a security system AI assistant analyzing surveillance data.

User Question: {question}

Security Events Data:
{context}

Based on the events above, answer the user's question naturally and accurately.
If asking about specific times, check the timestamps.
If asking about people, check people_count and descriptions.
If asking about threats, check threat_level and event_type.

Provide a clear, conversational answer. Be specific with times and details.

JSON response format:
{{"answer": "your detailed answer here", "confidence": 0.95, "key_events": ["event1", "event2"]}}"""
                }],
                max_tokens=300,
                temperature=0.3,  # Low temperature for factual responses
                extra_body={"chat_template_kwargs": {"enable_thinking": False}}
            )

            inference_time_ms = (time.time() - start_time) * 1000

            # Handle Parallax response structure
            if response and hasattr(response, 'choices') and len(response.choices) > 0:
                choice = response.choices[0]

                # Extract content from message (Parallax uses choice.messages dict)
                if hasattr(choice, 'messages') and isinstance(choice.messages, dict):
                    content = choice.messages.get('content', '')
                elif hasattr(choice, 'message') and hasattr(choice.message, 'content'):
                    content = choice.message.content
                elif hasattr(choice, 'text'):
                    content = choice.text
                else:
                    content = str(choice)

                # Parse JSON response (clean markdown first)
                try:
                    cleaned_content = clean_json_response(content)
                    result = json.loads(cleaned_content)
                    return {
                        "answer": result.get("answer", content),
                        "confidence": result.get("confidence", 0.8),
                        "supporting_events": events[:5],  # Top 5 relevant events
                        "inference_time_ms": inference_time_ms,
                        "total_events_analyzed": len(events)
                    }
                except json.JSONDecodeError:
                    # Fallback if AI doesn't return JSON
                    return {
                        "answer": content,
                        "confidence": 0.7,
                        "supporting_events": events[:5],
                        "inference_time_ms": inference_time_ms,
                        "total_events_analyzed": len(events)
                    }
            else:
                # Response is None or malformed
                error_msg = f"Invalid response from Parallax: {response}"
                return {
                    "answer": error_msg,
                    "confidence": 0.0,
                    "supporting_events": [],
                    "inference_time_ms": inference_time_ms,
                    "total_events_analyzed": 0
                }

        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "confidence": 0.0,
                "supporting_events": [],
                "inference_time_ms": (time.time() - start_time) * 1000,
                "total_events_analyzed": 0
            }

    def _parse_time_range(self, question: str) -> Dict:
        """Parse time range from question (simple heuristic)"""
        now = datetime.now()
        question_lower = question.lower()

        if "today" in question_lower or "this morning" in question_lower or "this afternoon" in question_lower:
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = now
        elif "yesterday" in question_lower:
            start = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
        elif "this week" in question_lower or "past week" in question_lower:
            start = now - timedelta(days=7)
            end = now
        elif "last hour" in question_lower or "past hour" in question_lower:
            start = now - timedelta(hours=1)
            end = now
        elif "last 24 hours" in question_lower:
            start = now - timedelta(hours=24)
            end = now
        else:
            # Default: last 24 hours
            start = now - timedelta(hours=24)
            end = now

        # Check for specific times like "at 3pm"
        import re
        time_match = re.search(r'at (\d{1,2})(am|pm|:00)?', question_lower)
        if time_match:
            hour = int(time_match.group(1))
            if 'pm' in question_lower and hour < 12:
                hour += 12
            # Look at that specific hour
            start = now.replace(hour=hour, minute=0, second=0, microsecond=0)
            end = start + timedelta(hours=1)

        return {"start": start, "end": end}

    def _build_context(self, events: list, question: str) -> str:
        """Build concise context from events for AI"""
        if not events:
            return "No events recorded in the specified time period."

        # Limit to most relevant events (last 20)
        events = events[:20]

        context_lines = []
        for event in events:
            timestamp = datetime.fromisoformat(event['timestamp'])
            time_str = timestamp.strftime("%I:%M %p")  # e.g., "03:15 PM"

            # Parse objects detected
            try:
                objects = json.loads(event['objects_detected'])
                objects_str = ", ".join(objects) if objects else "none"
            except:
                objects_str = "none"

            context_lines.append(
                f"[{time_str}] {event['event_type']} - {event['description']} "
                f"(people: {event['people_count']}, objects: {objects_str})"
            )

        return "\n".join(context_lines)

    def generate_daily_summary(self) -> Dict:
        """
        Generate an intelligent daily summary using Parallax AI
        🏆 COMPETITION FEATURE: Shows AI-powered summarization!
        """
        import time
        start_time = time.time()

        # Get today's statistics
        stats = self.event_store.get_summary_stats_today()
        events = self.event_store.get_events_today()

        if not events:
            return {
                "summary": "No activity recorded today.",
                "stats": stats,
                "highlights": [],
                "inference_time_ms": 0
            }

        # Build timeline of key events
        timeline = []
        threats = []
        for event in events:
            timestamp = datetime.fromisoformat(event['timestamp'])
            if event['threat_level'] in ['critical', 'THREAT DETECTED']:
                threats.append({
                    "time": timestamp.strftime("%I:%M %p"),
                    "type": event['event_type'],
                    "description": event['description']
                })

        # Ask Parallax AI to generate a summary
        try:
            prompt = f"""You are a security system AI generating an end-of-day summary.

Today's Security Statistics:
- Total events analyzed: {stats['total_events']}
- Threats detected: {stats['threats_detected']}
- Normal activity periods: {stats['normal_activity']}
- Peak activity hour: {stats['peak_activity_hour']}:00

Threat Events:
{json.dumps(threats, indent=2) if threats else "No threats detected"}

Generate a brief, professional daily summary (2-3 sentences) that:
1. Summarizes overall activity
2. Highlights any threats or unusual events
3. Provides peace of mind or actionable insights

JSON response:
{{"summary": "your summary here", "highlights": ["key point 1", "key point 2"], "risk_level": "low/medium/high"}}"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.4,
                extra_body={"chat_template_kwargs": {"enable_thinking": False}}
            )

            inference_time_ms = (time.time() - start_time) * 1000

            # Handle Parallax response structure
            if response and hasattr(response, 'choices') and len(response.choices) > 0:
                choice = response.choices[0]

                # Extract content from message (Parallax uses choice.messages dict)
                if hasattr(choice, 'messages') and isinstance(choice.messages, dict):
                    content = choice.messages.get('content', '')
                elif hasattr(choice, 'message') and hasattr(choice.message, 'content'):
                    content = choice.message.content
                elif hasattr(choice, 'text'):
                    content = choice.text
                else:
                    content = str(choice)

                try:
                    cleaned_content = clean_json_response(content)
                    result = json.loads(cleaned_content)
                    return {
                        "summary": result.get("summary", content),
                        "highlights": result.get("highlights", []),
                        "risk_level": result.get("risk_level", "low"),
                        "stats": stats,
                        "inference_time_ms": inference_time_ms
                    }
                except json.JSONDecodeError:
                    return {
                        "summary": content,
                        "highlights": [],
                        "risk_level": "low",
                        "stats": stats,
                        "inference_time_ms": inference_time_ms
                    }
            else:
                # Response is None or malformed
                error_msg = f"Invalid response from Parallax: {response}"
                return {
                    "summary": error_msg,
                    "highlights": [],
                    "risk_level": "unknown",
                    "stats": stats,
                    "inference_time_ms": inference_time_ms
                }

        except Exception as e:
            return {
                "summary": f"Error generating summary: {str(e)}",
                "highlights": [],
                "risk_level": "unknown",
                "stats": stats,
                "inference_time_ms": (time.time() - start_time) * 1000
            }
