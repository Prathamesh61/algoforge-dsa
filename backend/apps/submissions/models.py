import uuid
from django.db import models
from django.conf import settings
from apps.problems.models import Problem, ProblemTestCase

class Submission(models.Model):
    STATUS_CHOICES = [
        ('Queued', 'Queued'),
        ('Running', 'Running'),
        ('Accepted', 'Accepted'),
        ('Wrong Answer', 'Wrong Answer'),
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded'),
        ('Compilation Error', 'Compilation Error'),
        ('Runtime Error', 'Runtime Error'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions',
        null=True,
        blank=True
    )
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    language = models.CharField(max_length=30)
    source_code = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Queued')

    execution_time_ms = models.PositiveIntegerField(default=0)
    memory_used_kb = models.PositiveIntegerField(default=0)
    tests_passed = models.PositiveIntegerField(default=0)
    tests_total = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'submissions'
        verbose_name = 'Submission'
        verbose_name_plural = 'Submissions'
        ordering = ['-created_at']

    def __str__(self):
        user_name = self.user.username if self.user else "Anonymous"
        return f"{user_name} - {self.problem.title} ({self.status}) [{self.language}]"


class SubmissionTestCaseResult(models.Model):
    STATUS_CHOICES = [
        ('Passed', 'Passed'),
        ('Failed', 'Failed'),
        ('Error', 'Error'),
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        related_name='test_case_results'
    )
    test_case = models.ForeignKey(
        ProblemTestCase,
        on_delete=models.CASCADE,
        related_name='submission_results'
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    execution_time_ms = models.PositiveIntegerField(default=0)
    actual_output = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'submission_test_case_results'
        verbose_name = 'Submission Test Case Result'
        verbose_name_plural = 'Submission Test Case Results'

    def __str__(self):
        return f"{self.submission.id} - TC {self.test_case.display_order} ({self.status})"
