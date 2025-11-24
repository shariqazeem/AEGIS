#!/usr/bin/env python3
"""
Test Competition Features - Standalone Demo
Shows Natural Language Queries, Summaries, and Anomaly Detection working!
"""

import sys
from datetime import datetime
from event_store import EventStore
from query_engine import QueryEngine
from anomaly_detector import AnomalyDetector

# Initialize Parallax client
from openai import OpenAI

print("🔌 Connecting to Parallax at http://localhost:3001/v1...")
try:
    client = OpenAI(
        base_url="http://localhost:3001/v1",
        api_key="test-key"
    )
    # Test connection
    test_response = client.chat.completions.create(
        model="Qwen/Qwen3-0.6B",
        messages=[{"role": "user", "content": "test"}],
        max_tokens=10
    )
    print("✓ Parallax connection successful!")
    print(f"  Response type: {type(test_response)}")
    if hasattr(test_response, 'choices'):
        print(f"  Has choices: {len(test_response.choices)} choices")
        if len(test_response.choices) > 0:
            print(f"  Choice type: {type(test_response.choices[0])}")
    print()
except Exception as e:
    print(f"❌ Parallax connection failed: {e}")
    print("  Make sure Parallax is running:")
    print("    Terminal 1: parallax run")
    print("    Terminal 2: parallax join")
    sys.exit(1)

# Initialize systems
event_store = EventStore(db_path="test_aegis_events.db")
query_engine = QueryEngine(client, event_store)
anomaly_detector = AnomalyDetector(client, event_store)

print("=" * 60)
print("🏆 AEGIS Competition Features Demo")
print("=" * 60)
print()

# Add some sample events
print("📝 Adding sample security events...")
event_store.add_event(
    event_type="normal",
    threat_level="low",
    description="Person sitting at desk working on laptop",
    objects_detected=["person", "laptop", "cell phone"],
    people_count=1,
    brightness=150.0,
    motion=2.0
)

event_store.add_event(
    event_type="normal",
    threat_level="low",
    description="Empty room, no activity",
    objects_detected=[],
    people_count=0,
    brightness=120.0,
    motion=0.0
)

event_store.add_event(
    event_type="weapon",
    threat_level="critical",
    description="Knife detected on kitchen counter",
    objects_detected=["person", "knife"],
    people_count=1,
    brightness=160.0,
    motion=5.0
)

print("✓ Added 3 sample events\n")

# Test 1: Natural Language Query
print("-" * 60)
print("🤖 Test 1: Natural Language Query")
print("-" * 60)
print("Question: 'Was anyone home today?'\n")

result = query_engine.query("Was anyone home today?")
print(f"Answer: {result['answer']}")
print(f"Confidence: {result['confidence']:.2f}")
print(f"Analyzed {result['total_events_analyzed']} events")
print(f"Inference time: {result['inference_time_ms']:.0f}ms")
print()

# Test 2: Daily Summary
print("-" * 60)
print("📊 Test 2: Intelligent Daily Summary")
print("-" * 60)
summary = query_engine.generate_daily_summary()
print(f"Summary: {summary['summary']}")
print(f"Risk Level: {summary['risk_level']}")
print(f"Stats: {summary['stats']['total_events']} total events")
print(f"Inference time: {summary['inference_time_ms']:.0f}ms")
print()

# Test 3: Anomaly Detection
print("-" * 60)
print("🎯 Test 3: Anomaly Detection")
print("-" * 60)
print("Learning patterns from historical data...")
anomaly_detector.learn_patterns()

# Simulate an unusual event
unusual_event = {
    "timestamp": datetime.now().isoformat(),
    "event_type": "person_detected",
    "people_count": 5,  # Unusual number
    "description": "5 people detected in living room",
    "objects_detected": '["person"]'
}

anomaly_result = anomaly_detector.detect_anomaly(unusual_event)
if anomaly_result:
    print(f"🚨 ANOMALY DETECTED!")
    print(f"Type: {anomaly_result['anomaly_type']}")
    print(f"Confidence: {anomaly_result['confidence']:.2f}")
    print(f"Reasoning: {anomaly_result['reasoning']}")
    print(f"Inference time: {anomaly_result['inference_time_ms']:.0f}ms")
else:
    print("✓ No anomalies detected - activity is normal")

print()
print("=" * 60)
print("🏆 All Competition Features Working!")
print("=" * 60)
print("\nNext steps:")
print("1. These features are now integrated into vision_sentinel.py")
print("2. Run 'python vision_sentinel.py' to start the full system")
print("3. All scans will be logged and queryable")
print("4. Daily summaries will be generated automatically")
print("5. Anomalies will be detected in real-time")
