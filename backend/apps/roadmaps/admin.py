from django.contrib import admin
from apps.roadmaps.models import Roadmap, RoadmapNode, UserRoadmapProgress

class RoadmapNodeInline(admin.TabularInline):
    model = RoadmapNode
    extra = 1
    fields = ('tier', 'title', 'category', 'estimated_hours', 'display_order')

@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'created_at')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [RoadmapNodeInline]

@admin.register(RoadmapNode)
class RoadmapNodeAdmin(admin.ModelAdmin):
    list_display = ('title', 'roadmap', 'tier', 'category', 'estimated_hours', 'display_order')
    list_filter = ('roadmap', 'tier', 'category')
    search_fields = ('title', 'slug', 'description')
    filter_horizontal = ('prerequisites',)

@admin.register(UserRoadmapProgress)
class UserRoadmapProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'node', 'status', 'progress_percentage', 'completed_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'node__title')
