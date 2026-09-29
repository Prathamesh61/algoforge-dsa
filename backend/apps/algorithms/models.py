import uuid
from django.db import models

class Algorithm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    name = models.CharField(max_length=150)
    category = models.CharField(
        max_length=50,
        choices=[
            ('Searching', 'Searching'),
            ('Sorting', 'Sorting'),
            ('Arrays', 'Arrays'),
            ('Linked Lists', 'Linked Lists'),
            ('Trees', 'Trees'),
            ('Graphs', 'Graphs'),
            ('DP', 'Dynamic Programming'),
        ],
        default='Searching'
    )
    description = models.TextField()
    time_complexity_best = models.CharField(max_length=50, default='O(1)')
    time_complexity_avg = models.CharField(max_length=50, default='O(n)')
    time_complexity_worst = models.CharField(max_length=50, default='O(n)')
    space_complexity = models.CharField(max_length=50, default='O(1)')

    default_dataset = models.JSONField(default=list)
    implementation_code = models.JSONField(default=dict) # { "python": "...", "javascript": "...", "cpp": "..." }
    pseudocode = models.TextField(blank=True, default='')

    advantages = models.JSONField(default=list)
    limitations = models.JSONField(default=list)
    when_to_use = models.TextField(blank=True, default='')
    when_not_to_use = models.TextField(blank=True, default='')
    common_mistakes = models.JSONField(default=list)

    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'algorithms'
        verbose_name = 'Algorithm'
        verbose_name_plural = 'Algorithms'
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"
