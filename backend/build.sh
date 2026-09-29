#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Install production dependencies
pip install -r requirements.txt

# Collect static files for WhiteNoise
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Seed DSA problems and test cases into the database
python scripts/seed_problems_expanded.py
