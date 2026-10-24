from django.apps import apps
from rest_framework import serializers

from .models import Problem, ProblemTag, ProblemTestCase


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
            Submission = apps.get_model('submissions', 'Submission')
            solved_ids = self.context.get('solved_problem_ids')
            if solved_ids is not None:
                return obj.id in solved_ids
            return Submission.objects.filter(
                user=request.user,
                problem=obj,
                status='Accepted'
            ).exists()
        except Exception:
            return False


class ProblemDetailSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    hints = serializers.SerializerMethodField()
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
            'hints',
            'public_test_cases',
            'is_solved',
        ]

    def get_hints(self, obj):
        if isinstance(obj.hints, list) and len(obj.hints) > 0:
            return obj.hints
        if isinstance(obj.hints, str) and obj.hints.strip():
            return [obj.hints.strip()]

        tag_slugs = [t.slug for t in obj.tags.all()] if hasattr(obj, 'tags') else []
        dynamic_hints = []

        if 'hash-map' in tag_slugs:
            dynamic_hints.append("Can you store elements you have already seen in a Hash Map to achieve O(1) average lookup time?")
        elif 'binary-search' in tag_slugs:
            dynamic_hints.append("Notice any monotonic property in the problem or search space. Can you eliminate half of the candidates in each iteration?")
        elif 'two-pointers' in tag_slugs:
            dynamic_hints.append("Consider maintaining two pointers (e.g. left and right boundaries, or slow and fast pointers) to process elements in linear time.")
        elif 'dynamic-programming' in tag_slugs:
            dynamic_hints.append("Look for overlapping subproblems and optimal substructure. What minimal state captures your current decision?")
        elif 'sliding-window' in tag_slugs:
            dynamic_hints.append("Maintain an active window [left, right]. Expand right until the condition is met, then contract left.")
        elif 'stack' in tag_slugs:
            dynamic_hints.append("A Last-In-First-Out (LIFO) stack can help match pairs, track previous greater/smaller elements, or maintain order.")
        elif 'tree' in tag_slugs or 'binary-tree' in tag_slugs:
            dynamic_hints.append("Think recursively: solve the subproblem for the left and right subtrees first, then combine their results.")
        else:
            dynamic_hints.append(f"Start by analyzing the brute-force solution for {obj.title}. Where is the repeated or redundant work occurring?")

        if 'dynamic-programming' in tag_slugs:
            dynamic_hints.append("Formulate the transition relation: dp[i] = f(dp[i-1], ...). If space is tight, check if you only need the previous 1-2 states.")
        elif 'binary-search' in tag_slugs:
            dynamic_hints.append("Be careful with bounds: compute mid = low + (high - low) // 2 and decide whether low = mid + 1 or high = mid - 1.")
        elif 'hash-map' in tag_slugs:
            dynamic_hints.append("Trading space for time: an extra O(N) auxiliary space map can often reduce an O(N²) quadratic search down to O(N) linear time.")
        elif 'two-pointers' in tag_slugs:
            dynamic_hints.append("Ensure the array is sorted if using opposite-direction pointers, or verify loop invariant conditions.")
        else:
            dynamic_hints.append("Consider what edge cases might break your logic (e.g., empty input, single element, negative numbers, or duplicates).")

        if obj.difficulty == 'Easy':
            dynamic_hints.append("Target complexity: Aim for O(N) or O(N log N) time with O(1) or O(N) auxiliary space.")
        elif obj.difficulty == 'Medium':
            dynamic_hints.append("Target complexity: Aim for O(N) or O(N log N) time complexity. Avoid nested O(N²) loops if N > 10^4.")
        else:
            dynamic_hints.append("Target complexity: For Hard problems, watch out for recursion stack limits or constraints requiring O(N) or O(log N).")

        return dynamic_hints

    def get_public_test_cases(self, obj):
        public_cases = obj.test_cases.filter(is_hidden=False)
        return ProblemTestCaseSerializer(public_cases, many=True).data

    def get_is_solved(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        try:
            Submission = apps.get_model('submissions', 'Submission')
            solved_ids = self.context.get('solved_problem_ids')
            if solved_ids is not None:
                return obj.id in solved_ids
            return Submission.objects.filter(
                user=request.user,
                problem=obj,
                status='Accepted'
            ).exists()
        except Exception:
            return False
