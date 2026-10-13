import datetime
from django.utils import timezone
from apps.compiler.runner import CodeRunner
from apps.submissions.models import Submission, SubmissionTestCaseResult
from apps.progress.models import UserDailyActivity, UserRecentActivity

class SubmissionEvaluator:
    @classmethod
    def evaluate(cls, submission: Submission):
        problem = submission.problem
        test_cases = list(problem.test_cases.all().order_by('display_order'))

        submission.status = 'Running'
        submission.tests_total = len(test_cases)
        submission.save(update_fields=['status', 'tests_total'])

        total_exec_time = 0
        tests_passed = 0
        final_verdict = 'Accepted'
        first_error_msg = ''

        time_limit_sec = max(problem.time_limit_ms / 1000.0, 1.0)

        for tc in test_cases:
            res = CodeRunner.execute(
                language=submission.language,
                source_code=submission.source_code,
                stdin=tc.input_data,
                time_limit_sec=time_limit_sec
            )

            total_exec_time += res['execution_time_ms']

            if res['status'] == 'Time Limit Exceeded':
                tc_status = 'Time Limit Exceeded'
                if final_verdict == 'Accepted':
                    final_verdict = 'Time Limit Exceeded'
                    first_error_msg = 'Time Limit Exceeded'
            elif res['exit_code'] != 0 or res['status'] == 'Runtime Error':
                tc_status = 'Error'
                if final_verdict == 'Accepted':
                    final_verdict = 'Runtime Error'
                    first_error_msg = res.get('stderr', 'Runtime Error')
            elif res['status'] == 'Compilation Error':
                tc_status = 'Error'
                if final_verdict == 'Accepted':
                    final_verdict = 'Compilation Error'
                    first_error_msg = res.get('stderr', 'Compilation Error')
            else:
                # Compare output normalized
                actual = res['stdout'].strip().replace('\r\n', '\n')
                expected = tc.expected_output.strip().replace('\r\n', '\n')

                if actual == expected:
                    tc_status = 'Passed'
                    tests_passed += 1
                else:
                    tc_status = 'Failed'
                    if final_verdict == 'Accepted':
                        final_verdict = 'Wrong Answer'
                        first_error_msg = f'Expected "{expected}", got "{actual}"'

            # Record test case result
            SubmissionTestCaseResult.objects.create(
                submission=submission,
                test_case=tc,
                status=tc_status,
                execution_time_ms=res['execution_time_ms'],
                actual_output=res['stdout'] if not tc.is_hidden else ''
            )

            # If failed/error, stop further execution to conserve system resources
            if tc_status != 'Passed':
                break

        submission.status = final_verdict
        submission.tests_passed = tests_passed
        submission.execution_time_ms = total_exec_time
        submission.error_message = first_error_msg
        submission.save()

        # Handle gamification rewards if Accepted and user is authenticated
        if final_verdict == 'Accepted' and submission.user:
            cls._award_user_progress(submission)

        return submission

    @classmethod
    def _award_user_progress(cls, submission: Submission):
        user = submission.user
        problem = submission.problem
        profile = getattr(user, 'profile', None)
        if not profile:
            return

        today = timezone.now().date()

        # Check if already solved previously
        prior_solved = Submission.objects.filter(
            user=user,
            problem=problem,
            status='Accepted'
        ).exclude(id=submission.id).exists()

        # Check if this problem is flagged and verified as today's Daily Challenge
        is_daily_flag = getattr(submission, 'is_daily_challenge', False)
        from apps.problems.services import get_daily_challenge_problem
        daily_challenge_problem = get_daily_challenge_problem(today)
        is_daily_challenge = is_daily_flag and (daily_challenge_problem and daily_challenge_problem.id == problem.id)
        already_solved_daily_today = False
        if is_daily_challenge:
            already_solved_daily_today = Submission.objects.filter(
                user=user,
                problem=problem,
                status='Accepted',
                created_at__date=today
            ).exclude(id=submission.id).exists()

        # Calculate XP to award
        xp_to_award = 0
        if not prior_solved:
            xp_to_award += problem.xp_reward
            profile.problems_solved_count += 1
        elif is_daily_challenge and not already_solved_daily_today:
            # Re-solving today's daily challenge awards daily challenge completion XP
            xp_to_award += problem.xp_reward
        else:
            # Repeat practice solve
            xp_to_award += 5

        # Double XP bonus if completing today's daily challenge
        if is_daily_challenge and not already_solved_daily_today:
            xp_to_award += problem.xp_reward

        profile.total_xp += xp_to_award
        profile.current_level = (profile.total_xp // 100) + 1

        # Always update streak on accepted submission
        if profile.last_active_date != today:
            if profile.last_active_date == today - datetime.timedelta(days=1):
                profile.current_streak += 1
            elif profile.last_active_date is None or profile.last_active_date < today - datetime.timedelta(days=1):
                profile.current_streak = 1

            if profile.current_streak > profile.longest_streak:
                profile.longest_streak = profile.current_streak

            profile.last_active_date = today

        profile.save()

        # Record Daily Activity (increments daily goal solved count)
        daily_act, _ = UserDailyActivity.objects.get_or_create(
            user=user,
            activity_date=today,
            defaults={'problems_solved': 0, 'xp_earned': 0}
        )
        daily_act.problems_solved += 1
        daily_act.xp_earned += xp_to_award
        daily_act.save()

        # Record Recent Activity
        activity_title = f'Completed Daily Challenge: {problem.title}' if (is_daily_challenge and not already_solved_daily_today) else f'Solved {problem.title}'
        activity_subtitle = f'{problem.difficulty} • +{xp_to_award} XP' + (' (2x Daily Bonus!)' if (is_daily_challenge and not already_solved_daily_today) else '')
        UserRecentActivity.objects.create(
            user=user,
            activity_type='problem_solved',
            title=activity_title,
            subtitle=activity_subtitle,
            xp_earned=xp_to_award
        )

        # Auto-check and unlock achievements
        try:
            from apps.achievements.services.evaluator import AchievementChecker
            AchievementChecker.check_and_unlock(user)
        except Exception:
            pass
