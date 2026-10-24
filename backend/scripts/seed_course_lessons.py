"""
Seed rich lesson content for Courses 3, 4, and 5:
  3 - Sorting Algorithms Lab
  4 - Trees, BST & Graph Traversal
  5 - Dynamic Programming Mastery
"""
import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.courses.models import Course, CourseModule, Lesson


def run():
    print("Seeding missing course lessons (Sorting, Trees, DP)...")

    # =====================================================================
    # Course 3 — Sorting Algorithms
    # =====================================================================
    course3 = Course.objects.filter(slug='sorting-algorithms').first()
    if not course3:
        print("  [SKIP] sorting-algorithms course not found — run seed_courses first.")
    else:
        mod_sort, _ = CourseModule.objects.get_or_create(
            course=course3,
            title='1. Elementary Sorting',
            defaults={'display_order': 1}
        )

        Lesson.objects.get_or_create(
            slug='bubble-sort',
            defaults={
                'module': mod_sort,
                'title': 'Bubble Sort',
                'estimated_read_time': 7,
                'xp_reward': 15,
                'display_order': 1,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Bubble Sort\n\nBubble Sort is the simplest comparison-based sorting algorithm. On each pass through the array, adjacent elements are compared and swapped if they are in the wrong order. Larger elements "bubble up" to the end of the array.\n\nThough easy to understand, Bubble Sort is one of the least efficient sorting algorithms for large datasets.'
                    },
                    {
                        'type': 'animation',
                        'component': 'bubble-sort',
                        'config': {'array': [64, 34, 25, 12, 22, 11, 90]}
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'Bubble Sort Implementation',
                        'code': 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        # Last i elements are already sorted\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        # If no two elements were swapped in inner loop, array is sorted\n        if not swapped:\n            break\n    return arr'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(n²) worst/average, O(n) best (already sorted)',
                        'space': 'O(1)',
                        'explanation': 'Bubble sort requires at most n×(n-1)/2 comparisons in the worst case. The early-exit optimization on no-swap detects an already-sorted array in linear time.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'What is the best-case time complexity of Bubble Sort with the early-exit optimization?',
                        'options': ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
                        'correctIndex': 2,
                        'explanation': 'With the `swapped` flag optimization, if a pass produces zero swaps the array is already sorted and we terminate in O(n) time.'
                    }
                ]
            }
        )

        Lesson.objects.get_or_create(
            slug='merge-sort',
            defaults={
                'module': mod_sort,
                'title': 'Merge Sort (Divide & Conquer)',
                'estimated_read_time': 10,
                'xp_reward': 20,
                'display_order': 2,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Merge Sort\n\nMerge Sort is a classic Divide and Conquer algorithm that recursively splits the array in half, sorts each half, and then merges the two sorted halves. It guarantees **O(n log n)** performance regardless of input order, making it far more predictable than Quick Sort in adversarial cases.'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'Merge Sort Implementation',
                        'code': 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(n log n) — always',
                        'space': 'O(n) auxiliary',
                        'explanation': 'The log n recursion depth multiplied by O(n) work per level equals O(n log n). The tradeoff is O(n) extra memory for the merge step.'
                    },
                    {
                        'type': 'callout',
                        'variant': 'tip',
                        'title': 'When to Use Merge Sort',
                        'text': 'Prefer Merge Sort when stability (preserving the relative order of equal elements) is required, or when sorting linked lists where random access is expensive.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'What is the space complexity of the standard recursive Merge Sort?',
                        'options': ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                        'correctIndex': 2,
                        'explanation': 'The merge step creates temporary arrays that at each level consume O(n) total space.'
                    }
                ]
            }
        )

        Lesson.objects.get_or_create(
            slug='quick-sort',
            defaults={
                'module': mod_sort,
                'title': 'Quick Sort & Partition Schemes',
                'estimated_read_time': 12,
                'xp_reward': 25,
                'display_order': 3,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Quick Sort\n\nQuick Sort is often the fastest sorting algorithm in practice due to excellent cache performance. It selects a **pivot** element and partitions the array so that:\n- All elements **≤ pivot** are to its left\n- All elements **> pivot** are to its right\n\nThen it recursively sorts both partitions.'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'Quick Sort (Lomuto Partition)',
                        'code': 'def quick_sort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low < high:\n        pivot_idx = partition(arr, low, high)\n        quick_sort(arr, low, pivot_idx - 1)\n        quick_sort(arr, pivot_idx + 1, high)\n    return arr\n\ndef partition(arr, low, high):\n    pivot = arr[high]  # Choose last element as pivot\n    i = low - 1       # Index of smaller element\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(n log n) average, O(n²) worst case',
                        'space': 'O(log n) recursion stack',
                        'explanation': 'With random or median-of-three pivot selection, O(n²) worst case is extremely rare. Use randomized pivot selection in production.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'In Quick Sort, when does the worst-case O(n²) occur?',
                        'options': [
                            'When the array is already sorted and we always pick the first or last element as pivot',
                            'When all elements are unique',
                            'When the array length is odd',
                            'When we use the Lomuto partition scheme'
                        ],
                        'correctIndex': 0,
                        'explanation': 'Choosing the smallest or largest element as pivot every time results in maximally unbalanced partitions — O(n) depth × O(n) work per level = O(n²).'
                    }
                ]
            }
        )

    # =====================================================================
    # Course 4 — Trees, BST & Graph Traversal
    # =====================================================================
    course4 = Course.objects.filter(slug='trees-and-graphs').first()
    if not course4:
        print("  [SKIP] trees-and-graphs course not found — run seed_courses first.")
    else:
        mod_trees, _ = CourseModule.objects.get_or_create(
            course=course4,
            title='1. Binary Trees & Tree Traversal',
            defaults={'display_order': 1}
        )

        Lesson.objects.get_or_create(
            slug='binary-tree-traversals',
            defaults={
                'module': mod_trees,
                'title': 'Binary Tree Traversals (Pre, In, Post, Level-Order)',
                'estimated_read_time': 12,
                'xp_reward': 20,
                'display_order': 1,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Binary Tree Traversals\n\nA Binary Tree is a hierarchical data structure where each node has at most two children: a **left** child and a **right** child. Traversing all nodes in a specific order is a fundamental operation.\n\nThe four primary traversal orders are:\n1. **Pre-order** (Root → Left → Right) — used for copying a tree or prefix expressions\n2. **In-order** (Left → Root → Right) — produces sorted output in a BST\n3. **Post-order** (Left → Right → Root) — used for deletion or postfix expressions\n4. **Level-order / BFS** — visits nodes level-by-level using a queue'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'All Four Traversals',
                        'code': 'from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef preorder(root):\n    if not root: return []\n    return [root.val] + preorder(root.left) + preorder(root.right)\n\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)\n\ndef postorder(root):\n    if not root: return []\n    return postorder(root.left) + postorder(root.right) + [root.val]\n\ndef level_order(root):\n    if not root: return []\n    result, queue = [], deque([root])\n    while queue:\n        node = queue.popleft()\n        result.append(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)\n    return result'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(n) for all traversals',
                        'space': 'O(h) for DFS (h = tree height), O(w) for BFS (w = max width)',
                        'explanation': 'Every traversal visits each of the n nodes exactly once. Stack/queue space depends on the tree shape.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'Which traversal of a Binary Search Tree produces elements in sorted (ascending) order?',
                        'options': ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
                        'correctIndex': 1,
                        'explanation': 'In-order (Left → Root → Right) visits BST nodes in ascending key order by construction.'
                    }
                ]
            }
        )

        mod_graphs, _ = CourseModule.objects.get_or_create(
            course=course4,
            title='2. Graph Algorithms',
            defaults={'display_order': 2}
        )

        Lesson.objects.get_or_create(
            slug='bfs-dfs',
            defaults={
                'module': mod_graphs,
                'title': 'BFS & DFS: Graph Search Strategies',
                'estimated_read_time': 14,
                'xp_reward': 25,
                'display_order': 1,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Breadth-First Search (BFS) and Depth-First Search (DFS)\n\nGraphs model relationships between entities. The two fundamental graph search algorithms are:\n\n**BFS** — Explores all neighbors at the current depth before moving to the next level. Uses a **queue**. Best for:\n- Shortest path in unweighted graphs\n- Level-order processing\n\n**DFS** — Explores as far as possible along each branch before backtracking. Uses a **stack** (or recursion). Best for:\n- Cycle detection\n- Topological sorting\n- Connected component detection'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'BFS and DFS on Adjacency List',
                        'code': 'from collections import deque, defaultdict\n\nclass Graph:\n    def __init__(self):\n        self.adj = defaultdict(list)\n    \n    def add_edge(self, u, v):\n        self.adj[u].append(v)\n        self.adj[v].append(u)\n    \n    def bfs(self, start):\n        visited = set([start])\n        queue = deque([start])\n        result = []\n        while queue:\n            node = queue.popleft()\n            result.append(node)\n            for neighbor in self.adj[node]:\n                if neighbor not in visited:\n                    visited.add(neighbor)\n                    queue.append(neighbor)\n        return result\n    \n    def dfs(self, start, visited=None):\n        if visited is None:\n            visited = set()\n        visited.add(start)\n        result = [start]\n        for neighbor in self.adj[start]:\n            if neighbor not in visited:\n                result.extend(self.dfs(neighbor, visited))\n        return result'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(V + E) for both BFS and DFS',
                        'space': 'O(V) for the visited set and queue/stack',
                        'explanation': 'We visit each vertex and edge exactly once. V = number of vertices, E = number of edges.'
                    },
                    {
                        'type': 'callout',
                        'variant': 'tip',
                        'title': 'BFS vs DFS Decision Guide',
                        'text': 'Use BFS when you need the shortest path in an unweighted graph. Use DFS when you need to detect cycles, perform topological sort, or explore all paths in a maze.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'Which data structure does BFS use internally?',
                        'options': ['Stack', 'Queue', 'Heap', 'Deque'],
                        'correctIndex': 1,
                        'explanation': 'BFS uses a Queue (FIFO) to process nodes level by level, ensuring nodes closer to the source are visited first.'
                    }
                ]
            }
        )

    # =====================================================================
    # Course 5 — Dynamic Programming
    # =====================================================================
    course5 = Course.objects.filter(slug='dynamic-programming').first()
    if not course5:
        print("  [SKIP] dynamic-programming course not found — run seed_courses first.")
    else:
        mod_dp1, _ = CourseModule.objects.get_or_create(
            course=course5,
            title='1. DP Foundations',
            defaults={'display_order': 1}
        )

        Lesson.objects.get_or_create(
            slug='intro-to-dp',
            defaults={
                'module': mod_dp1,
                'title': 'Introduction to Dynamic Programming',
                'estimated_read_time': 12,
                'xp_reward': 20,
                'display_order': 1,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## What is Dynamic Programming?\n\nDynamic Programming (DP) is an optimization technique for problems with:\n1. **Overlapping Subproblems** — The same sub-problems are solved multiple times\n2. **Optimal Substructure** — Optimal solution can be constructed from optimal solutions of sub-problems\n\nDP solves each sub-problem only once and **stores its result** (memoization or tabulation), avoiding redundant computation.\n\n### Two Approaches:\n- **Top-Down (Memoization)** — Recursive with a cache\n- **Bottom-Up (Tabulation)** — Iterative, building from base cases'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'Fibonacci: Naive vs Memoized vs Tabulated',
                        'code': '# Naive Recursion — O(2^n) time\ndef fib_naive(n):\n    if n <= 1: return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\n# Top-Down Memoization — O(n) time, O(n) space\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib_memo(n):\n    if n <= 1: return n\n    return fib_memo(n-1) + fib_memo(n-2)\n\n# Bottom-Up Tabulation — O(n) time, O(1) space\ndef fib_dp(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b'
                    },
                    {
                        'type': 'quiz',
                        'question': 'Which property MUST a problem have to be solvable with Dynamic Programming?',
                        'options': [
                            'The problem must involve sorting',
                            'Overlapping subproblems and optimal substructure',
                            'The input must be a graph',
                            'The problem must have a greedy solution'
                        ],
                        'correctIndex': 1,
                        'explanation': 'DP is applicable when subproblems overlap (same sub-problems recomputed) AND the optimal solution can be derived from optimal sub-solutions.'
                    }
                ]
            }
        )

        Lesson.objects.get_or_create(
            slug='knapsack-problem',
            defaults={
                'module': mod_dp1,
                'title': '0/1 Knapsack Problem',
                'estimated_read_time': 15,
                'xp_reward': 30,
                'display_order': 2,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## The 0/1 Knapsack Problem\n\nGiven `n` items with weights `w[i]` and values `v[i]`, and a knapsack of capacity `W`, maximize the total value of items selected such that the total weight ≤ W. Each item can only be taken **once** (hence "0/1" — you take it or you don\'t).\n\nThis is the canonical DP problem that demonstrates **2D state transition**: `dp[i][w]` = maximum value using the first `i` items with knapsack capacity `w`.'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': '0/1 Knapsack — Bottom-Up DP',
                        'code': 'def knapsack(weights, values, capacity):\n    n = len(weights)\n    # dp[i][w] = max value using first i items with capacity w\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    \n    for i in range(1, n + 1):\n        w, v = weights[i-1], values[i-1]\n        for cap in range(capacity + 1):\n            # Option 1: Don\'t take item i\n            dp[i][cap] = dp[i-1][cap]\n            # Option 2: Take item i (if it fits)\n            if w <= cap:\n                dp[i][cap] = max(dp[i][cap], dp[i-1][cap-w] + v)\n    \n    return dp[n][capacity]\n\n# Example\nweights = [1, 2, 3, 5]\nvalues  = [1, 6, 10, 16]\nprint(knapsack(weights, values, 7))  # Output: 22'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(n × W) — pseudo-polynomial',
                        'space': 'O(n × W), reducible to O(W) with space optimization',
                        'explanation': 'The 0/1 Knapsack is NP-hard in general, but solvable in pseudo-polynomial time using DP when weights are integers.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'In the 0/1 Knapsack DP recurrence dp[i][w], what does it represent?',
                        'options': [
                            'The weight of item i',
                            'Maximum value achievable using first i items with capacity w',
                            'The index of the optimal item to pick',
                            'Total number of items remaining'
                        ],
                        'correctIndex': 1,
                        'explanation': 'dp[i][w] stores the maximum value we can achieve considering only the first i items and a knapsack with remaining capacity w.'
                    }
                ]
            }
        )

        mod_dp2, _ = CourseModule.objects.get_or_create(
            course=course5,
            title='2. Classic DP Patterns',
            defaults={'display_order': 2}
        )

        Lesson.objects.get_or_create(
            slug='longest-common-subsequence',
            defaults={
                'module': mod_dp2,
                'title': 'Longest Common Subsequence (LCS)',
                'estimated_read_time': 12,
                'xp_reward': 25,
                'display_order': 1,
                'is_published': True,
                'content_blocks': [
                    {
                        'type': 'text',
                        'content': '## Longest Common Subsequence\n\nGiven two strings `s1` and `s2`, find the length of the longest subsequence common to both strings. A **subsequence** is a sequence that can be derived from the original by deleting some (or no) characters without changing the relative order.\n\n**Example**: LCS of "ABCBDAB" and "BDCAB" is "BCAB" or "BDAB" with length 4.\n\nThis is used in:\n- Git diff algorithms\n- DNA sequence alignment\n- Plagiarism detection'
                    },
                    {
                        'type': 'code',
                        'language': 'python',
                        'title': 'LCS — Bottom-Up Tabulation',
                        'code': 'def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    \n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1  # Characters match\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Take the better skip\n    \n    return dp[m][n]\n\nprint(lcs("ABCBDAB", "BDCAB"))  # Output: 4'
                    },
                    {
                        'type': 'complexity',
                        'time': 'O(m × n)',
                        'space': 'O(m × n), reducible to O(min(m, n)) with rolling array',
                        'explanation': 'We fill an m×n DP table where each cell takes O(1) to compute.'
                    },
                    {
                        'type': 'quiz',
                        'question': 'What is the recurrence relation when s1[i] == s2[j] in LCS?',
                        'options': [
                            'dp[i][j] = dp[i-1][j-1]',
                            'dp[i][j] = dp[i-1][j-1] + 1',
                            'dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
                            'dp[i][j] = dp[i-1][j] + dp[i][j-1]'
                        ],
                        'correctIndex': 1,
                        'explanation': 'When characters match, the LCS length extends by 1 from the state without either of the matched characters: dp[i-1][j-1] + 1.'
                    }
                ]
            }
        )

    print("Done! Courses 3, 4, and 5 lessons seeded.")


if __name__ == '__main__':
    run()
