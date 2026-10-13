from django.utils import timezone
from apps.problems.models import Problem

def get_daily_challenge_problem(target_date=None):
    """
    Returns today's daily challenge problem deterministically based on date.
    All users across the platform share the same daily challenge on a given day.
    """
    if target_date is None:
        target_date = timezone.now().date()
    
    problems = Problem.objects.filter(is_published=True).order_by('id')
    total = problems.count()
    if total == 0:
        return None
    
    today_seed = target_date.year * 1000 + target_date.timetuple().tm_yday
    index = (today_seed * 17) % total
    return problems[index]
