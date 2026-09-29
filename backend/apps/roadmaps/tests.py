from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.roadmaps.models import Roadmap, RoadmapNode, UserRoadmapProgress

class RoadmapAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='explorer@algoforge.dev',
            username='explorer',
            password='Password123!',
            full_name='Roadmap Explorer'
        )

        self.roadmap = Roadmap.objects.create(
            slug='test-curriculum',
            title='Test Curriculum',
            description='Test Roadmap Description',
            icon='Map',
            is_published=True
        )

        self.node1 = RoadmapNode.objects.create(
            roadmap=self.roadmap,
            slug='foundations-arrays',
            title='Arrays',
            tier=1,
            category='Foundations',
            display_order=1
        )

        self.node2 = RoadmapNode.objects.create(
            roadmap=self.roadmap,
            slug='two-pointers',
            title='Two Pointers',
            tier=2,
            category='Techniques',
            display_order=2
        )
        self.node2.prerequisites.add(self.node1)

    def test_roadmap_list(self):
        url = reverse('roadmap_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['slug'], 'test-curriculum')
        self.assertEqual(res.data[0]['node_count'], 2)

    def test_roadmap_detail_unauthenticated(self):
        url = reverse('roadmap_detail', kwargs={'slug': 'test-curriculum'})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['slug'], 'test-curriculum')
        self.assertEqual(len(res.data['nodes']), 2)

        # Tier 1 should be in_progress by default, Tier 2 locked
        n1 = next(n for n in res.data['nodes'] if n['slug'] == 'foundations-arrays')
        n2 = next(n for n in res.data['nodes'] if n['slug'] == 'two-pointers')
        self.assertEqual(n1['status'], 'in_progress')
        self.assertEqual(n2['status'], 'locked')
        self.assertIn('foundations-arrays', n2['prerequisite_slugs'])

    def test_update_node_progress(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('roadmap_node_progress', kwargs={'node_slug': 'foundations-arrays'})
        res = self.client.post(url, {
            'status': 'completed',
            'progress_percentage': 100
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'completed')
        self.assertEqual(res.data['progress_percentage'], 100)

        # Verify now that node1 is completed, node2 unlocks to in_progress!
        detail_url = reverse('roadmap_detail', kwargs={'slug': 'test-curriculum'})
        detail_res = self.client.get(detail_url)
        n2 = next(n for n in detail_res.data['nodes'] if n['slug'] == 'two-pointers')
        self.assertEqual(n2['status'], 'in_progress')
