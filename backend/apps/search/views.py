from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.problems.models import Problem
from apps.courses.models import Course, Lesson
from apps.algorithms.models import Algorithm
from apps.roadmaps.models import RoadmapNode

class GlobalSearchView(APIView):
    """
    GET /api/v1/search/?q=<query>
    Unified multi-entity search across Problems, Courses, Lessons, Algorithms, and Roadmap nodes.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query or len(query) < 2:
            return Response({
                'query': query,
                'total_results': 0,
                'results': []
            }, status=status.HTTP_200_OK)

        results = []

        # 1. Search Algorithms
        algos = Algorithm.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__icontains=query)
        )[:5]
        for a in algos:
            results.append({
                'id': str(a.id),
                'category': 'Algorithms',
                'title': a.name,
                'subtitle': f"{a.category} • Time: {a.time_complexity_avg}",
                'url': f"/visualizer?algo={a.slug}",
                'badge': a.category,
            })

        # 2. Search Problems
        problems = Problem.objects.filter(
            Q(title__icontains=query) |
            Q(description_markdown__icontains=query) |
            Q(tags__name__icontains=query),
            is_published=True
        ).distinct()[:8]
        for p in problems:
            tag_names = ", ".join([t.name for t in p.tags.all()[:2]])
            results.append({
                'id': str(p.id),
                'category': 'Problems',
                'title': p.title,
                'subtitle': f"{p.difficulty} • {tag_names or 'Practice'}",
                'url': f"/problems/{p.slug}",
                'badge': p.difficulty,
            })

        # 3. Search Courses
        courses = Course.objects.filter(
            Q(title__icontains=query) |
            Q(summary__icontains=query),
            is_published=True
        )[:4]
        for c in courses:
            results.append({
                'id': str(c.id),
                'category': 'Courses',
                'title': c.title,
                'subtitle': f"{c.difficulty} • Core Course",
                'url': f"/courses/{c.slug}",
                'badge': c.difficulty,
            })

        # 4. Search Lessons
        lessons = Lesson.objects.filter(
            title__icontains=query,
            is_published=True
        ).select_related('module__course')[:5]
        for l in lessons:
            course_title = l.module.course.title if l.module and l.module.course else "Lesson"
            results.append({
                'id': str(l.id),
                'category': 'Lessons',
                'title': l.title,
                'subtitle': f"Course: {course_title} • {l.estimated_read_time}m",
                'url': f"/lessons/{l.slug}",
                'badge': 'Lesson',
            })

        # 5. Search Roadmap Nodes
        nodes = RoadmapNode.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )[:4]
        for n in nodes:
            results.append({
                'id': str(n.id),
                'category': 'Roadmap',
                'title': n.title,
                'subtitle': f"Tier {n.tier} • {n.category}",
                'url': '/roadmap',
                'badge': f"Tier {n.tier}",
            })

        return Response({
            'query': query,
            'total_results': len(results),
            'results': results
        }, status=status.HTTP_200_OK)
