import uuid
from django.db import models
from django.conf import settings

class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('Beginner', 'Beginner'),
            ('Intermediate', 'Intermediate'),
            ('Advanced', 'Advanced')
        ],
        default='Beginner'
    )
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'courses'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.title} ({self.difficulty})"


class CourseModule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules'
    )
    title = models.CharField(max_length=200)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'course_modules'
        verbose_name = 'Course Module'
        verbose_name_plural = 'Course Modules'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        CourseModule,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    estimated_read_time = models.PositiveIntegerField(default=8) # in minutes
    xp_reward = models.PositiveIntegerField(default=10)
    content_blocks = models.JSONField(default=list) # Data-driven blocks
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        db_table = 'lessons'
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        ordering = ['display_order']

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class CourseEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_enrollments'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    current_lesson = models.ForeignKey(
        Lesson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'course_enrollments'
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"


class LessonProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='user_progress'
    )
    is_completed = models.BooleanField(default=False)
    quiz_score = models.PositiveIntegerField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'lesson_progress'
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({'Done' if self.is_completed else 'In Progress'})"
