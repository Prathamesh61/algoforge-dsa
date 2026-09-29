from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.problems.models import Problem
from apps.submissions.models import Submission
from apps.submissions.serializers import SubmissionSerializer
from apps.submissions.services.evaluator import SubmissionEvaluator

class SubmissionListCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        problem_slug = request.data.get('problem_slug')
        language = request.data.get('language')
        source_code = request.data.get('source_code')

        if not problem_slug:
            return Response({'error': 'problem_slug is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not language:
            return Response({'error': 'language is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not source_code:
            return Response({'error': 'source_code is required'}, status=status.HTTP_400_BAD_REQUEST)

        problem = Problem.objects.filter(slug=problem_slug).first()
        if not problem:
            return Response({'error': f'Problem "{problem_slug}" not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None

        submission = Submission.objects.create(
            user=user,
            problem=problem,
            language=language,
            source_code=source_code,
            status='Queued'
        )

        # Run automated evaluation against public + hidden test cases
        evaluated = SubmissionEvaluator.evaluate(submission)

        serializer = SubmissionSerializer(evaluated)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        queryset = Submission.objects.all()

        if request.user.is_authenticated:
            queryset = queryset.filter(user=request.user)

        problem_slug = request.query_params.get('problem_slug')
        if problem_slug:
            queryset = queryset.filter(problem__slug=problem_slug)

        serializer = SubmissionSerializer(queryset[:25], many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmissionDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        submission = Submission.objects.filter(id=pk).prefetch_related('test_case_results').first()
        if not submission:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)
