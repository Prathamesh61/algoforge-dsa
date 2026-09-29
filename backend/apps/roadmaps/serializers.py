from rest_framework import serializers
from apps.roadmaps.models import Roadmap, RoadmapNode, UserRoadmapProgress

class RoadmapNodeSerializer(serializers.ModelSerializer):
    prerequisite_slugs = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = RoadmapNode
        fields = [
            'id',
            'slug',
            'title',
            'tier',
            'category',
            'description',
            'icon',
            'estimated_hours',
            'display_order',
            'linked_course_slug',
            'linked_lesson_slug',
            'linked_tag_slug',
            'prerequisite_slugs',
            'status',
            'progress_percentage'
        ]

    def get_prerequisite_slugs(self, obj):
        return [p.slug for p in obj.prerequisites.all()]

    def get_status(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            # Default state: Tier 1 is in_progress, others are locked
            return 'in_progress' if obj.tier == 1 else 'locked'

        prog = UserRoadmapProgress.objects.filter(user=request.user, node=obj).first()
        if prog:
            return prog.status

        # If no explicit record, compute dynamically:
        # If all prerequisites are completed (or tier 1 has no prereqs), mark in_progress
        prereqs = obj.prerequisites.all()
        if not prereqs.exists():
            return 'in_progress'

        prereq_completed = UserRoadmapProgress.objects.filter(
            user=request.user,
            node__in=prereqs,
            status='completed'
        ).count() == prereqs.count()

        return 'in_progress' if prereq_completed else 'locked'

    def get_progress_percentage(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 25 if obj.tier == 1 else 0

        prog = UserRoadmapProgress.objects.filter(user=request.user, node=obj).first()
        if prog:
            return prog.progress_percentage
        return 0


class RoadmapDetailSerializer(serializers.ModelSerializer):
    nodes = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Roadmap
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'icon',
            'nodes',
            'stats'
        ]

    def get_nodes(self, obj):
        nodes = obj.nodes.all().prefetch_related('prerequisites')
        return RoadmapNodeSerializer(nodes, many=True, context=self.context).data

    def get_stats(self, obj):
        nodes_data = self.get_nodes(obj)
        total = len(nodes_data)
        completed = sum(1 for n in nodes_data if n['status'] == 'completed')
        in_progress = sum(1 for n in nodes_data if n['status'] == 'in_progress')
        percentage = int((completed / total) * 100) if total > 0 else 0
        return {
            'total_nodes': total,
            'completed_nodes': completed,
            'in_progress_nodes': in_progress,
            'overall_percentage': percentage
        }


class RoadmapListSerializer(serializers.ModelSerializer):
    node_count = serializers.IntegerField(source='nodes.count', read_only=True)

    class Meta:
        model = Roadmap
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'icon',
            'node_count'
        ]
