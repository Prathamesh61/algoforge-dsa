from datetime import date
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q

from apps.problems.models import Problem, ProblemTag
from apps.problems.serializers import (
    ProblemListSerializer,
    ProblemDetailSerializer,
    ProblemTagSerializer
)

class ProblemListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Problem.objects.filter(is_published=True).prefetch_related('tags')

        # Filters
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description_markdown__icontains=search)
            )

        difficulty = request.query_params.get('difficulty')
        if difficulty and difficulty.lower() != 'all':
            queryset = queryset.filter(difficulty__iexact=difficulty)

        tag = request.query_params.get('tag')
        if tag and tag.lower() != 'all':
            queryset = queryset.filter(tags__slug__iexact=tag)

        serializer = ProblemListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProblemDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        problem = Problem.objects.filter(slug=slug, is_published=True).prefetch_related('tags', 'test_cases').first()
        if not problem:
            return Response({'error': 'Problem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProblemDetailSerializer(problem, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)



class ProblemTagListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        tags = ProblemTag.objects.all()
        serializer = ProblemTagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DailyProblemView(APIView):
    """
    GET /api/v1/problems/daily/
    Returns a deterministically selected "Problem of the Day" based on the
    current date, cycling through all published problems. The same problem
    is returned for all users on a given calendar day.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        problems = list(
            Problem.objects.filter(is_published=True)
            .prefetch_related('tags')
            .order_by('created_at')
        )
        if not problems:
            return Response({'error': 'No problems available yet.'}, status=status.HTTP_404_NOT_FOUND)

        today = date.today()
        day_index = today.timetuple().tm_yday  # day of year: 1–365
        problem = problems[(day_index - 1) % len(problems)]

        serializer = ProblemDetailSerializer(problem, context={'request': request})
        data = serializer.data
        data['is_daily'] = True
        data['xp_multiplier'] = 2
        data['daily_date'] = today.isoformat()
        return Response(data, status=status.HTTP_200_OK)
