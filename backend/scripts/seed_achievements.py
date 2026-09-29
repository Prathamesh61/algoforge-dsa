import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.achievements.models import Achievement

def run():
    print("Seeding Gamification Achievements...")

    achievements_data = [
        {
            "code": "first_blood",
            "title": "First Blood",
            "description": "Solve your very first DSA coding problem",
            "badge_icon": "Trophy",
            "xp_bonus": 50,
            "category": "problems",
            "display_order": 1
        },
        {
            "code": "century_club",
            "title": "Century Club",
            "description": "Accumulate 100 total experience points",
            "badge_icon": "Zap",
            "xp_bonus": 50,
            "category": "special",
            "display_order": 2
        },
        {
            "code": "streak_3",
            "title": "Triple Fire",
            "description": "Maintain a continuous 3-day practice streak",
            "badge_icon": "Flame",
            "xp_bonus": 75,
            "category": "streak",
            "display_order": 3
        },
        {
            "code": "problem_crusher_5",
            "title": "Problem Crusher",
            "description": "Solve 5 distinct coding challenges",
            "badge_icon": "Award",
            "xp_bonus": 100,
            "category": "problems",
            "display_order": 4
        },
        {
            "code": "streak_7",
            "title": "Week Warrior",
            "description": "Maintain a 7-day uninterrupted practice streak",
            "badge_icon": "Flame",
            "xp_bonus": 150,
            "category": "streak",
            "display_order": 5
        },
        {
            "code": "scholar_first_step",
            "title": "Curious Mind",
            "description": "Complete your first interactive DSA lesson",
            "badge_icon": "BookOpen",
            "xp_bonus": 40,
            "category": "courses",
            "display_order": 6
        },
        {
            "code": "scholar_master_3",
            "title": "Theory Specialist",
            "description": "Complete 3 comprehensive concept modules",
            "badge_icon": "GraduationCap",
            "xp_bonus": 100,
            "category": "courses",
            "display_order": 7
        },
        {
            "code": "polyglot",
            "title": "Polyglot Engineer",
            "description": "Submit problem solutions in 2 or more distinct programming languages",
            "badge_icon": "Code2",
            "xp_bonus": 120,
            "category": "compiler",
            "display_order": 8
        },
        {
            "code": "high_roller_500",
            "title": "Grand Centurion",
            "description": "Amass 500 total XP on the AlgoForge platform",
            "badge_icon": "Crown",
            "xp_bonus": 150,
            "category": "special",
            "display_order": 9
        },
        {
            "code": "problem_master_10",
            "title": "Algorithm Knight",
            "description": "Tackle and conquer 10 challenging DSA problems",
            "badge_icon": "Shield",
            "xp_bonus": 250,
            "category": "problems",
            "display_order": 10
        }
    ]

    for data in achievements_data:
        ach, created = Achievement.objects.get_or_create(
            code=data["code"],
            defaults={
                "title": data["title"],
                "description": data["description"],
                "badge_icon": data["badge_icon"],
                "xp_bonus": data["xp_bonus"],
                "category": data["category"],
                "display_order": data["display_order"]
            }
        )
        print(f"  {'[Created]' if created else '[Exists]'} Achievement: {ach.title} (+{ach.xp_bonus} XP)")

    print("Achievements seeded successfully!")

if __name__ == '__main__':
    run()
