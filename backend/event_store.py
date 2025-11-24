#!/usr/bin/env python3
"""
Event Storage and Query System for AEGIS
Stores all security events for natural language queries and summaries
"""

import json
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
import threading

class EventStore:
    """
    Store and query security events for intelligent analysis.
    Uses SQLite for fast local storage (privacy-first design!)
    """

    def __init__(self, db_path: str = "aegis_events.db"):
        self.db_path = db_path
        self.lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        """Initialize database schema"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    threat_level TEXT NOT NULL,
                    confidence REAL,
                    description TEXT,
                    reasoning TEXT,
                    objects_detected TEXT,
                    people_count INTEGER,
                    brightness REAL,
                    motion REAL,
                    screenshot_path TEXT,
                    action_plan TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

            conn.execute("""
                CREATE TABLE IF NOT EXISTS patterns (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hour_of_day INTEGER,
                    day_of_week INTEGER,
                    typical_activity TEXT,
                    typical_people_count INTEGER,
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp)
            """)

            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type)
            """)

            conn.commit()

    def add_event(self,
                  event_type: str,
                  threat_level: str,
                  description: str,
                  reasoning: str = "",
                  confidence: float = 0.0,
                  objects_detected: List[str] = None,
                  people_count: int = 0,
                  brightness: float = 0.0,
                  motion: float = 0.0,
                  screenshot_path: str = "",
                  action_plan: str = "") -> int:
        """Add a new event to the database"""
        with self.lock:
            timestamp = datetime.now().isoformat()
            objects_json = json.dumps(objects_detected or [])

            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.execute("""
                    INSERT INTO events
                    (timestamp, event_type, threat_level, confidence, description,
                     reasoning, objects_detected, people_count, brightness, motion,
                     screenshot_path, action_plan)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (timestamp, event_type, threat_level, confidence, description,
                      reasoning, objects_json, people_count, brightness, motion,
                      screenshot_path, action_plan))

                conn.commit()
                return cursor.lastrowid

    def get_events(self,
                   start_time: Optional[datetime] = None,
                   end_time: Optional[datetime] = None,
                   event_type: Optional[str] = None,
                   limit: int = 100) -> List[Dict]:
        """Query events with filters"""
        with self.lock:
            query = "SELECT * FROM events WHERE 1=1"
            params = []

            if start_time:
                query += " AND timestamp >= ?"
                params.append(start_time.isoformat())

            if end_time:
                query += " AND timestamp <= ?"
                params.append(end_time.isoformat())

            if event_type:
                query += " AND event_type = ?"
                params.append(event_type)

            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)

            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute(query, params)
                return [dict(row) for row in cursor.fetchall()]

    def get_events_today(self) -> List[Dict]:
        """Get all events from today"""
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        return self.get_events(start_time=today_start, limit=1000)

    def get_events_last_n_hours(self, hours: int) -> List[Dict]:
        """Get events from last N hours"""
        start = datetime.now() - timedelta(hours=hours)
        return self.get_events(start_time=start, limit=1000)

    def get_threat_count_today(self) -> int:
        """Count threats detected today"""
        events = self.get_events_today()
        return len([e for e in events if e['threat_level'] in ['critical', 'THREAT DETECTED']])

    def get_hourly_activity(self) -> Dict[int, int]:
        """Get activity count by hour for pattern learning"""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.execute("""
                    SELECT strftime('%H', timestamp) as hour, COUNT(*) as count
                    FROM events
                    WHERE timestamp >= datetime('now', '-7 days')
                    GROUP BY hour
                """)
                return {int(row[0]): row[1] for row in cursor.fetchall()}

    def update_pattern(self, hour: int, day_of_week: int, activity: str, people_count: int):
        """Update learned patterns for anomaly detection"""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("""
                    INSERT OR REPLACE INTO patterns
                    (hour_of_day, day_of_week, typical_activity, typical_people_count, last_updated)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (hour, day_of_week, activity, people_count))
                conn.commit()

    def get_typical_pattern(self, hour: int, day_of_week: int) -> Optional[Dict]:
        """Get typical pattern for a given time"""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute("""
                    SELECT * FROM patterns
                    WHERE hour_of_day = ? AND day_of_week = ?
                """, (hour, day_of_week))
                row = cursor.fetchone()
                return dict(row) if row else None

    def get_summary_stats_today(self) -> Dict:
        """Get summary statistics for today"""
        events = self.get_events_today()

        threats = [e for e in events if e['threat_level'] in ['critical', 'THREAT DETECTED']]
        normal = [e for e in events if e['threat_level'] in ['low', 'SAFE']]

        # Count unique event types
        event_types = {}
        for event in events:
            event_type = event['event_type']
            event_types[event_type] = event_types.get(event_type, 0) + 1

        # Get peak activity hour
        hourly = {}
        for event in events:
            hour = datetime.fromisoformat(event['timestamp']).hour
            hourly[hour] = hourly.get(hour, 0) + 1

        peak_hour = max(hourly.items(), key=lambda x: x[1])[0] if hourly else 0

        return {
            "total_events": len(events),
            "threats_detected": len(threats),
            "normal_activity": len(normal),
            "event_types": event_types,
            "peak_activity_hour": peak_hour,
            "first_event": events[-1]['timestamp'] if events else None,
            "last_event": events[0]['timestamp'] if events else None
        }
