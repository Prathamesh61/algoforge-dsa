from apps.achievements.models import Achievement, UserAchievement
from apps.progress.models import UserRecentActivity

class AchievementChecker:
    @classmethod
    def check_and_unlock(cls, user):
        if not user or not user.is_authenticated:
            return []

        profile = getattr(user, 'profile', None)
        if not profile:
            return []

        unlocked_codes = set(
            UserAchievement.objects.filter(user=user).values_list('achievement__code', flat=True)
        )

        all_achievements = {a.code: a for a in Achievement.objects.all()}
        newly_unlocked = []

        def grant(code):
            if code in all_achievements and code not in unlocked_codes:
                ach = all_achievements[code]
                _, created = UserAchievement.objects.get_or_create(user=user, achievement=ach)
                if created:
                    unlocked_codes.add(code)
                    newly_unlocked.append(ach)

                    # Award bonus XP
                    profile.total_xp += ach.xp_bonus
                    profile.current_level = (profile.total_xp // 100) + 1
                    profile.save(update_fields=['total_xp', 'current_level'])

                    # Activity record
                    UserRecentActivity.objects.create(
                        user=user,
                        activity_type='achievement_unlocked',
                        title=f'Unlocked "{ach.title}"',
                        subtitle=f'+{ach.xp_bonus} XP Bonus • {ach.description}',
                        xp_earned=ach.xp_bonus
                    )

        # 1. Problem solving checks
        if profile.problems_solved_count >= 1:
            grant('first_blood')
        if profile.problems_solved_count >= 5:
            grant('problem_crusher_5')
        if profile.problems_solved_count >= 10:
            grant('problem_master_10')

        # 2. Streak milestones
        max_streak = max(profile.current_streak, profile.longest_streak)
        if max_streak >= 3:
            grant('streak_3')
        if max_streak >= 7:
            grant('streak_7')

        # 3. XP milestones
        if profile.total_xp >= 100:
            grant('century_club')
        if profile.total_xp >= 500:
            grant('high_roller_500')

        # 4. Lessons completed
        if profile.lessons_completed_count >= 1:
            grant('scholar_first_step')
        if profile.lessons_completed_count >= 3:
            grant('scholar_master_3')

        # 5. Polyglot check (2+ languages used in submissions)
        from apps.submissions.models import Submission
        lang_count = Submission.objects.filter(user=user).values('language').distinct().count()
        if lang_count >= 2:
            grant('polyglot')

        return newly_unlocked
