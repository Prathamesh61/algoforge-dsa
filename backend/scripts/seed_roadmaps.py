import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.roadmaps.models import Roadmap, RoadmapNode

def run():
    print("Seeding Master DSA Learning Roadmap...")

    roadmap, created = Roadmap.objects.get_or_create(
        slug="dsa-mastery",
        defaults={
            "title": "DSA Mastery Curriculum",
            "description": "A structured, progressive path taking you from algorithmic foundations to advanced dynamic programming and graph theory.",
            "icon": "Map",
            "is_published": True
        }
    )
    print(f"{'[Created]' if created else '[Exists]'} Roadmap: {roadmap.title}")

    nodes_data = [
        # Tier 1: Foundations
        {
            "slug": "time-space-complexity",
            "title": "Time & Space Complexity (Big-O)",
            "tier": 1,
            "category": "Foundations",
            "description": "Analyze asymptotic behavior, Big-O, Big-Omega, Big-Theta notation, and memory footprints.",
            "icon": "Clock",
            "estimated_hours": 3,
            "display_order": 1,
            "prereqs": [],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "intro-to-big-o",
            "linked_tag_slug": ""
        },
        {
            "slug": "arrays-memory",
            "title": "Arrays & Memory Layout",
            "tier": 1,
            "category": "Foundations",
            "description": "Contiguous memory allocation, random access indexing, dynamic resizing vectors.",
            "icon": "Layers",
            "estimated_hours": 4,
            "display_order": 2,
            "prereqs": [],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "arrays-memory-model",
            "linked_tag_slug": "array"
        },

        # Tier 2: Core Sequences
        {
            "slug": "two-pointers",
            "title": "Two-Pointer Technique",
            "tier": 2,
            "category": "Core Techniques",
            "description": "Opposite-end and fast/slow pointer paradigms for linear and sorted array problems.",
            "icon": "SlidersHorizontal",
            "estimated_hours": 5,
            "display_order": 1,
            "prereqs": ["arrays-memory"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "two-pointer-technique",
            "linked_tag_slug": "two-pointers"
        },
        {
            "slug": "hash-maps",
            "title": "Hash Tables & Fast Lookup",
            "tier": 2,
            "category": "Core Techniques",
            "description": "Hashing functions, collision resolution strategies, and O(1) average lookup patterns.",
            "icon": "Zap",
            "estimated_hours": 4,
            "display_order": 2,
            "prereqs": ["arrays-memory"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "",
            "linked_tag_slug": "hash-map"
        },

        # Tier 3: Search & Sort
        {
            "slug": "binary-search",
            "title": "Binary Search & Lower Bound",
            "tier": 3,
            "category": "Search & Sort",
            "description": "Logarithmic search boundaries, predicate monotonic functions, and rotated array search.",
            "icon": "Search",
            "estimated_hours": 6,
            "display_order": 1,
            "prereqs": ["arrays-memory", "two-pointers"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "binary-search-masterclass",
            "linked_tag_slug": "binary-search"
        },
        {
            "slug": "sorting-algorithms",
            "title": "Divide & Conquer Sorting",
            "tier": 3,
            "category": "Search & Sort",
            "description": "Merge Sort, Quick Sort, stability properties, and comparative sorting limits.",
            "icon": "ArrowDownUp",
            "estimated_hours": 6,
            "display_order": 2,
            "prereqs": ["time-space-complexity", "arrays-memory"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "",
            "linked_tag_slug": "sorting"
        },

        # Tier 4: Linear Structures
        {
            "slug": "linked-lists",
            "title": "Linked Lists & Pointer Manipulation",
            "tier": 4,
            "category": "Linear Structures",
            "description": "Singly and doubly linked lists, reversal in-place, and cycle detection.",
            "icon": "Link",
            "estimated_hours": 5,
            "display_order": 1,
            "prereqs": ["arrays-memory"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },
        {
            "slug": "stacks-queues",
            "title": "Stacks & Queues (Monotonic Stack)",
            "tier": 4,
            "category": "Linear Structures",
            "description": "LIFO/FIFO invariants, circular queues, and next greater element monotonic stacks.",
            "icon": "Layers",
            "estimated_hours": 5,
            "display_order": 2,
            "prereqs": ["arrays-memory"],
            "linked_course_slug": "dsa-foundations",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },

        # Tier 5: Trees
        {
            "slug": "binary-trees",
            "title": "Binary Trees & BST Operations",
            "tier": 5,
            "category": "Trees",
            "description": "Recursive tree traversals (Inorder, Preorder, Postorder), BST search and balance.",
            "icon": "GitFork",
            "estimated_hours": 7,
            "display_order": 1,
            "prereqs": ["linked-lists", "stacks-queues"],
            "linked_course_slug": "trees-and-graphs",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },
        {
            "slug": "heaps",
            "title": "Binary Heaps & Priority Queues",
            "tier": 5,
            "category": "Trees",
            "description": "Min-heap and max-heap array representation, heapify, and Top-K elements.",
            "icon": "Award",
            "estimated_hours": 5,
            "display_order": 2,
            "prereqs": ["binary-trees", "arrays-memory"],
            "linked_course_slug": "trees-and-graphs",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },

        # Tier 6: Graphs
        {
            "slug": "graphs-traversal",
            "title": "Graph Traversal (BFS & DFS)",
            "tier": 6,
            "category": "Graphs",
            "description": "Adjacency lists/matrices, connected components, cycle detection, topological sort.",
            "icon": "Network",
            "estimated_hours": 8,
            "display_order": 1,
            "prereqs": ["binary-trees", "stacks-queues"],
            "linked_course_slug": "trees-and-graphs",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },
        {
            "slug": "shortest-paths",
            "title": "Shortest Paths (Dijkstra)",
            "tier": 6,
            "category": "Graphs",
            "description": "Greedy shortest path on weighted graphs with priority queue optimization.",
            "icon": "Compass",
            "estimated_hours": 7,
            "display_order": 2,
            "prereqs": ["graphs-traversal", "heaps"],
            "linked_course_slug": "trees-and-graphs",
            "linked_lesson_slug": "",
            "linked_tag_slug": ""
        },

        # Tier 7: Dynamic Programming
        {
            "slug": "dp-1d",
            "title": "1D Dynamic Programming",
            "tier": 7,
            "category": "Optimization",
            "description": "Overlapping subproblems, memoization vs tabulation, optimal substructure.",
            "icon": "Sparkles",
            "estimated_hours": 8,
            "display_order": 1,
            "prereqs": ["binary-search", "two-pointers"],
            "linked_course_slug": "dynamic-programming",
            "linked_lesson_slug": "",
            "linked_tag_slug": "dynamic-programming"
        },
        {
            "slug": "dp-2d",
            "title": "2D Grid & Knapsack DP",
            "tier": 7,
            "category": "Optimization",
            "description": "0/1 Knapsack, Longest Common Subsequence, matrix state transitions.",
            "icon": "Grid",
            "estimated_hours": 10,
            "display_order": 2,
            "prereqs": ["dp-1d"],
            "linked_course_slug": "dynamic-programming",
            "linked_lesson_slug": "",
            "linked_tag_slug": "dynamic-programming"
        },
    ]

    node_objs = {}
    for nd in nodes_data:
        node, created = RoadmapNode.objects.get_or_create(
            roadmap=roadmap,
            slug=nd["slug"],
            defaults={
                "title": nd["title"],
                "tier": nd["tier"],
                "category": nd["category"],
                "description": nd["description"],
                "icon": nd["icon"],
                "estimated_hours": nd["estimated_hours"],
                "display_order": nd["display_order"],
                "linked_course_slug": nd["linked_course_slug"],
                "linked_lesson_slug": nd["linked_lesson_slug"],
                "linked_tag_slug": nd["linked_tag_slug"],
            }
        )
        node_objs[nd["slug"]] = node

    # Wire up prerequisites
    for nd in nodes_data:
        curr_node = node_objs[nd["slug"]]
        for p_slug in nd["prereqs"]:
            if p_slug in node_objs:
                curr_node.prerequisites.add(node_objs[p_slug])
        print(f"  Configured Node: [Tier {curr_node.tier}] {curr_node.title}")

    print("Master DSA Roadmap seeded successfully!")

if __name__ == '__main__':
    run()
