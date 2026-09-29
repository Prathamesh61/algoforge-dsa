import uuid
from django.db import models
from django.conf import settings

class Roadmap(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='Map')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roadmaps'
        verbose_name = 'Roadmap'
        verbose_name_plural = 'Roadmaps'
        ordering = ['title']

    def __str__(self):
        return self.title


class RoadmapNode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name='nodes'
    )
    slug = models.SlugField(max_length=100, db_index=True)
    title = models.CharField(max_length=200)
    tier = models.PositiveIntegerField(default=1) # 1 to 7
    category = models.CharField(max_length=100, default='Foundations')
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='Layers')
    estimated_hours = models.PositiveIntegerField(default=4)
    display_order = models.PositiveIntegerField(default=0)

    prerequisites = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='unlocks'
    )

    linked_course_slug = models.CharField(max_length=100, blank=True, default='')
    linked_lesson_slug = models.CharField(max_length=100, blank=True, default='')
    linked_tag_slug = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        db_table = 'roadmap_nodes'
        verbose_name = 'Roadmap Node'
        verbose_name_plural = 'Roadmap Nodes'
        unique_together = ('roadmap', 'slug')
        ordering = ['tier', 'display_order']

    def __str__(self):
        return f"[Tier {self.tier}] {self.title}"


class UserRoadmapProgress(models.Model):
    STATUS_CHOICES = [
        ('locked', 'Locked'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='roadmap_progress'
    )
    node = models.ForeignKey(
        RoadmapNode,
        on_delete=models.CASCADE,
        related_name='user_progresses'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='locked')
    progress_percentage = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_roadmap_progress'
        verbose_name = 'User Roadmap Progress'
        verbose_name_plural = 'User Roadmap Progresses'
        unique_together = ('user', 'node')

    def __str__(self):
        return f"{self.user.username} - {self.node.title} ({self.status})"
