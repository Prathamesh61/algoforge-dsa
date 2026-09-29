from django.contrib import admin
from apps.problems.models import Problem, ProblemTag, ProblemTestCase

class ProblemTestCaseInline(admin.TabularInline):
    model = ProblemTestCase
    extra = 1
    fields = ('display_order', 'is_hidden', 'weight', 'input_data', 'expected_output')

@admin.register(ProblemTag)
class ProblemTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'xp_reward', 'is_published', 'time_limit_ms', 'memory_limit_mb')
    list_filter = ('difficulty', 'is_published', 'tags')
    search_fields = ('title', 'slug', 'description_markdown')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    inlines = [ProblemTestCaseInline]

@admin.register(ProblemTestCase)
class ProblemTestCaseAdmin(admin.ModelAdmin):
    list_display = ('problem', 'display_order', 'is_hidden', 'weight')
    list_filter = ('is_hidden', 'problem')
    search_fields = ('problem__title', 'input_data')
