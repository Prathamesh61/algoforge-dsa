from rest_framework import serializers
from apps.courses.models import Course, CourseModule, Lesson, CourseEnrollment, LessonProgress

class LessonSummarySerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id',
            'slug',
            'title',
            'estimated_read_time',
            'xp_reward',
            'display_order',
            'is_completed',
            'is_locked',
        ]

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        completed_set = self.context.get('completed_lesson_ids')
        if completed_set is not None:
            return str(obj.id) in completed_set or obj.id in completed_set
        return LessonProgress.objects.filter(user=request.user, lesson=obj, is_completed=True).exists()

    def get_is_locked(self, obj):
        # First lesson of each module is unlocked; subsequent lessons unlock when previous is complete
        # Or allow open reading in beginner courses
        return False


class LessonDetailSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    module_title = serializers.CharField(source='module.title', read_only=True)
    course_title = serializers.CharField(source='module.course.title', read_only=True)
    course_slug = serializers.CharField(source='module.course.slug', read_only=True)
    next_lesson = serializers.SerializerMethodField()
    prev_lesson = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id',
            'slug',
            'title',
            'estimated_read_time',
            'xp_reward',
            'content_blocks',
            'module_title',
            'course_title',
            'course_slug',
            'is_completed',
            'next_lesson',
            'prev_lesson',
        ]

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return LessonProgress.objects.filter(user=request.user, lesson=obj, is_completed=True).exists()

    def get_next_lesson(self, obj):
        next_les = Lesson.objects.filter(
            module=obj.module,
            display_order__gt=obj.display_order
        ).order_by('display_order').first()
        if next_les:
            return {'slug': next_les.slug, 'title': next_les.title}
        return None

    def get_prev_lesson(self, obj):
        prev_les = Lesson.objects.filter(
            module=obj.module,
            display_order__lt=obj.display_order
        ).order_by('-display_order').first()
        if prev_les:
            return {'slug': prev_les.slug, 'title': prev_les.title}
        return None


class CourseModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = CourseModule
        fields = ['id', 'title', 'display_order', 'lessons']

    def get_lessons(self, obj):
        serializer = LessonSummarySerializer(
            obj.lessons.filter(is_published=True),
            many=True,
            context=self.context
        )
        return serializer.data


class CourseListSerializer(serializers.ModelSerializer):
    modules_count = serializers.IntegerField(source='modules.count', read_only=True)
    lessons_count = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'slug',
            'title',
            'summary',
            'thumbnail_url',
            'difficulty',
            'modules_count',
            'lessons_count',
            'completion_percentage',
            'is_enrolled',
        ]

    def get_lessons_count(self, obj):
        return Lesson.objects.filter(module__course=obj, is_published=True).count()

    def get_completion_percentage(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        total_lessons = Lesson.objects.filter(module__course=obj, is_published=True).count()
        if total_lessons == 0:
            return 0
        completed = LessonProgress.objects.filter(
            user=request.user,
            lesson__module__course=obj,
            is_completed=True
        ).count()
        return min(100, int((completed / total_lessons) * 100))

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return CourseEnrollment.objects.filter(user=request.user, course=obj).exists()


class CourseDetailSerializer(serializers.ModelSerializer):
    modules = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()
    completion_percentage = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'slug',
            'title',
            'summary',
            'thumbnail_url',
            'difficulty',
            'modules',
            'lessons_count',
            'completion_percentage',
            'is_enrolled',
        ]

    def get_modules(self, obj):
        request = self.context.get('request')
        completed_ids = set()
        if request and request.user.is_authenticated:
            completed_ids = set(
                LessonProgress.objects.filter(user=request.user, is_completed=True)
                .values_list('lesson_id', flat=True)
            )
        ctx = {**self.context, 'completed_lesson_ids': completed_ids}
        return CourseModuleSerializer(obj.modules.all(), many=True, context=ctx).data

    def get_lessons_count(self, obj):
        return Lesson.objects.filter(module__course=obj, is_published=True).count()

    def get_completion_percentage(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        total = Lesson.objects.filter(module__course=obj, is_published=True).count()
        if total == 0:
            return 0
        completed = LessonProgress.objects.filter(
            user=request.user,
            lesson__module__course=obj,
            is_completed=True
        ).count()
        return min(100, int((completed / total) * 100))

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return CourseEnrollment.objects.filter(user=request.user, course=obj).exists()
