from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.algorithms.models import Algorithm
from apps.algorithms.serializers import AlgorithmListSerializer, AlgorithmDetailSerializer

class AlgorithmListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        queryset = Algorithm.objects.all()
        if category:
            queryset = queryset.filter(category__iexact=category)

        serializer = AlgorithmListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AlgorithmDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        algo = Algorithm.objects.filter(slug=slug).first()
        if not algo:
            return Response({'error': 'Algorithm not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AlgorithmDetailSerializer(algo)
        return Response(serializer.data, status=status.HTTP_200_OK)
