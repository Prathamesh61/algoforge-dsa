from django.contrib import admin
from apps.courses.models import Course, CourseModule, Lesson, CourseEnrollment, LessonProgress

class CourseModuleInline(admin.TabularInline):
    model = CourseModule
    extra = 1

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'is_published', 'created_at')
    list_filter = ('difficulty', 'is_published')
    search_fields = ('title', 'summary')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CourseModuleInline]

@admin.register(CourseModule)
class CourseModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'display_order')
    list_filter = ('course',)
    search_fields = ('title',)
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'estimated_read_time', 'xp_reward', 'display_order')
    list_filter = ('module__course', 'module')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at', 'last_accessed_at')
    list_filter = ('course',)
    search_fields = ('user__username', 'course__title')

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_completed', 'quiz_score', 'completed_at')
    list_filter = ('is_completed',)
    search_fields = ('user__username', 'lesson__title')
