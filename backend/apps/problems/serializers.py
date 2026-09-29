from rest_framework import serializers
from apps.problems.models import Problem, ProblemTag, ProblemTestCase

class ProblemTagSerializer(serializers.ModelSerializer):
    problem_count = serializers.IntegerField(source='problems.count', read_only=True)

    class Meta:
        model = ProblemTag
        fields = ['id', 'name', 'slug', 'problem_count']


class ProblemTestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemTestCase
        fields = ['id', 'input_data', 'expected_output', 'is_hidden', 'display_order']


class ProblemListSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    is_solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = [
            'id',
            'slug',
            'title',
            'difficulty',
            'xp_reward',
            'tags',
            'is_solved',
        ]

    def get_is_solved(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        try:
            from apps.submissions.models import Submission
            return Submission.objects.filter(
                user=request.user,
                problem=obj,
                status='Accepted'
            ).exists()
        except (ImportError, Exception):
            return False


class ProblemDetailSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    public_test_cases = serializers.SerializerMethodField()
    is_solved = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = [
            'id',
            'slug',
            'title',
            'difficulty',
            'xp_reward',
            'tags',
            'description_markdown',
            'input_format',
            'output_format',
            'constraints',
            'examples',
            'time_limit_ms',
            'memory_limit_mb',
            'starter_templates',
            'public_test_cases',
            'is_solved',
        ]

    def get_public_test_cases(self, obj):
        public_cases = obj.test_cases.filter(is_hidden=False)
        return ProblemTestCaseSerializer(public_cases, many=True).data

    def get_is_solved(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        try:
            from apps.submissions.models import Submission
            return Submission.objects.filter(
                user=request.user,
                problem=obj,
                status='Accepted'
            ).exists()
        except (ImportError, Exception):
            return False
