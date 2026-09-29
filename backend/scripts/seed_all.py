import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

def run_all():
    print("=" * 60)
    print("AlgoForge Platform: Seeding Full Curriculum & Datasets")
    print("=" * 60)

    try:
        from scripts.seed_courses import run as seed_courses
        print("\n--- 1. Seeding Courses & Concept Lessons ---")
        seed_courses()
    except Exception as e:
        print(f"Error seeding courses: {e}")

    try:
        from scripts.seed_problems import run as seed_problems
        print("\n--- 2. Seeding Problems & Test Cases ---")
        seed_problems()
    except Exception as e:
        print(f"Error seeding problems: {e}")

    try:
        from scripts.seed_achievements import run as seed_achievements
        print("\n--- 3. Seeding Badges & Achievements ---")
        seed_achievements()
    except Exception as e:
        print(f"Error seeding achievements: {e}")

    try:
        from scripts.seed_roadmaps import run as seed_roadmaps
        print("\n--- 4. Seeding 7-Tier Learning Roadmap ---")
        seed_roadmaps()
    except Exception as e:
        print(f"Error seeding roadmap: {e}")

    print("\n" + "=" * 60)
    print("AlgoForge: All Datasets Successfully Seeded!")
    print("=" * 60)

if __name__ == '__main__':
    run_all()
