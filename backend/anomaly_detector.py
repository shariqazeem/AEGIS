#!/usr/bin/env python3
"""
Pattern Learning and Anomaly Detection for AEGIS
Learns normal patterns and detects unusual activity using Parallax AI
🏆 COMPETITION FEATURE: Shows AI learning and adaptive threat detection!
"""

from datetime import datetime, timedelta
from typing import Dict, Optional, List
from event_store import EventStore
import json
import re


def clean_json_response(content: str) -> str:
    """Remove markdown code blocks and clean JSON from AI response"""
    # Remove ```json ... ``` markdown blocks
    content = re.sub(r'```json\s*', '', content)
    content = re.sub(r'```\s*$', '', content)
    content = content.strip()
    return content


class AnomalyDetector:
    """
    Learn normal activity patterns and detect anomalies using Parallax AI.

    Examples of anomalies:
    - Person detected at unusual time (e.g., 3am when normally quiet)
    - Different number of people than usual
    - Activity in unusual location
    - Unusual object combinations
    """

    def __init__(self, parallax_client, event_store: EventStore):
        self.client = parallax_client
        self.event_store = event_store
        self.model = "Qwen/Qwen3-0.6B"
        self.learning_enabled = True

    def learn_patterns(self):
        """
        Learn typical patterns from historical data.
        Should be run periodically (e.g., once per day)
        """
        # Get last 7 days of data
        start_time = datetime.now() - timedelta(days=7)
        events = self.event_store.get_events(start_time=start_time, limit=10000)

        if len(events) < 10:
            return  # Not enough data to learn patterns

        # Group events by hour and day of week
        patterns = {}
        for event in events:
            timestamp = datetime.fromisoformat(event['timestamp'])
            hour = timestamp.hour
            day_of_week = timestamp.weekday()

            key = f"{day_of_week}_{hour}"
            if key not in patterns:
                patterns[key] = {
                    "events": [],
                    "people_counts": [],
                    "event_types": []
                }

            patterns[key]["events"].append(event)
            patterns[key]["people_counts"].append(event['people_count'])
            patterns[key]["event_types"].append(event['event_type'])

        # Calculate typical activity for each time slot
        for key, data in patterns.items():
            day_of_week, hour = map(int, key.split('_'))

            # Calculate average people count
            avg_people = sum(data['people_counts']) / len(data['people_counts']) if data['people_counts'] else 0

            # Determine typical activity
            event_type_counts = {}
            for et in data['event_types']:
                event_type_counts[et] = event_type_counts.get(et, 0) + 1

            typical_activity = max(event_type_counts.items(), key=lambda x: x[1])[0] if event_type_counts else "quiet"

            # Store pattern
            self.event_store.update_pattern(
                hour=hour,
                day_of_week=day_of_week,
                activity=typical_activity,
                people_count=int(avg_people)
            )

    def detect_anomaly(self, current_event: Dict) -> Optional[Dict]:
        """
        Check if current event is anomalous compared to learned patterns.
        Uses Parallax AI for intelligent anomaly reasoning.

        Returns:
        {
            "is_anomaly": True/False,
            "anomaly_type": "unusual_time" | "unusual_people" | "unusual_activity",
            "confidence": 0.85,
            "reasoning": "Person detected at 3am when typically quiet",
            "inference_time_ms": 1234
        }
        """
        import time
        start_time = time.time()

        # Get current time context
        timestamp = datetime.fromisoformat(current_event['timestamp'])
        hour = timestamp.hour
        day_of_week = timestamp.weekday()

        # Get typical pattern for this time
        typical = self.event_store.get_typical_pattern(hour, day_of_week)

        if not typical:
            # No learned pattern yet, not an anomaly
            return None

        # Build context for AI analysis
        current_context = {
            "time": timestamp.strftime("%I:%M %p"),
            "day": timestamp.strftime("%A"),
            "event_type": current_event['event_type'],
            "people_count": current_event['people_count'],
            "description": current_event['description'],
            "objects": current_event.get('objects_detected', '[]')
        }

        typical_context = {
            "typical_activity": typical['typical_activity'],
            "typical_people_count": typical['typical_people_count']
        }

        # Ask Parallax AI to analyze if this is anomalous
        try:
            prompt = f"""You are a security AI analyzing activity patterns for anomalies.

CURRENT EVENT:
Time: {current_context['time']} on {current_context['day']}
Activity: {current_context['event_type']}
People detected: {current_context['people_count']}
Description: {current_context['description']}

TYPICAL PATTERN FOR THIS TIME:
Typical activity: {typical_context['typical_activity']}
Typical people count: {typical_context['typical_people_count']}

Is this current event ANOMALOUS (unusual/unexpected) compared to the typical pattern?

Consider:
1. Is the activity type different than usual?
2. Is the number of people significantly different?
3. Is this happening at an unusual time?
4. Are there unusual objects present?

An anomaly is something that deviates significantly from normal patterns and might require attention.

JSON response:
{{
    "is_anomaly": true/false,
    "anomaly_type": "unusual_time" | "unusual_people" | "unusual_activity" | "none",
    "confidence": 0.0-1.0,
    "reasoning": "brief explanation why this is/isn't anomalous"
}}"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.3,
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
                    result['inference_time_ms'] = inference_time_ms
                    return result if result.get('is_anomaly') else None

                except json.JSONDecodeError:
                    # Fallback: parse manually
                    is_anomaly = "true" in content.lower() and "anomaly" in content.lower()
                    if is_anomaly:
                        return {
                            "is_anomaly": True,
                            "anomaly_type": "unknown",
                            "confidence": 0.6,
                            "reasoning": content,
                            "inference_time_ms": inference_time_ms
                        }

        except Exception as e:
            pass  # Silent failure, don't disrupt main detection

        return None

    def get_recent_anomalies(self, hours: int = 24) -> List[Dict]:
        """Get recent anomalies detected"""
        events = self.event_store.get_events_last_n_hours(hours)
        anomalies = []

        for event in events:
            # Check if event was flagged as anomaly (we'll add this field)
            if event.get('is_anomaly'):
                anomalies.append({
                    "timestamp": event['timestamp'],
                    "type": event['event_type'],
                    "description": event['description'],
                    "anomaly_reasoning": event.get('anomaly_reasoning', '')
                })

        return anomalies

    def should_alert(self, anomaly_result: Dict) -> bool:
        """Determine if anomaly is severe enough to trigger alert"""
        if not anomaly_result or not anomaly_result.get('is_anomaly'):
            return False

        # Alert if:
        # 1. High confidence anomaly
        # 2. Unusual time (3am activity when normally quiet)
        # 3. Unusual people count (strangers?)

        confidence = anomaly_result.get('confidence', 0)
        anomaly_type = anomaly_result.get('anomaly_type', '')

        if confidence > 0.8:
            return True

        if anomaly_type in ['unusual_time', 'unusual_people']:
            return confidence > 0.6

        return False
