from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.roadmaps.models import Roadmap, RoadmapNode, UserRoadmapProgress
from apps.roadmaps.serializers import (
    RoadmapListSerializer,
    RoadmapDetailSerializer,
    RoadmapNodeSerializer
)

class RoadmapListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        roadmaps = Roadmap.objects.filter(is_published=True)
        serializer = RoadmapListSerializer(roadmaps, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RoadmapDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        roadmap = Roadmap.objects.filter(slug=slug, is_published=True).first()
        if not roadmap:
            return Response({'error': f'Roadmap "{slug}" not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RoadmapDetailSerializer(roadmap, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateNodeProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, node_slug):
        node = RoadmapNode.objects.filter(slug=node_slug).first()
        if not node:
            return Response({'error': f'Node "{node_slug}" not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status', 'in_progress')
        progress_percentage = int(request.data.get('progress_percentage', 50))

        if new_status not in ['locked', 'in_progress', 'completed']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        prog, _ = UserRoadmapProgress.objects.get_or_create(
            user=request.user,
            node=node,
            defaults={'status': new_status, 'progress_percentage': progress_percentage}
        )
        prog.status = new_status
        prog.progress_percentage = progress_percentage
        if new_status == 'completed' and not prog.completed_at:
            from django.utils import timezone
            prog.completed_at = timezone.now()
        prog.save()

        serializer = RoadmapNodeSerializer(node, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
