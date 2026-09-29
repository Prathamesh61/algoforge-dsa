from django.contrib import admin
from apps.submissions.models import Submission, SubmissionTestCaseResult

class SubmissionTestCaseResultInline(admin.TabularInline):
    model = SubmissionTestCaseResult
    extra = 0
    readonly_fields = ('test_case', 'status', 'execution_time_ms', 'actual_output')
    can_delete = False

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'problem', 'language', 'status', 'tests_passed', 'tests_total', 'execution_time_ms', 'created_at')
    list_filter = ('status', 'language', 'created_at')
    search_fields = ('user__username', 'problem__title', 'id')
    readonly_fields = ('created_at',)
    inlines = [SubmissionTestCaseResultInline]

@admin.register(SubmissionTestCaseResult)
class SubmissionTestCaseResultAdmin(admin.ModelAdmin):
    list_display = ('submission', 'test_case', 'status', 'execution_time_ms')
    list_filter = ('status',)
