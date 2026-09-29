import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from apps.problems.models import Problem, ProblemTag, ProblemTestCase

def run():
    print("Seeding DSA Problems & Test Cases...")

    tags_data = [
        {"name": "Array", "slug": "array"},
        {"name": "String", "slug": "string"},
        {"name": "Binary Search", "slug": "binary-search"},
        {"name": "Two Pointers", "slug": "two-pointers"},
        {"name": "Dynamic Programming", "slug": "dynamic-programming"},
        {"name": "Hash Map", "slug": "hash-map"},
        {"name": "Sorting", "slug": "sorting"},
    ]

    tag_objs = {}
    for td in tags_data:
        t, _ = ProblemTag.objects.get_or_create(slug=td["slug"], defaults={"name": td["name"]})
        tag_objs[td["slug"]] = t

    problems_data = [
        {
            "slug": "two-sum",
            "title": "Two Sum",
            "difficulty": "Easy",
            "xp_reward": 20,
            "tags": ["array", "hash-map"],
            "description_markdown": """Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.""",
            "input_format": "Line 1: Space-separated integers representing the array nums\nLine 2: Single integer representing target",
            "output_format": "Space-separated indices i j",
            "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
            "examples": [
                {
                    "input": "2 7 11 15\n9",
                    "output": "0 1",
                    "explanation": "Because nums[0] + nums[1] == 9, we return 0 1."
                },
                {
                    "input": "3 2 4\n6",
                    "output": "1 2",
                    "explanation": "Because nums[1] + nums[2] == 6, we return 1 2."
                }
            ],
            "time_limit_ms": 2000,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) >= 2:\n        nums = list(map(int, lines[0].split()))\n        target = int(lines[1])\n        result = two_sum(nums, target)\n        print(' '.join(map(str, result)))\n",
                "javascript": "const fs = require('fs');\n\nfunction twoSum(nums, target) {\n    // Write your solution here\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (seen.has(complement)) {\n            return [seen.get(complement), i];\n        }\n        seen.set(nums[i], i);\n    }\n    return [];\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n    const nums = input[0].trim().split(/\\s+/).map(Number);\n    const target = Number(input[1]);\n    const res = twoSum(nums, target);\n    console.log(res.join(' '));\n}\n",
                "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <sstream>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.find(comp) != seen.end()) {\n            return {seen[comp], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        vector<int> nums;\n        int n;\n        while (ss >> n) nums.push_back(n);\n        int target;\n        if (cin >> target) {\n            auto res = twoSum(nums, target);\n            if (res.size() >= 2) cout << res[0] << \" \" << res[1] << endl;\n        }\n    }\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "2 7 11 15\n9", "expected_output": "0 1", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "3 2 4\n6", "expected_output": "1 2", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": "3 3\n6", "expected_output": "0 1", "is_hidden": True, "weight": 1, "display_order": 3},
                {"input_data": "-1 -2 -3 -4 -5\n-8", "expected_output": "2 4", "is_hidden": True, "weight": 1, "display_order": 4},
                {"input_data": "100000 500 200 100000\n200000", "expected_output": "0 3", "is_hidden": True, "weight": 2, "display_order": 5}
            ]
        },
        {
            "slug": "binary-search",
            "title": "Binary Search",
            "difficulty": "Easy",
            "xp_reward": 20,
            "tags": ["array", "binary-search"],
            "description_markdown": """Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.

If `target` exists, then return its index. Otherwise, return `-1`.

You must write an algorithm with `O(log n)` runtime complexity.""",
            "input_format": "Line 1: Space-separated integers representing the sorted array nums\nLine 2: Target integer",
            "output_format": "Single integer representing index or -1",
            "constraints": "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll integers in nums are unique.\nnums is sorted in ascending order.",
            "examples": [
                {
                    "input": "-1 0 3 5 9 12\n9",
                    "output": "4",
                    "explanation": "9 exists in nums and its index is 4."
                },
                {
                    "input": "-1 0 3 5 9 12\n2",
                    "output": "-1",
                    "explanation": "2 does not exist in nums so return -1."
                }
            ],
            "time_limit_ms": 1000,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef search(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) >= 2:\n        nums = list(map(int, lines[0].split()))\n        target = int(lines[1])\n        print(search(nums, target))\n",
                "javascript": "const fs = require('fs');\n\nfunction search(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n    const nums = input[0].trim().split(/\\s+/).map(Number);\n    const target = Number(input[1]);\n    console.log(search(nums, target));\n}\n",
                "cpp": "#include <iostream>\n#include <vector>\n#include <sstream>\n\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    int low = 0, high = nums.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        vector<int> nums;\n        int n;\n        while (ss >> n) nums.push_back(n);\n        int target;\n        if (cin >> target) {\n            cout << search(nums, target) << endl;\n        }\n    }\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "-1 0 3 5 9 12\n9", "expected_output": "4", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "-1 0 3 5 9 12\n2", "expected_output": "-1", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": "5\n5", "expected_output": "0", "is_hidden": True, "weight": 1, "display_order": 3},
                {"input_data": "1 3 5 7 9 11 13 15 17 19\n19", "expected_output": "9", "is_hidden": True, "weight": 1, "display_order": 4}
            ]
        },
        {
            "slug": "maximum-subarray",
            "title": "Maximum Subarray",
            "difficulty": "Medium",
            "xp_reward": 35,
            "tags": ["array", "dynamic-programming"],
            "description_markdown": """Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.

### Optimal Approach
This problem can be solved in `O(n)` time using **Kadane's Algorithm**.""",
            "input_format": "Single line: Space-separated integers representing nums",
            "output_format": "Single integer: Maximum sum subarray",
            "constraints": "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
            "examples": [
                {
                    "input": "-2 1 -3 4 -1 2 1 -5 4",
                    "output": "6",
                    "explanation": "The subarray [4, -1, 2, 1] has the largest sum 6."
                },
                {
                    "input": "1",
                    "output": "1",
                    "explanation": "The subarray [1] has the largest sum 1."
                },
                {
                    "input": "5 4 -1 7 8",
                    "output": "23",
                    "explanation": "The subarray [5, 4, -1, 7, 8] has the largest sum 23."
                }
            ],
            "time_limit_ms": 2000,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef max_sub_array(nums):\n    max_sum = current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_sum = max(max_sum, current_sum)\n    return max_sum\n\nif __name__ == '__main__':\n    raw = sys.stdin.read().strip()\n    if raw:\n        nums = list(map(int, raw.split()))\n        print(max_sub_array(nums))\n",
                "javascript": "const fs = require('fs');\n\nfunction maxSubArray(nums) {\n    let current = nums[0];\n    let maxVal = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        current = Math.max(nums[i], current + nums[i]);\n        maxVal = Math.max(maxVal, current);\n    }\n    return maxVal;\n}\n\nconst raw = fs.readFileSync(0, 'utf-8').trim();\nif (raw) {\n    const nums = raw.split(/\\s+/).map(Number);\n    console.log(maxSubArray(nums));\n}\n",
                "cpp": "#include <iostream>\n#include <vector>\n#include <sstream>\n#include <algorithm>\n\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    int curr = nums[0], maxVal = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        maxVal = max(maxVal, curr);\n    }\n    return maxVal;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        vector<int> nums;\n        int n;\n        while (ss >> n) nums.push_back(n);\n        if (!nums.empty()) cout << maxSubArray(nums) << endl;\n    }\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "1", "expected_output": "1", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": "5 4 -1 7 8", "expected_output": "23", "is_hidden": False, "weight": 1, "display_order": 3},
                {"input_data": "-5 -4 -1 -7 -8", "expected_output": "-1", "is_hidden": True, "weight": 1, "display_order": 4}
            ]
        },
        {
            "slug": "valid-palindrome",
            "title": "Valid Palindrome",
            "difficulty": "Easy",
            "xp_reward": 20,
            "tags": ["string", "two-pointers"],
            "description_markdown": """A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.""",
            "input_format": "Single line: String s",
            "output_format": "true or false",
            "constraints": "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
            "examples": [
                {
                    "input": "A man, a plan, a canal: Panama",
                    "output": "true",
                    "explanation": "\"amanaplanacanalpanama\" is a palindrome."
                },
                {
                    "input": "race a car",
                    "output": "false",
                    "explanation": "\"raceacar\" is not a palindrome."
                }
            ],
            "time_limit_ms": 1000,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef is_palindrome(s):\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]\n\nif __name__ == '__main__':\n    raw = sys.stdin.read().strip()\n    print('true' if is_palindrome(raw) else 'false')\n",
                "javascript": "const fs = require('fs');\n\nfunction isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}\n\nconst raw = fs.readFileSync(0, 'utf-8').trim();\nconsole.log(isPalindrome(raw) ? 'true' : 'false');\n",
                "cpp": "#include <iostream>\n#include <string>\n#include <cctype>\n\nusing namespace std;\n\nbool isPalindrome(const string& s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++;\n        r--;\n    }\n    return true;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        cout << (isPalindrome(line) ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "A man, a plan, a canal: Panama", "expected_output": "true", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "race a car", "expected_output": "false", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": " ", "expected_output": "true", "is_hidden": True, "weight": 1, "display_order": 3},
                {"input_data": "0P", "expected_output": "false", "is_hidden": True, "weight": 1, "display_order": 4}
            ]
        },
        {
            "slug": "search-in-rotated-sorted-array",
            "title": "Search in Rotated Sorted Array",
            "difficulty": "Medium",
            "xp_reward": 40,
            "tags": ["array", "binary-search"],
            "description_markdown": """There is an integer array `nums` sorted in ascending order (with distinct values).

Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`.

Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.

You must write an algorithm with `O(log n)` runtime complexity.""",
            "input_format": "Line 1: Space-separated integers representing rotated array nums\nLine 2: Single integer representing target",
            "output_format": "Single integer: Index of target or -1",
            "constraints": "1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.\nnums is an ascending array that is possibly rotated.",
            "examples": [
                {
                    "input": "4 5 6 7 0 1 2\n0",
                    "output": "4",
                    "explanation": "Target 0 is at index 4."
                },
                {
                    "input": "4 5 6 7 0 1 2\n3",
                    "output": "-1",
                    "explanation": "Target 3 is not found in nums."
                }
            ],
            "time_limit_ms": 1500,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef search_rotated(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        # Left half is sorted\n        if nums[low] <= nums[mid]:\n            if nums[low] <= target < nums[mid]:\n                high = mid - 1\n            else:\n                low = mid + 1\n        # Right half is sorted\n        else:\n            if nums[mid] < target <= nums[high]:\n                low = mid + 1\n            else:\n                high = mid - 1\n    return -1\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().strip().split('\\n')\n    if len(lines) >= 2:\n        nums = list(map(int, lines[0].split()))\n        target = int(lines[1])\n        print(search_rotated(nums, target))\n",
                "javascript": "const fs = require('fs');\n\nfunction searchRotated(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n    const nums = input[0].trim().split(/\\s+/).map(Number);\n    const target = Number(input[1]);\n    console.log(searchRotated(nums, target));\n}\n",
                "cpp": "#include <iostream>\n#include <vector>\n#include <sstream>\n\nusing namespace std;\n\nint searchRotated(vector<int>& nums, int target) {\n    int low = 0, high = nums.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}\n\nint main() {\n    string line;\n    if (getline(cin, line)) {\n        stringstream ss(line);\n        vector<int> nums;\n        int n;\n        while (ss >> n) nums.push_back(n);\n        int target;\n        if (cin >> target) cout << searchRotated(nums, target) << endl;\n    }\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "4 5 6 7 0 1 2\n0", "expected_output": "4", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "4 5 6 7 0 1 2\n3", "expected_output": "-1", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": "1\n0", "expected_output": "-1", "is_hidden": True, "weight": 1, "display_order": 3},
                {"input_data": "6 7 1 2 3 4 5\n6", "expected_output": "0", "is_hidden": True, "weight": 1, "display_order": 4}
            ]
        },
        {
            "slug": "median-of-two-sorted-arrays",
            "title": "Median of Two Sorted Arrays",
            "difficulty": "Hard",
            "xp_reward": 60,
            "tags": ["array", "binary-search"],
            "description_markdown": """Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.""",
            "input_format": "Line 1: Space-separated integers representing nums1\nLine 2: Space-separated integers representing nums2",
            "output_format": "Float formatted to 5 decimal places or integer if whole (e.g. 2.0 or 2.5)",
            "constraints": "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6",
            "examples": [
                {
                    "input": "1 3\n2",
                    "output": "2.0",
                    "explanation": "merged array = [1,2,3] and median is 2."
                },
                {
                    "input": "1 2\n3 4",
                    "output": "2.5",
                    "explanation": "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
                }
            ],
            "time_limit_ms": 2500,
            "memory_limit_mb": 256,
            "starter_templates": {
                "python": "import sys\n\ndef find_median_sorted_arrays(nums1, nums2):\n    merged = sorted(nums1 + nums2)\n    k = len(merged)\n    if k % 2 == 1:\n        return float(merged[k // 2])\n    return (merged[k // 2 - 1] + merged[k // 2]) / 2.0\n\nif __name__ == '__main__':\n    lines = [line.strip() for line in sys.stdin.read().split('\\n') if line.strip()]\n    nums1 = list(map(int, lines[0].split())) if len(lines) > 0 else []\n    nums2 = list(map(int, lines[1].split())) if len(lines) > 1 else []\n    res = find_median_sorted_arrays(nums1, nums2)\n    print(f'{res:.1f}' if res.is_integer() else f'{res:.5f}'.rstrip('0'))\n",
                "javascript": "const fs = require('fs');\n\nfunction findMedianSortedArrays(nums1, nums2) {\n    const merged = nums1.concat(nums2).sort((a, b) => a - b);\n    const k = merged.length;\n    if (k % 2 === 1) return merged[Math.floor(k / 2)].toFixed(1);\n    return ((merged[Math.floor(k / 2) - 1] + merged[Math.floor(k / 2)]) / 2).toFixed(1);\n}\n\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n').filter(Boolean);\nconst nums1 = lines[0] ? lines[0].trim().split(/\\s+/).map(Number) : [];\nconst nums2 = lines[1] ? lines[1].trim().split(/\\s+/).map(Number) : [];\nconsole.log(findMedianSortedArrays(nums1, nums2));\n",
                "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <sstream>\n#include <iomanip>\n\nusing namespace std;\n\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    vector<int> merged = nums1;\n    merged.insert(merged.end(), nums2.begin(), nums2.end());\n    sort(merged.begin(), merged.end());\n    int k = merged.size();\n    if (k % 2 == 1) return merged[k / 2];\n    return (merged[k / 2 - 1] + merged[k / 2]) / 2.0;\n}\n\nint main() {\n    string line1, line2;\n    vector<int> nums1, nums2;\n    if (getline(cin, line1) && !line1.empty()) {\n        stringstream ss(line1); int n; while (ss >> n) nums1.push_back(n);\n    }\n    if (getline(cin, line2) && !line2.empty()) {\n        stringstream ss(line2); int n; while (ss >> n) nums2.push_back(n);\n    }\n    double med = findMedianSortedArrays(nums1, nums2);\n    cout << fixed << setprecision(1) << med << endl;\n    return 0;\n}\n"
            },
            "test_cases": [
                {"input_data": "1 3\n2", "expected_output": "2.0", "is_hidden": False, "weight": 1, "display_order": 1},
                {"input_data": "1 2\n3 4", "expected_output": "2.5", "is_hidden": False, "weight": 1, "display_order": 2},
                {"input_data": "0 0\n0 0", "expected_output": "0.0", "is_hidden": True, "weight": 1, "display_order": 3}
            ]
        }
    ]

    for p_data in problems_data:
        p, created = Problem.objects.get_or_create(
            slug=p_data["slug"],
            defaults={
                "title": p_data["title"],
                "difficulty": p_data["difficulty"],
                "xp_reward": p_data["xp_reward"],
                "description_markdown": p_data["description_markdown"],
                "input_format": p_data["input_format"],
                "output_format": p_data["output_format"],
                "constraints": p_data["constraints"],
                "examples": p_data["examples"],
                "time_limit_ms": p_data["time_limit_ms"],
                "memory_limit_mb": p_data["memory_limit_mb"],
                "starter_templates": p_data["starter_templates"],
            }
        )
        # Link tags
        for t_slug in p_data["tags"]:
            if t_slug in tag_objs:
                p.tags.add(tag_objs[t_slug])

        # Test cases
        for tc in p_data["test_cases"]:
            ProblemTestCase.objects.get_or_create(
                problem=p,
                display_order=tc["display_order"],
                defaults={
                    "input_data": tc["input_data"],
                    "expected_output": tc["expected_output"],
                    "is_hidden": tc["is_hidden"],
                    "weight": tc["weight"],
                }
            )
        print(f"  {'[Created]' if created else '[Exists]'} Problem: {p.title} ({p.difficulty})")

    print("DSA Problems seeded successfully!")

if __name__ == '__main__':
    run()
