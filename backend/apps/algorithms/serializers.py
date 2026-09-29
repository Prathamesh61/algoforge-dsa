from rest_framework import serializers
from apps.algorithms.models import Algorithm

class AlgorithmListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'time_complexity_best',
            'time_complexity_avg',
            'time_complexity_worst',
            'space_complexity',
            'default_dataset',
        ]


class AlgorithmDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = [
            'id',
            'slug',
            'name',
            'category',
            'description',
            'time_complexity_best',
            'time_complexity_avg',
            'time_complexity_worst',
            'space_complexity',
            'default_dataset',
            'implementation_code',
            'pseudocode',
            'advantages',
            'limitations',
            'when_to_use',
            'when_not_to_use',
            'common_mistakes',
        ]
