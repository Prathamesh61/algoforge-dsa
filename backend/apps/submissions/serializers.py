from rest_framework import serializers
from apps.submissions.models import Submission, SubmissionTestCaseResult

class SubmissionTestCaseResultSerializer(serializers.ModelSerializer):
    display_order = serializers.IntegerField(source='test_case.display_order', read_only=True)
    is_hidden = serializers.BooleanField(source='test_case.is_hidden', read_only=True)

    class Meta:
        model = SubmissionTestCaseResult
        fields = [
            'id',
            'display_order',
            'status',
            'execution_time_ms',
            'actual_output',
            'is_hidden'
        ]


class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    problem_slug = serializers.CharField(source='problem.slug', read_only=True)
    test_case_results = SubmissionTestCaseResultSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = [
            'id',
            'problem_slug',
            'problem_title',
            'language',
            'source_code',
            'status',
            'execution_time_ms',
            'memory_used_kb',
            'tests_passed',
            'tests_total',
            'error_message',
            'created_at',
            'test_case_results'
        ]
        read_only_fields = [
            'id',
            'status',
            'execution_time_ms',
            'memory_used_kb',
            'tests_passed',
            'tests_total',
            'error_message',
            'created_at',
            'test_case_results'
        ]
