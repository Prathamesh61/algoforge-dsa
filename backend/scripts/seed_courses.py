import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django_app = None
import django
django.setup()

from apps.courses.models import Course, CourseModule, Lesson

def seed_courses():
    print("Seeding courses and lessons...")

    # 1. DSA Fundamentals Course
    course1, _ = Course.objects.get_or_create(
        slug='dsa-fundamentals',
        defaults={
            'title': 'DSA Fundamentals',
            'summary': 'Master the foundations of computer science: time and space complexity, Big-O notation, and elementary data structures.',
            'thumbnail_url': 'https://images.unsplash.com/photo-1516116211227-bbc3b3b4f620?auto=format&fit=crop&w=600&q=80',
            'difficulty': 'Beginner',
            'display_order': 1,
            'is_published': True
        }
    )

    mod1, _ = CourseModule.objects.get_or_create(
        course=course1,
        title='1. Complexity Analysis & Big-O',
        defaults={'display_order': 1}
    )

    Lesson.objects.get_or_create(
        slug='intro-to-dsa',
        defaults={
            'module': mod1,
            'title': 'Introduction to Data Structures & Algorithms',
            'estimated_read_time': 6,
            'xp_reward': 10,
            'display_order': 1,
            'is_published': True,
            'content_blocks': [
                {
                    'type': 'text',
                    'content': '## Why Learn Data Structures and Algorithms?\n\nAt its core, computer science is about **storing data efficiently** (Data Structures) and **processing that data effectively** (Algorithms). Whether you are developing high-frequency trading platforms, web applications, or operating systems, choosing the right DSA can mean the difference between an operation taking 10 milliseconds versus 10 hours.'
                },
                {
                    'type': 'callout',
                    'variant': 'tip',
                    'title': 'Guiding Principle',
                    'text': 'Every data structure optimizes for certain operations at the cost of others. Always analyze your access, insertion, and deletion patterns before picking an abstraction.'
                },
                {
                    'type': 'quiz',
                    'question': 'Which of the following best describes an Algorithm?',
                    'options': [
                        'A specific programming language compiler',
                        'A finite, unambiguous sequence of steps to solve a problem',
                        'A physical computer memory chip',
                        'A continuous electrical voltage'
                    ],
                    'correctIndex': 1,
                    'explanation': 'An algorithm is a well-defined computational procedure that takes some value as input and produces some value as output through finite, unambiguous steps.'
                }
            ]
        }
    )

    Lesson.objects.get_or_create(
        slug='big-o-notation',
        defaults={
            'module': mod1,
            'title': 'Big-O Notation & Asymptotic Analysis',
            'estimated_read_time': 8,
            'xp_reward': 15,
            'display_order': 2,
            'is_published': True,
            'content_blocks': [
                {
                    'type': 'text',
                    'content': '## What is Big-O?\n\nBig-O notation describes the **upper bound** on the growth rate of an algorithm’s running time or memory usage as the input size $n$ grows toward infinity. It abstracts away hardware differences, operating system overhead, and compiler optimizations.'
                },
                {
                    'type': 'complexity',
                    'time': 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
                    'space': 'O(1) Auxiliary is ideal',
                    'explanation': 'Algorithms that scale logarithmically or linearly are suited for large datasets.'
                },
                {
                    'type': 'code',
                    'language': 'python',
                    'title': 'Constant O(1) vs Linear O(n)',
                    'code': '# O(1) Time: Instant lookup regardless of array length\ndef get_first(arr):\n    return arr[0] if arr else None\n\n# O(n) Time: Steps scale linearly with input size n\ndef print_all(arr):\n    for item in arr:\n        print(item)'
                },
                {
                    'type': 'video',
                    'youtubeId': 'v4cd1O4zkGw',
                    'title': 'Big O Notation - Full Course',
                    'duration': '18:42'
                }
            ]
        }
    )

    # 2. Searching Algorithms Course
    course2, _ = Course.objects.get_or_create(
        slug='searching-algorithms',
        defaults={
            'title': 'Searching & Binary Exploration',
            'summary': 'From linear scans to logarithmic divide-and-conquer binary search paradigms.',
            'thumbnail_url': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
            'difficulty': 'Beginner',
            'display_order': 2,
            'is_published': True
        }
    )

    mod_search, _ = CourseModule.objects.get_or_create(
        course=course2,
        title='1. Classic Searching Paradigms',
        defaults={'display_order': 1}
    )

    # Binary Search Lesson - Rich Data Driven
    Lesson.objects.get_or_create(
        slug='binary-search',
        defaults={
            'module': mod_search,
            'title': 'Binary Search Algorithm',
            'estimated_read_time': 10,
            'xp_reward': 20,
            'display_order': 1,
            'is_published': True,
            'content_blocks': [
                {
                    'type': 'text',
                    'content': '## What is Binary Search?\n\nBinary Search is a highly efficient algorithm for finding an element in a **sorted** array. It works on the principle of **Divide and Conquer**, repeatedly halving the search space by comparing the target with the middle element.'
                },
                {
                    'type': 'animation',
                    'component': 'binary-search',
                    'config': {
                        'array': [1, 3, 5, 7, 9, 11, 15],
                        'target': 11
                    }
                },
                {
                    'type': 'text',
                    'content': '### How It Works Step-by-Step:\n\n1. Maintain two pointers: `low = 0` and `high = len(arr) - 1`.\n2. Calculate the middle index: `mid = low + (high - low) // 2` (prevents integer overflow).\n3. If `arr[mid] == target`, we found our element!\n4. If `arr[mid] < target`, the target must reside in the right half, so we set `low = mid + 1`.\n5. If `arr[mid] > target`, the target must reside in the left half, so we set `high = mid - 1`.\n6. If `low > high`, the target does not exist in the array.'
                },
                {
                    'type': 'code',
                    'language': 'python',
                    'title': 'Binary Search Implementation (Python)',
                    'code': 'def binary_search(nums: list[int], target: int) -> int:\n    low, high = 0, len(nums) - 1\n    \n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n            \n    return -1'
                },
                {
                    'type': 'complexity',
                    'time': 'O(log n)',
                    'space': 'O(1) Iterative, O(log n) Recursive',
                    'explanation': 'Because the search range is halved on each iteration, an array of 1,000,000 items requires at most ~20 comparisons!'
                },
                {
                    'type': 'video',
                    'youtubeId': 'fDKIpRe8GW4',
                    'title': 'Binary Search Algorithm in 100 Seconds',
                    'duration': '2:30'
                },
                {
                    'type': 'quiz',
                    'question': 'What prerequisite MUST be satisfied before Binary Search can be applied to an array?',
                    'options': [
                        'The array must only contain positive numbers',
                        'The array must be sorted in monotonic order',
                        'The array must have an even length',
                        'The elements must be unique'
                    ],
                    'correctIndex': 1,
                    'explanation': 'Binary Search relies on comparing with the middle element to eliminate half of the elements. This guarantee only holds if the array is sorted.'
                },
                {
                    'type': 'callout',
                    'variant': 'warning',
                    'title': 'Common Mistake: Integer Overflow',
                    'text': 'In languages like Java, C++, and C, calculating mid as `(low + high) / 2` can overflow if `low + high` exceeds 2³¹ - 1. Always use `low + (high - low) / 2`.'
                }
            ]
        }
    )

    # 3. Sorting Course
    Course.objects.get_or_create(
        slug='sorting-algorithms',
        defaults={
            'title': 'Sorting Algorithms Lab',
            'summary': 'Explore Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort with visual side-by-side execution.',
            'thumbnail_url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
            'difficulty': 'Intermediate',
            'display_order': 3,
            'is_published': True
        }
    )

    # 4. Trees & Graphs Course
    Course.objects.get_or_create(
        slug='trees-and-graphs',
        defaults={
            'title': 'Trees, BST & Graph Traversal',
            'summary': 'Master Binary Trees, BST properties, Breadth-First Search, and Depth-First Search with force-directed graphs.',
            'thumbnail_url': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
            'difficulty': 'Intermediate',
            'display_order': 4,
            'is_published': True
        }
    )

    # 5. Dynamic Programming Course
    Course.objects.get_or_create(
        slug='dynamic-programming',
        defaults={
            'title': 'Dynamic Programming Mastery',
            'summary': 'Deconstruct recursion trees, identify optimal substructure, and construct memoization and 2D tabulation grids.',
            'thumbnail_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
            'difficulty': 'Advanced',
            'display_order': 5,
            'is_published': True
        }
    )

    print("Courses and lessons successfully seeded!")

run = seed_courses

if __name__ == '__main__':
    seed_courses()

