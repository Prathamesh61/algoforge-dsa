import uuid
from django.db import models

class ProblemTag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)

    class Meta:
        db_table = 'problem_tags'
        verbose_name = 'Problem Tag'
        verbose_name_plural = 'Problem Tags'
        ordering = ['name']

    def __str__(self):
        return self.name


class Problem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('Easy', 'Easy'),
            ('Medium', 'Medium'),
            ('Hard', 'Hard')
        ],
        default='Easy'
    )
    xp_reward = models.PositiveIntegerField(default=20)
    tags = models.ManyToManyField(ProblemTag, related_name='problems', blank=True)

    description_markdown = models.TextField()
    input_format = models.TextField(blank=True, default='')
    output_format = models.TextField(blank=True, default='')
    constraints = models.TextField(blank=True, default='')
    examples = models.JSONField(default=list) # [{ "input": "...", "output": "...", "explanation": "..." }]

    time_limit_ms = models.PositiveIntegerField(default=2000)
    memory_limit_mb = models.PositiveIntegerField(default=256)

    # Multi-language starter code templates
    starter_templates = models.JSONField(default=dict)

    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'problems'
        verbose_name = 'Problem'
        verbose_name_plural = 'Problems'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.title} ({self.difficulty})"


class ProblemTestCase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name='test_cases'
    )
    input_data = models.TextField()
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False)
    weight = models.PositiveIntegerField(default=1)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'problem_test_cases'
        verbose_name = 'Problem Test Case'
        verbose_name_plural = 'Problem Test Cases'
        ordering = ['display_order']

    def __str__(self):
        type_str = "Hidden" if self.is_hidden else "Public"
        return f"{self.problem.title} - TestCase {self.display_order} ({type_str})"
