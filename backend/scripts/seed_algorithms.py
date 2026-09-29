import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.algorithms.models import Algorithm

def seed_algorithms():
    print("Seeding algorithms...")

    # 1. Binary Search
    Algorithm.objects.update_or_create(
        slug='binary-search',
        defaults={
            'name': 'Binary Search',
            'category': 'Searching',
            'description': 'Binary Search is an efficient logarithmic search algorithm that operates on a sorted array by repeatedly dividing the search interval in half.',
            'time_complexity_best': 'O(1)',
            'time_complexity_avg': 'O(log n)',
            'time_complexity_worst': 'O(log n)',
            'space_complexity': 'O(1)',
            'default_dataset': [1, 3, 5, 7, 9, 11, 15, 18, 21, 25],
            'implementation_code': {
                'python': '''def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1''',
                'javascript': '''function binarySearch(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = Math.floor(low + (high - low) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}''',
                'cpp': '''int binarySearch(const vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}'''
            },
            'pseudocode': '''procedure BinarySearch(A : sorted array, target : value)
    low := 0
    high := length(A) - 1
    while low <= high do
        mid := low + floor((high - low) / 2)
        if A[mid] = target then
            return mid
        else if A[mid] < target then
            low := mid + 1
        else
            high := mid - 1
    return -1''',
            'advantages': [
                'Logarithmic time complexity O(log n) guarantees rapid lookups in massive datasets',
                'Minimal auxiliary space requirement O(1) iterative',
                'Standard benchmark for divide-and-conquer paradigms'
            ],
            'limitations': [
                'Requires the underlying collection to be strictly sorted',
                'Requires random access (O(1) indexing) — poor fit for singly-linked lists'
            ],
            'when_to_use': 'When searching through a static or infrequently modified sorted array, or searching within a monotonic search space (e.g. binary search on answer).',
            'when_not_to_use': 'When the dataset changes frequently with frequent insertions/deletions where re-sorting costs outweigh search savings, or when collection is unsorted and only searched once.',
            'common_mistakes': [
                'Integer overflow using (low + high) / 2 instead of low + (high - low) / 2',
                'Off-by-one errors in while condition (using < instead of <=)',
                'Incorrect pointer updates (e.g. setting low = mid instead of low = mid + 1)'
            ],
            'display_order': 1
        }
    )

    # 2. Linear Search
    Algorithm.objects.update_or_create(
        slug='linear-search',
        defaults={
            'name': 'Linear Search',
            'category': 'Searching',
            'description': 'Linear Search sequentially checks each element of the list until a match is found or the entire list has been searched.',
            'time_complexity_best': 'O(1)',
            'time_complexity_avg': 'O(n)',
            'time_complexity_worst': 'O(n)',
            'space_complexity': 'O(1)',
            'default_dataset': [12, 5, 8, 19, 3, 24, 7],
            'implementation_code': {
                'python': '''def linear_search(nums: list[int], target: int) -> int:
    for i, val in enumerate(nums):
        if val == target:
            return i
    return -1'''
            },
            'display_order': 2
        }
    )

    # 3. Bubble Sort
    Algorithm.objects.update_or_create(
        slug='bubble-sort',
        defaults={
            'name': 'Bubble Sort',
            'category': 'Sorting',
            'description': 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
            'time_complexity_best': 'O(n)',
            'time_complexity_avg': 'O(n²)',
            'time_complexity_worst': 'O(n²)',
            'space_complexity': 'O(1)',
            'default_dataset': [45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 45],
            'implementation_code': {
                'python': '''def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr'''
            },
            'display_order': 3
        }
    )

    print("Algorithms seeded successfully!")

if __name__ == '__main__':
    seed_algorithms()
