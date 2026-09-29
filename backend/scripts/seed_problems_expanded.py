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

def get_python_starter(title, slug):
    fn_name = slug.replace('-', '_')
    return f'''import sys

def {fn_name}(*args):
    """
    Solve {title}.
    Read inputs from stdin and print the solution to stdout.
    """
    # Write your solution here
    pass

if __name__ == '__main__':
    lines = [line.strip() for line in sys.stdin.read().strip().split('\\n') if line.strip()]
    if lines:
        # Parse inputs
        nums = list(map(int, lines[0].split())) if ' ' in lines[0] else lines[0]
        # Call function and output result
        print(nums)
'''

def get_js_starter(title, slug):
    camel_name = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(slug.split('-')))
    return f'''const fs = require('fs');

function {camel_name}(input) {{
    // Write your solution here
    return input;
}}

const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {{
    console.log({camel_name}(input));
}}
'''

def get_cpp_starter(title, slug):
    return f'''#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// Solution for {title}
int main() {{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string line;
    if (getline(cin, line)) {{
        cout << line << "\\n";
    }}
    return 0;
}}
'''

def run():
    print("=" * 60)
    print("Seeding Expanded DSA Problem Bank (Target: 300 Quality Problems)...")
    print("=" * 60)

    # 1. Tags
    categories = [
        ("Array", "array"),
        ("String", "string"),
        ("Two Pointers", "two-pointers"),
        ("Sliding Window", "sliding-window"),
        ("Prefix Sum", "prefix-sum"),
        ("Binary Search", "binary-search"),
        ("Sorting", "sorting"),
        ("Hash Map", "hash-map"),
        ("Linked List", "linked-list"),
        ("Stack", "stack"),
        ("Queue", "queue"),
        ("Binary Tree", "binary-tree"),
        ("BST", "bst"),
        ("Heap", "heap"),
        ("Graph", "graph"),
        ("Greedy", "greedy"),
        ("Backtracking", "backtracking"),
        ("Dynamic Programming", "dynamic-programming"),
        ("Recursion", "recursion"),
    ]

    tag_map = {}
    for name, slug in categories:
        tag, _ = ProblemTag.objects.get_or_create(slug=slug, defaults={"name": name})
        tag_map[slug] = tag

    # Define 300 problems catalog
    problems_catalog = [
        # Arrays (25)
        ("Two Sum", "two-sum", "Easy", ["array", "hash-map"], "Given an array of integers `nums` and integer `target`, return indices of two numbers that add up to target.", "2 7 11 15\\n9", "0 1", "3 2 4\\n6", "1 2"),
        ("Contains Duplicate", "contains-duplicate", "Easy", ["array", "hash-map"], "Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.", "1 2 3 1", "true", "1 2 3 4", "false"),
        ("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", ["array", "dynamic-programming"], "Find maximum profit you can achieve from buying and selling stock once.", "7 1 5 3 6 4", "5", "7 6 4 3 1", "0"),
        ("Product of Array Except Self", "product-of-array-except-self", "Medium", ["array", "prefix-sum"], "Return an array output such that `output[i]` is equal to the product of all elements of `nums` except `nums[i]`.", "1 2 3 4", "24 12 8 6", "-1 1 0 -3 3", "0 0 9 0 0"),
        ("Maximum Subarray", "maximum-subarray", "Medium", ["array", "dynamic-programming"], "Find the contiguous subarray with the largest sum and return its sum.", "-2 1 -3 4 -1 2 1 -5 4", "6", "5 4 -1 7 8", "23"),
        ("Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "Medium", ["array", "binary-search"], "Given a sorted rotated array of unique elements, return the minimum element.", "3 4 5 1 2", "1", "4 5 6 7 0 1 2", "0"),
        ("3Sum", "3sum", "Medium", ["array", "two-pointers"], "Return all unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.", "-1 0 1 2 -1 -4", "-1 -1 2\\n-1 0 1", "0 1 1", "None"),
        ("Container With Most Water", "container-with-most-water", "Medium", ["array", "two-pointers"], "Find two lines that together with the x-axis form a container, such that the container contains the most water.", "1 8 6 2 5 4 8 3 7", "49", "1 1", "1"),
        ("Trapping Rain Water", "trapping-rain-water", "Hard", ["array", "two-pointers", "stack"], "Given `n` non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap.", "0 1 0 2 1 0 1 3 2 1 2 1", "6", "4 2 0 3 2 5", "9"),
        ("Rotate Image", "rotate-image", "Medium", ["array"], "Rotate an n x n 2D matrix representing an image by 90 degrees clockwise in-place.", "1 2 3\\n4 5 6\\n7 8 9", "7 4 1\\n8 5 2\\n9 6 3", "1 2\\n3 4", "3 1\\n4 2"),
        ("Spiral Matrix", "spiral-matrix", "Medium", ["array"], "Given an m x n matrix, return all elements of the matrix in spiral order.", "1 2 3\\n4 5 6\\n7 8 9", "1 2 3 6 9 8 7 4 5", "1 2 3 4\\n5 6 7 8", "1 2 3 4 8 7 6 5"),
        ("Merge Intervals", "merge-intervals", "Medium", ["array", "sorting"], "Given an array of intervals, merge all overlapping intervals and return non-overlapping intervals.", "1 3\\n2 6\\n8 10\\n15 18", "1 6\\n8 10\\n15 18", "1 4\\n4 5", "1 5"),
        ("Insert Interval", "insert-interval", "Medium", ["array"], "Insert a new interval into a sorted non-overlapping intervals list and merge if necessary.", "1 3\\n6 9\\n2 5", "1 5\\n6 9", "1 2\\n3 5\\n6 7\\n8 10\\n12 16\\n4 8", "1 2\\n3 10\\n12 16"),
        ("Non-overlapping Intervals", "non-overlapping-intervals", "Medium", ["array", "greedy"], "Return the minimum number of intervals you need to remove to make the rest non-overlapping.", "1 2\\n2 3\\n3 4\\n1 3", "1", "1 2\\n1 2\\n1 2", "2"),
        ("Set Matrix Zeroes", "set-matrix-zeroes", "Medium", ["array"], "If an element in an m x n matrix is 0, set its entire row and column to 0 in-place.", "1 1 1\\n1 0 1\\n1 1 1", "1 0 1\\n0 0 0\\n1 0 1", "0 1 2 0\\n3 4 5 2\\n1 3 1 5", "0 0 0 0\\n0 4 5 0\\n0 3 1 0"),
        ("Move Zeroes", "move-zeroes", "Easy", ["array", "two-pointers"], "Move all 0s to the end of array while maintaining relative order of non-zero elements.", "0 1 0 3 12", "1 3 12 0 0", "0", "0"),
        ("Majority Element", "majority-element", "Easy", ["array", "hash-map"], "Find the element that appears more than ⌊n / 2⌋ times using Boyer-Moore Voting Algorithm.", "3 2 3", "3", "2 2 1 1 1 2 2", "2"),
        ("Subarray Sum Equals K", "subarray-sum-equals-k", "Medium", ["array", "prefix-sum", "hash-map"], "Find total number of subarrays whose sum equals to k.", "1 1 1\\n2", "2", "1 2 3\\n3", "2"),
        ("Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium", ["array", "hash-map"], "Return the length of the longest consecutive elements sequence in O(n) time.", "100 4 200 1 3 2", "4", "0 3 7 2 5 8 4 6 0 1", "9"),
        ("Next Permutation", "next-permutation", "Medium", ["array", "two-pointers"], "Rearrange numbers into lexicographically next greater permutation of numbers.", "1 2 3", "1 3 2", "3 2 1", "1 2 3"),
        ("Pascal's Triangle", "pascals-triangle", "Easy", ["array"], "Given integer numRows, return the first numRows of Pascal's triangle.", "5", "1\\n1 1\\n1 2 1\\n1 3 3 1\\n1 4 6 4 1", "1", "1"),
        ("Jump Game", "jump-game", "Medium", ["array", "greedy", "dynamic-programming"], "Determine if you are able to reach the last index starting at index 0.", "2 3 1 1 4", "true", "3 2 1 0 4", "false"),
        ("Jump Game II", "jump-game-ii", "Medium", ["array", "greedy"], "Return minimum number of jumps to reach the last index starting at index 0.", "2 3 1 1 4", "2", "2 3 0 1 4", "2"),
        ("Gas Station", "gas-station", "Medium", ["array", "greedy"], "Return starting gas station index if you can travel around circuit once clockwise, else -1.", "1 2 3 4 5\\n3 4 5 1 2", "3", "2 3 4\\n3 4 3", "-1"),
        ("First Missing Positive", "first-missing-positive", "Hard", ["array", "hash-map"], "Given an unsorted integer array, return the smallest missing positive integer in O(n) time and O(1) space.", "1 2 0", "3", "3 4 -1 1", "2"),

        # Strings (20)
        ("Valid Anagram", "valid-anagram", "Easy", ["string", "hash-map"], "Determine if string t is an anagram of string s.", "anagram\\nnagaram", "true", "rat\\ncar", "false"),
        ("Valid Palindrome", "valid-palindrome", "Easy", ["string", "two-pointers"], "Determine if string is a palindrome considering only alphanumeric chars ignoring cases.", "A man, a plan, a canal: Panama", "true", "race a car", "false"),
        ("Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium", ["string", "sliding-window", "hash-map"], "Find length of the longest substring without repeating characters.", "abcabcbb", "3", "bbbbb", "1"),
        ("Longest Repeating Character Replacement", "longest-repeating-character-replacement", "Medium", ["string", "sliding-window"], "Return length of longest substring with same letter after at most k replacements.", "ABAB\\n2", "4", "AABABBA\\n1", "4"),
        ("Minimum Window Substring", "minimum-window-substring", "Hard", ["string", "sliding-window", "hash-map"], "Return minimum window in s which will contain all the characters in t in O(m+n).", "ADOBECODEBANC\\nABC", "BANC", "a\\na", "a"),
        ("Group Anagrams", "group-anagrams", "Medium", ["string", "hash-map", "sorting"], "Given an array of strings, group the anagrams together in any order.", "eat tea tan ate nat bat", "bat\\nnat tan\\nate eat tea", "a", "a"),
        ("Valid Parentheses", "valid-parentheses", "Easy", ["string", "stack"], "Determine if input string of brackets '()[]{}' is valid.", "()[]{}", "true", "(]", "false"),
        ("Longest Palindromic Substring", "longest-palindromic-substring", "Medium", ["string", "dynamic-programming", "two-pointers"], "Return the longest palindromic substring in string s.", "babad", "bab", "cbbd", "bb"),
        ("Palindromic Substrings", "palindromic-substrings", "Medium", ["string", "dynamic-programming"], "Count how many palindromic substrings are in string s.", "abc", "3", "aaa", "6"),
        ("Encode and Decode Strings", "encode-and-decode-strings", "Medium", ["string"], "Design an algorithm to encode a list of strings to a string and decode back.", "lint code love you", "lint code love you", "we say yes", "we say yes"),
        ("String Compression", "string-compression", "Medium", ["string", "two-pointers"], "Compress string in-place using character frequency counts.", "a a b b c c c", "6", "a", "1"),
        ("Reverse Words in a String", "reverse-words-in-a-string", "Medium", ["string", "two-pointers"], "Reverse the order of words in a string with multiple spaces.", "the sky is blue", "blue is sky the", "  hello world  ", "world hello"),
        ("Multiply Strings", "multiply-strings", "Medium", ["string"], "Given two non-negative integers as strings, return their product as string without BigInt.", "2\\n3", "6", "123\\n456", "56088"),
        ("Add Strings", "add-strings", "Easy", ["string"], "Add two non-negative integers given as strings and return sum as string.", "11\\n123", "134", "456\\n77", "533"),
        ("Count and Say", "count-and-say", "Medium", ["string", "recursion"], "Run-length encoding sequence generation for n-th term.", "1", "1", "4", "1211"),
        ("Simplify Path", "simplify-path", "Medium", ["string", "stack"], "Convert an absolute Unix path to canonical path.", "/home/", "/home", "/../", "/"),
        ("Restore IP Addresses", "restore-ip-addresses", "Medium", ["string", "backtracking"], "Return all possible valid IP addresses that can be formed from string s.", "25525511135", "255.255.11.135\\n255.255.111.35", "0000", "0.0.0.0"),
        ("Word Break", "word-break", "Medium", ["string", "dynamic-programming", "hash-map"], "Return true if string s can be segmented into a space-separated sequence of dictionary words.", "leetcode\\nleet code", "true", "applepenapple\\napple pen", "true"),
        ("Wildcard Matching", "wildcard-matching", "Hard", ["string", "dynamic-programming", "greedy"], "Implement wildcard pattern matching with '?' and '*'.", "aa\\na", "false", "aa\\n*", "true"),
        ("Regular Expression Matching", "regular-expression-matching", "Hard", ["string", "dynamic-programming", "recursion"], "Implement regular expression matching supporting '.' and '*'.", "aa\\na*", "true", "ab\\n.*", "true"),

        # Two Pointers (15)
        ("Two Sum II - Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "Medium", ["two-pointers", "array", "binary-search"], "Find two numbers in 1-indexed sorted array that add up to target.", "2 7 11 15\\n9", "1 2", "2 3 4\\n6", "1 3"),
        ("3Sum Closest", "3sum-closest", "Medium", ["two-pointers", "array", "sorting"], "Find three integers in nums such that sum is closest to target.", "-1 2 1 -4\\n1", "2", "0 0 0\\n1", "0"),
        ("4Sum", "4sum", "Medium", ["two-pointers", "array", "sorting"], "Return all unique quadruplets summing to target.", "1 0 -1 0 -2 2\\n0", "-2 -1 1 2\\n-2 0 0 2\\n-1 0 0 1", "2 2 2 2 2\\n8", "2 2 2 2"),
        ("Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy", ["two-pointers", "array"], "Remove duplicates in-place such that each unique element appears once. Return k.", "1 1 2", "2", "0 0 1 1 1 2 2 3 3 4", "5"),
        ("Remove Element", "remove-element", "Easy", ["two-pointers", "array"], "Remove all occurrences of val in-place and return new length.", "3 2 2 3\\n3", "2", "0 1 2 2 3 0 4 2\\n2", "5"),
        ("Sort Colors", "sort-colors", "Medium", ["two-pointers", "array", "sorting"], "Dutch National Flag problem: sort array with 0s, 1s, and 2s in-place in one pass.", "2 0 2 1 1 0", "0 0 1 1 2 2", "2 0 1", "0 1 2"),
        ("Squares of a Sorted Array", "squares-of-a-sorted-array", "Easy", ["two-pointers", "array", "sorting"], "Return an array of squares of each number sorted in non-decreasing order.", "-4 -1 0 3 10", "0 1 9 16 100", "-7 -3 2 3 11", "4 9 9 49 121"),
        ("Valid Palindrome II", "valid-palindrome-ii", "Easy", ["two-pointers", "string"], "Determine if s can be a palindrome after deleting at most one character.", "aba", "true", "abca", "true"),
        ("Reverse String", "reverse-string", "Easy", ["two-pointers", "string"], "Reverse an array of characters in-place.", "h e l l o", "o l l e h", "H a n n a h", "h a n n a H"),
        ("Reverse Vowels of a String", "reverse-vowels-of-a-string", "Easy", ["two-pointers", "string"], "Reverse only the vowels in a given string.", "hello", "holle", "leetcode", "leotcede"),
        ("Backspace String Compare", "backspace-string-compare", "Easy", ["two-pointers", "stack", "string"], "Given two strings with '#' as backspace, return true if equal.", "ab#c\\nad#c", "true", "ab##\\nc#d#", "true"),
        ("Interval List Intersections", "interval-list-intersections", "Medium", ["two-pointers", "array"], "Return the intersection of two closed interval lists.", "0 2\\n5 10\\n13 23\\n1 5\\n8 12\\n15 24", "1 2\\n5 5\\n8 10\\n15 23", "1 3\\n5 9\\n", "None"),
        ("Boats to Save People", "boats-to-save-people", "Medium", ["two-pointers", "greedy", "sorting"], "Return minimum number of boats to carry every given person with weight limit.", "1 2\\n3", "1", "3 2 2 1\\n3", "3"),
        ("Shortest Unsorted Continuous Subarray", "shortest-unsorted-continuous-subarray", "Medium", ["two-pointers", "array", "sorting"], "Find length of shortest continuous subarray that if sorted sorts the whole array.", "2 6 4 8 10 9 15", "5", "1 2 3 4", "0"),
        ("3Sum Smaller", "3sum-smaller", "Medium", ["two-pointers", "array", "sorting"], "Count triplets (i, j, k) with i < j < k and nums[i] + nums[j] + nums[k] < target.", "-2 0 1 3\\n2", "2", "0\\n0", "0"),

        # Sliding Window (15)
        ("Maximum Average Subarray I", "maximum-average-subarray-i", "Easy", ["sliding-window", "array"], "Find contiguous subarray of length k with maximum average value.", "1 12 -5 -6 50 3\\n4", "12.75", "5\\n1", "5.0"),
        ("Max Consecutive Ones III", "max-consecutive-ones-iii", "Medium", ["sliding-window", "array"], "Given binary array and integer k, return max consecutive 1s if you can flip at most k 0s.", "1 1 1 0 0 0 1 1 1 1 0\\n2", "6", "0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\\n3", "10"),
        ("Fruit Into Baskets", "fruit-into-baskets", "Medium", ["sliding-window", "array", "hash-map"], "Find maximum number of fruits you can pick with 2 baskets.", "1 2 1", "3", "0 1 2 2", "3"),
        ("Longest Substring with At Most K Distinct Characters", "longest-substring-with-at-most-k-distinct-characters", "Medium", ["sliding-window", "string", "hash-map"], "Find length of longest substring with at most k distinct characters.", "eceba\\n2", "3", "aa\\n1", "2"),
        ("Subarrays with K Different Integers", "subarrays-with-k-different-integers", "Hard", ["sliding-window", "array", "hash-map"], "Return number of good subarrays having exactly k different integers.", "1 2 1 2 3\\n2", "7", "1 2 1 3 4\\n3", "3"),
        ("Permutation in String", "permutation-in-string", "Medium", ["sliding-window", "string", "hash-map"], "Return true if s2 contains a permutation of s1.", "ab\\neidbaooo", "true", "ab\\neidboaoo", "false"),
        ("Find All Anagrams in a String", "find-all-anagrams-in-a-string", "Medium", ["sliding-window", "string", "hash-map"], "Return all start indices of p's anagrams in s.", "cbaebabacd\\nabc", "0 6", "abab\\nab", "0 1 2"),
        ("Sliding Window Maximum", "sliding-window-maximum", "Hard", ["sliding-window", "queue", "heap"], "Return maximum in each sliding window of size k moving from left to right.", "1 3 -1 -3 5 3 6 7\\n3", "3 3 5 5 6 7", "1\\n1", "1"),
        ("Minimum Size Subarray Sum", "minimum-size-subarray-sum", "Medium", ["sliding-window", "array", "binary-search"], "Return minimal length of subarray with sum >= target. If none, return 0.", "2 3 1 2 4 3\\n7", "2", "1 4 4\\n4", "1"),
        ("Subarray Product Less Than K", "subarray-product-less-than-k", "Medium", ["sliding-window", "array"], "Return number of contiguous subarrays where product of elements is strictly less than k.", "10 5 2 6\\n100", "8", "1 2 3\\n0", "0"),
        ("Frequency of the Most Frequent Element", "frequency-of-the-most-frequent-element", "Medium", ["sliding-window", "array", "sorting"], "Return max frequency of an element after at most k operations.", "1 2 4\\n5", "3", "1 4 8 13\\n5", "2"),
        ("Longest Turbulent Subarray", "longest-turbulent-subarray", "Medium", ["sliding-window", "array", "dynamic-programming"], "Return length of a maximum size turbulent subarray of arr.", "9 4 2 10 7 8 8 1 9", "5", "4 8 12 16", "2"),
        ("Maximum Number of Vowels in Substring", "maximum-number-of-vowels-in-substring", "Medium", ["sliding-window", "string"], "Return maximum number of vowels in any substring of length k.", "abciiidef\\n3", "3", "aeiou\\n2", "2"),
        ("Diet Plan Performance", "diet-plan-performance", "Easy", ["sliding-window", "array"], "Calculate total points scored on a k-day calories diet plan.", "1 2 3 4 5\\n1\\n3\\n3", "0", "3 2\\n2\\n0\\n1", "1"),
        ("Defuse the Bomb", "defuse-the-bomb", "Easy", ["sliding-window", "array"], "Decipher circular code array using integer k rules.", "5 7 1 4\\n3", "12 10 16 13", "1 2 3 4\\n0", "0 0 0 0"),

        # Binary Search (15)
        ("Binary Search", "binary-search", "Easy", ["binary-search", "array"], "Given a sorted array of integers and target, return index or -1.", "-1 0 3 5 9 12\\n9", "4", "-1 0 3 5 9 12\\n2", "-1"),
        ("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "Medium", ["binary-search", "array"], "Search target in rotated sorted array in O(log n) time.", "4 5 6 7 0 1 2\\n0", "4", "4 5 6 7 0 1 2\\n3", "-1"),
        ("Find First and Last Position in Sorted Array", "find-first-and-last-position-in-sorted-array", "Medium", ["binary-search", "array"], "Find starting and ending position of target value in sorted array in O(log n).", "5 7 7 8 8 10\\n8", "3 4", "5 7 7 8 8 10\\n6", "-1 -1"),
        ("Search a 2D Matrix", "search-a-2d-matrix", "Medium", ["binary-search", "array"], "Search for value in m x n matrix where each row is sorted and first integer of row > last of previous.", "1 3 5 7\\n10 11 16 20\\n23 30 34 60\\n3", "true", "1 3 5 7\\n10 11 16 20\\n23 30 34 60\\n13", "false"),
        ("Search a 2D Matrix II", "search-a-2d-matrix-ii", "Medium", ["binary-search", "two-pointers"], "Search target in matrix where rows and columns are independently sorted.", "1 4 7 11\\n2 5 8 12\\n3 6 9 16\\n5", "true", "1 4 7 11\\n2 5 8 12\\n3 6 9 16\\n20", "false"),
        ("Find Peak Element", "find-peak-element", "Medium", ["binary-search", "array"], "Find a peak element (strictly greater than neighbors) in O(log n) time.", "1 2 3 1", "2", "1 2 1 3 5 6 4", "5"),
        ("Koko Eating Bananas", "koko-eating-bananas", "Medium", ["binary-search", "array"], "Return minimum integer k such that Koko can eat all bananas within h hours.", "3 6 7 11\\n8", "4", "30 11 23 4 20\\n5", "30"),
        ("Capacity to Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", "Medium", ["binary-search", "array"], "Return least weight capacity of ship that will result in all packages shipped within days.", "1 2 3 4 5 6 7 8 9 10\\n5", "15", "3 2 2 4 1 4\\n3", "6"),
        ("Split Array Largest Sum", "split-array-largest-sum", "Hard", ["binary-search", "dynamic-programming"], "Split array into k non-empty subarrays such that the largest sum among any subarray is minimized.", "7 2 5 10 8\\n2", "18", "1 2 3 4 5\\n2", "9"),
        ("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "Hard", ["binary-search", "array"], "Find median of two sorted arrays in O(log(m+n)) runtime.", "1 3\\n2", "2.0", "1 2\\n3 4", "2.5"),
        ("Sqrt(x)", "sqrtx", "Easy", ["binary-search", "recursion"], "Compute and return integer square root of non-negative integer x.", "4", "2", "8", "2"),
        ("Guess Number Higher or Lower", "guess-number-higher-or-lower", "Easy", ["binary-search"], "Binary search guess game for target number between 1 and n.", "10\\n6", "6", "1\\n1", "1"),
        ("Search Insert Position", "search-insert-position", "Easy", ["binary-search", "array"], "Return index if target is found. If not, return index where it would be if inserted in order.", "1 3 5 6\\n5", "2", "1 3 5 6\\n2", "1"),
        ("Find in Mountain Array", "find-in-mountain-array", "Hard", ["binary-search"], "Find minimum index such that mountainArr.get(index) == target.", "1 2 3 4 5 3 1\\n3", "2", "0 1 2 4 2 1\\n3", "-1"),
        ("Arranging Coins", "arranging-coins", "Easy", ["binary-search"], "Find number of complete rows of a staircase coins problem.", "5", "2", "8", "3"),

        # Sorting (15)
        ("Merge Sorted Array", "merge-sorted-array", "Easy", ["sorting", "array", "two-pointers"], "Merge nums2 into nums1 as one sorted array in-place.", "1 2 3 0 0 0\\n3\\n2 5 6\\n3", "1 2 2 3 5 6", "1\\n1\\n\\n0", "1"),
        ("Kth Largest Element in an Array", "kth-largest-element-in-an-array", "Medium", ["sorting", "heap", "two-pointers"], "Find kth largest element in an unsorted array in average O(n) using QuickSelect.", "3 2 1 5 6 4\\n2", "5", "3 2 3 1 2 4 5 5 6\\n4", "4"),
        ("Top K Frequent Elements", "top-k-frequent-elements", "Medium", ["sorting", "heap", "hash-map"], "Return k most frequent elements in array.", "1 1 1 2 2 3\\n2", "1 2", "1\\n1", "1"),
        ("Sort an Array", "sort-an-array", "Medium", ["sorting", "recursion"], "Sort an array of integers in ascending order in O(n log n) without built-ins.", "5 2 3 1", "1 2 3 5", "5 1 1 2 0 0", "0 0 1 1 2 5"),
        ("Relative Sort Array", "relative-sort-array", "Easy", ["sorting", "array", "hash-map"], "Sort elements of arr1 according to relative ordering in arr2.", "2 3 1 3 2 4 6 7 9 2 19\\n2 1 4 3 9 6", "2 2 2 1 4 3 3 9 6 7 19", "28 6 22 8 44 17\\n22 28 8 6", "22 28 8 6 17 44"),
        ("Largest Number", "largest-number", "Medium", ["sorting", "string", "greedy"], "Given a list of non-negative integers, arrange them such that they form the largest number.", "10 2", "210", "3 30 34 5 9", "9534330"),
        ("Maximum Gap", "maximum-gap", "Medium", ["sorting", "array"], "Return maximum difference between two successive elements in its sorted form in linear time.", "3 6 9 1", "3", "10", "0"),
        ("H-Index", "h-index", "Medium", ["sorting", "array"], "Compute researcher's h-index from citations array.", "3 0 6 1 5", "3", "1 3 1", "1"),
        ("Wiggle Sort II", "wiggle-sort-ii", "Medium", ["sorting", "array"], "Reorder array such that nums[0] < nums[1] > nums[2] < nums[3]...", "1 5 1 1 6 4", "1 6 1 5 1 4", "1 3 2 2 3 1", "2 3 1 3 1 2"),
        ("Pancake Sorting", "pancake-sorting", "Medium", ["sorting", "array"], "Sort array using pancake flips (reverse prefix).", "3 2 4 1", "4 2 4 3", "1 2 3", "None"),
        ("Reorganize String", "reorganize-string", "Medium", ["sorting", "heap", "greedy", "string"], "Rearrange string characters so that any two adjacent characters are not the same.", "aab", "aba", "aaab", ""),
        ("Intersection of Two Arrays", "intersection-of-two-arrays", "Easy", ["sorting", "hash-map", "two-pointers"], "Return unique elements present in both arrays.", "1 2 2 1\\n2 2", "2", "4 9 5\\n9 4 9 8 4", "9 4"),
        ("Intersection of Two Arrays II", "intersection-of-two-arrays-ii", "Easy", ["sorting", "hash-map", "two-pointers"], "Return intersection considering duplicate counts.", "1 2 2 1\\n2 2", "2 2", "4 9 5\\n9 4 9 8 4", "4 9"),
        ("Meeting Rooms", "meeting-rooms", "Easy", ["sorting", "array"], "Determine if a person could attend all meetings without overlap.", "0 30\\n5 10\\n15 20", "false", "7 10\\n2 4", "true"),
        ("Meeting Rooms II", "meeting-rooms-ii", "Medium", ["sorting", "heap", "two-pointers"], "Return minimum number of conference rooms required.", "0 30\\n5 10\\n15 20", "2", "7 10\\n2 4", "1"),

        # Linked Lists (20)
        ("Reverse Linked List", "reverse-linked-list", "Easy", ["linked-list", "recursion"], "Reverse a singly linked list iteratively and recursively.", "1 2 3 4 5", "5 4 3 2 1", "1 2", "2 1"),
        ("Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy", ["linked-list", "recursion"], "Merge two sorted linked lists and return it as a sorted list.", "1 2 4\\n1 3 4", "1 1 2 3 4 4", "\\n0", "0"),
        ("Linked List Cycle", "linked-list-cycle", "Easy", ["linked-list", "two-pointers"], "Determine if linked list has a cycle using Floyd's Tortoise and Hare.", "3 2 0 -4\\n1", "true", "1 2\\n0", "true"),
        ("Linked List Cycle II", "linked-list-cycle-ii", "Medium", ["linked-list", "two-pointers"], "Return node where cycle begins. If no cycle, return null.", "3 2 0 -4\\n1", "tail connects to node index 1", "1\\n-1", "no cycle"),
        ("Middle of the Linked List", "middle-of-the-linked-list", "Easy", ["linked-list", "two-pointers"], "Return the middle node of the linked list.", "1 2 3 4 5", "3 4 5", "1 2 3 4 5 6", "4 5 6"),
        ("Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "Medium", ["linked-list", "two-pointers"], "Remove nth node from end of list in one pass.", "1 2 3 4 5\\n2", "1 2 3 5", "1\\n1", ""),
        ("Delete Node in a Linked List", "delete-node-in-a-linked-list", "Medium", ["linked-list"], "Delete a given node in singly linked list without access to head.", "4 5 1 9\\n5", "4 1 9", "4 5 1 9\\n1", "4 5 9"),
        ("Palindrome Linked List", "palindrome-linked-list", "Easy", ["linked-list", "two-pointers"], "Determine if a singly linked list is a palindrome in O(n) time and O(1) space.", "1 2 2 1", "true", "1 2", "false"),
        ("Intersection of Two Linked Lists", "intersection-of-two-linked-lists", "Easy", ["linked-list", "two-pointers"], "Find node at which the intersection of two singly linked lists begins.", "4 1 8 4 5\\n5 6 1 8 4 5", "Intersected at '8'", "2 6 4\\n1 5", "No intersection"),
        ("Add Two Numbers", "add-two-numbers", "Medium", ["linked-list", "recursion"], "Add two numbers represented by linked lists in reverse order.", "2 4 3\\n5 6 4", "7 0 8", "0\\n0", "0"),
        ("Copy List with Random Pointer", "copy-list-with-random-pointer", "Medium", ["linked-list", "hash-map"], "Construct a deep copy of list where each node has a random pointer.", "7 null 13 0 11 4", "7 null 13 0 11 4", "1 1 2 1", "1 1 2 1"),
        ("Reorder List", "reorder-list", "Medium", ["linked-list", "two-pointers"], "Reorder list to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → … in-place.", "1 2 3 4", "1 4 2 3", "1 2 3 4 5", "1 5 2 4 3"),
        ("Sort List", "sort-list", "Medium", ["linked-list", "sorting", "two-pointers"], "Sort a linked list in O(n log n) time and O(1) space using Merge Sort.", "4 2 1 3", "1 2 3 4", "-1 5 3 4 0", "-1 0 3 4 5"),
        ("Merge k Sorted Lists", "merge-k-sorted-lists", "Hard", ["linked-list", "heap", "sorting"], "Merge k sorted linked lists and return as one sorted list.", "1 4 5\\n1 3 4\\n2 6", "1 1 2 3 4 4 5 6", "", ""),
        ("Reverse Nodes in k-Group", "reverse-nodes-in-k-group", "Hard", ["linked-list", "recursion"], "Reverse nodes of linked list k at a time and return modified list.", "1 2 3 4 5\\n2", "2 1 4 3 5", "1 2 3 4 5\\n3", "3 2 1 4 5"),
        ("Rotate List", "rotate-list", "Medium", ["linked-list", "two-pointers"], "Rotate the list to the right by k places.", "1 2 3 4 5\\n2", "4 5 1 2 3", "0 1 2\\n4", "2 0 1"),
        ("Partition List", "partition-list", "Medium", ["linked-list", "two-pointers"], "Partition list such that nodes < x come before nodes >= x preserving relative order.", "1 4 3 2 5 2\\n3", "1 2 2 4 3 5", "2 1\\n2", "1 2"),
        ("Odd Even Linked List", "odd-even-linked-list", "Medium", ["linked-list"], "Group all odd-indexed nodes together followed by even-indexed nodes.", "1 2 3 4 5", "1 3 5 2 4", "2 1 3 5 6 4 7", "2 3 6 7 1 5 4"),
        ("Swap Nodes in Pairs", "swap-nodes-in-pairs", "Medium", ["linked-list", "recursion"], "Swap every two adjacent nodes and return its head.", "1 2 3 4", "2 1 4 3", "1", "1"),
        ("Remove Duplicates from Sorted List", "remove-duplicates-from-sorted-list", "Easy", ["linked-list"], "Delete all duplicates such that each element appears only once.", "1 1 2", "1 2", "1 1 2 3 3", "1 2 3"),

        # Stack (15)
        ("Min Stack", "min-stack", "Medium", ["stack"], "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.", "push(-2) push(0) push(-3) getMin() pop() top() getMin()", "-3 0 -2", "push(1) getMin()", "1"),
        ("Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "Medium", ["stack", "array"], "Evaluate the value of an arithmetic expression in Reverse Polish Notation.", "2 1 + 3 *", "9", "4 13 5 / +", "6"),
        ("Daily Temperatures", "daily-temperatures", "Medium", ["stack", "array"], "Return array answer such that answer[i] is number of days you have to wait after ith day for warmer temp.", "73 74 75 71 69 72 76 73", "1 1 4 2 1 1 0 0", "30 40 50 60", "1 1 1 0"),
        ("Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "Hard", ["stack", "array"], "Find area of largest rectangle in histogram bars using monotonic stack.", "2 1 5 6 2 3", "10", "2 4", "4"),
        ("Maximal Rectangle", "maximal-rectangle", "Hard", ["stack", "dynamic-programming", "array"], "Find largest rectangle containing only 1s in a 2D binary matrix.", "1 0 1 0 0\\n1 0 1 1 1\\n1 1 1 1 1\\n1 0 0 1 0", "6", "0", "0"),
        ("Online Stock Span", "online-stock-span", "Medium", ["stack"], "Collect daily price quotes and return span of that stock's price for current day.", "100 80 60 70 60 75 85", "1 1 1 2 1 4 6", "10", "1"),
        ("Next Greater Element I", "next-greater-element-i", "Easy", ["stack", "hash-map"], "Find next greater element for each value in subset array nums1 within nums2.", "4 1 2\\n1 3 4 2", "-1 3 -1", "2 4\\n1 2 3 4", "3 -1"),
        ("Next Greater Element II", "next-greater-element-ii", "Medium", ["stack", "array"], "Find next greater number for every element in a circular array.", "1 2 1", "2 -1 2", "1 2 3 4 3", "2 3 4 -1 4"),
        ("132 Pattern", "132-pattern", "Medium", ["stack", "array", "binary-search"], "Find if there exists a 132 pattern: nums[i] < nums[k] < nums[j] with i < j < k.", "1 2 3 4", "false", "3 1 4 2", "true"),
        ("Asteroid Collision", "asteroid-collision", "Medium", ["stack", "array"], "Find state of asteroids after all collisions between positive (right) and negative (left).", "5 10 -5", "5 10", "8 -8", ""),
        ("Decode String", "decode-string", "Medium", ["stack", "recursion", "string"], "Given an encoded string k[encoded_string], return its decoded string.", "3[a]2[bc]", "aaabcbc", "3[a2[c]]", "accaccacc"),
        ("Basic Calculator", "basic-calculator", "Hard", ["stack", "recursion", "string"], "Implement basic calculator to evaluate a simple expression string containing '(', ')', '+', '-'.", "1 + 1", "2", " 2-1 + 2 ", "3"),
        ("Basic Calculator II", "basic-calculator-ii", "Medium", ["stack", "string"], "Evaluate arithmetic expression string with '+', '-', '*', '/'.", "3+2*2", "7", " 3/2 ", "1"),
        ("Remove All Adjacent Duplicates in String", "remove-all-adjacent-duplicates-in-string", "Easy", ["stack", "string"], "Repeatedly remove adjacent duplicates from string until none remain.", "abbaca", "ca", "azxxzy", "ay"),
        ("Valid Stack Sequences", "validate-stack-sequences", "Medium", ["stack", "array"], "Return true if this could have been the result of a sequence of push and pop operations.", "1 2 3 4 5\\n4 5 3 2 1", "true", "1 2 3 4 5\\n4 3 5 1 2", "false"),

        # Queue (12)
        ("Implement Queue using Stacks", "implement-queue-using-stacks", "Easy", ["queue", "stack"], "Implement FIFO queue using only two stacks.", "push(1) push(2) peek() pop() empty()", "1 1 false", "push(5) empty()", "false"),
        ("Implement Stack using Queues", "implement-stack-using-queues", "Easy", ["queue", "stack"], "Implement LIFO stack using only queues.", "push(1) push(2) top() pop() empty()", "2 2 false", "push(1) empty()", "false"),
        ("Design Circular Queue", "design-circular-queue", "Medium", ["queue", "array"], "Design your implementation of the circular queue with fixed size buffer.", "enQ(1) enQ(2) enQ(3) Rear() isFull() deQ()", "true true true 3 true true", "enQ(5) Front()", "true 5"),
        ("Design Circular Deque", "design-circular-deque", "Medium", ["queue", "array"], "Design your implementation of the circular double-ended queue.", "insertLast(1) insertLast(2) getFront() getRear()", "true true 1 2", "insertFront(1) isFull()", "true false"),
        ("Number of Recent Calls", "number-of-recent-calls", "Easy", ["queue"], "Count number of recent requests within a certain time frame [t - 3000, t].", "ping(1) ping(100) ping(3001) ping(3002)", "1 2 3 3", "ping(1)", "1"),
        ("Reveal Cards In Increasing Order", "reveal-cards-in-increasing-order", "Medium", ["queue", "array", "sorting"], "Order cards so that revealing top and moving next to bottom reveals cards in sorted order.", "17 13 11 2 3 5 7", "2 13 3 11 5 17 7", "1 1000", "1 1000"),
        ("Dota2 Senate", "dota2-senate", "Medium", ["queue", "greedy", "string"], "Simulate round-robin ban voting between Radiant and Dire senators.", "RD", "Radiant", "RDD", "Dire"),
        ("Design Front Middle Back Queue", "design-front-middle-back-queue", "Medium", ["queue", "linked-list"], "Design queue that supports push and pop at front, middle, and back.", "pushFront(1) pushBack(2) pushMiddle(3) popFront()", "1", "pushMiddle(1) popMiddle()", "1"),
        ("First Unique Number", "first-unique-number", "Medium", ["queue", "hash-map"], "Implement FirstUnique data structure retrieving first non-repeating number.", "add(2) add(3) add(5) showFirstUnique() add(2) showFirstUnique()", "2 3", "add(1) showFirstUnique()", "1"),
        ("Shortest Subarray with Sum at Least K", "shortest-subarray-with-sum-at-least-k", "Hard", ["queue", "prefix-sum", "binary-search"], "Return length of shortest non-empty subarray with sum >= k using monotonic deque.", "1\\n1", "1", "1 2\\n4", "-1"),
        ("Moving Average from Data Stream", "moving-average-from-data-stream", "Easy", ["queue"], "Calculate moving average of all integers in sliding window.", "size(3) next(1) next(10) next(3) next(5)", "1.0 5.5 4.66 6.0", "size(1) next(4)", "4.0"),
        ("Time Needed to Buy Tickets", "time-needed-to-buy-tickets", "Easy", ["queue", "array"], "Calculate seconds needed for person at position k to finish buying all tickets.", "2 3 2\\n2", "6", "5 1 1 1\\n0", "8"),

        # Trees & BST (35)
        ("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy", ["binary-tree", "recursion"], "Find maximum depth (longest path from root to leaf node).", "3 9 20 null null 15 7", "3", "1 null 2", "2"),
        ("Same Tree", "same-tree", "Easy", ["binary-tree", "recursion"], "Check if two binary trees are structurally identical and have the same node values.", "1 2 3\\n1 2 3", "true", "1 2\\n1 null 2", "false"),
        ("Invert Binary Tree", "invert-binary-tree", "Easy", ["binary-tree", "recursion"], "Invert a binary tree (swap left and right child pointers recursively).", "4 2 7 1 3 6 9", "4 7 2 9 6 3 1", "2 1 3", "2 3 1"),
        ("Symmetric Tree", "symmetric-tree", "Easy", ["binary-tree", "recursion"], "Check whether a binary tree is a mirror of itself around its center.", "1 2 2 3 4 4 3", "true", "1 2 2 null 3 null 3", "false"),
        ("Subtree of Another Tree", "subtree-of-another-tree", "Easy", ["binary-tree", "recursion"], "Determine if tree subRoot is a subtree of tree root.", "3 4 5 1 2\\n4 1 2", "true", "3 4 5 1 2 null null null null 0\\n4 1 2", "false"),
        ("Lowest Common Ancestor of a Binary Tree", "lowest-common-ancestor-of-a-binary-tree", "Medium", ["binary-tree", "recursion"], "Find lowest node in T that has both p and q as descendants.", "3 5 1 6 2 0 8 null null 7 4\\n5\\n1", "3", "3 5 1 6 2 0 8\\n5\\n4", "5"),
        ("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium", ["binary-tree", "queue"], "Return level order traversal of nodes' values (BFS).", "3 9 20 null null 15 7", "3\\n9 20\\n15 7", "1", "1"),
        ("Binary Tree Right Side View", "binary-tree-right-side-view", "Medium", ["binary-tree", "queue"], "Return the values of nodes you can see ordered from top to bottom standing on right side.", "1 2 3 null 5 null 4", "1 3 4", "1 null 3", "1 3"),
        ("Count Complete Tree Nodes", "count-complete-tree-nodes", "Medium", ["binary-tree", "binary-search"], "Count the number of nodes in a complete binary tree in less than O(n) time.", "1 2 3 4 5 6", "6", "", "0"),
        ("Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", "Medium", ["binary-tree", "queue"], "Return zigzag level order traversal of binary tree (left-right then right-left).", "3 9 20 null null 15 7", "3\\n20 9\\n15 7", "1", "1"),
        ("Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "Medium", ["binary-tree", "hash-map"], "Reconstruct unique binary tree given its preorder and inorder traversals.", "3 9 20 15 7\\n9 3 15 20 7", "3 9 20 null null 15 7", "-1\\n-1", "-1"),
        ("Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "Hard", ["binary-tree", "dynamic-programming"], "Find maximum path sum where path goes through any sequence of nodes.", "1 2 3", "6", "-10 9 20 null null 15 7", "42"),
        ("Diameter of Binary Tree", "diameter-of-binary-tree", "Easy", ["binary-tree", "recursion"], "Return length of the longest path between any two nodes in a tree.", "1 2 3 4 5", "3", "1 2", "1"),
        ("Balanced Binary Tree", "balanced-binary-tree", "Easy", ["binary-tree", "recursion"], "Determine if binary tree is height-balanced (left and right heights differ by <= 1).", "3 9 20 null null 15 7", "true", "1 2 2 3 3 null null 4 4", "false"),
        ("Path Sum", "path-sum", "Easy", ["binary-tree", "recursion"], "Determine if tree has a root-to-leaf path such that sum of values equals targetSum.", "5 4 8 11 null 13 4 7 2 null null null 1\\n22", "true", "1 2 3\\n5", "false"),
        ("Path Sum II", "path-sum-ii", "Medium", ["binary-tree", "backtracking"], "Find all root-to-leaf paths where sum of node values equals targetSum.", "5 4 8 11 null 13 4 7 2 null null 5 1\\n22", "5 4 11 2\\n5 8 4 5", "1 2 3\\n5", "None"),
        ("Flatten Binary Tree to Linked List", "flatten-binary-tree-to-linked-list", "Medium", ["binary-tree", "stack"], "Flatten binary tree into a 'linked list' in-place following preorder traversal.", "1 2 5 3 4 null 6", "1 null 2 null 3 null 4 null 5 null 6", "0", "0"),
        ("Populating Next Right Pointers in Each Node", "populating-next-right-pointers-in-each-node", "Medium", ["binary-tree", "queue"], "Populate each next pointer to point to its next right node in perfect binary tree.", "1 2 3 4 5 6 7", "1 # 2 3 # 4 5 6 7 #", "", ""),
        ("Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "Hard", ["binary-tree", "string"], "Design an algorithm to serialize and deserialize a binary tree to and from string.", "1 2 3 null null 4 5", "1 2 3 null null 4 5", "", ""),
        ("Validate Binary Search Tree", "validate-binary-search-tree", "Medium", ["bst", "recursion"], "Determine if a binary tree is a valid binary search tree (BST).", "2 1 3", "true", "5 1 4 null null 3 6", "false"),
        ("Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-bst", "Medium", ["bst", "binary-search"], "Find lowest common ancestor of two given nodes in BST.", "6 2 8 0 4 7 9 null null 3 5\\n2\\n8", "6", "6 2 8 0 4 7 9 null null 3 5\\n2\\n4", "2"),
        ("Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "Medium", ["bst"], "Insert a value into BST and return the root node.", "4 2 7 1 3\\n5", "4 2 7 1 3 5", "40 20 60 10 30 50 70\\n25", "40 20 60 10 30 50 70 null null 25"),
        ("Delete Node in a BST", "delete-node-in-a-bst", "Medium", ["bst", "recursion"], "Delete node with given key in BST and adjust tree.", "5 3 6 2 4 null 7\\n3", "5 4 6 2 null null 7", "5 3 6 2 4 null 7\\n0", "5 3 6 2 4 null 7"),
        ("Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "Medium", ["bst", "recursion"], "Find kth smallest element in BST using inorder traversal.", "3 1 4 null 2\\n1", "1", "5 3 6 2 4 null null 1\\n3", "3"),
        ("Search in a Binary Search Tree", "search-in-a-binary-search-tree", "Easy", ["bst", "binary-search"], "Find node in BST that the node's value equals val and return subtree.", "4 2 7 1 3\\n2", "2 1 3", "4 2 7 1 3\\n5", "None"),
        ("Range Sum of BST", "range-sum-of-bst", "Easy", ["bst", "recursion"], "Return the sum of values of all nodes with a value in the inclusive range [low, high].", "10 5 15 3 7 null 18\\n7\\n15", "32", "10 5 15 3 7 13 18 1 null 6\\n6\\n10", "23"),
        ("Convert Sorted Array to BST", "convert-sorted-array-to-bst", "Easy", ["bst", "binary-search"], "Convert a sorted integer array to a height-balanced binary search tree.", "-10 -3 0 5 9", "0 -3 9 -10 null 5", "1 3", "3 1"),
        ("Trim a Binary Search Tree", "trim-a-binary-search-tree", "Medium", ["bst", "recursion"], "Trim the tree so that all its elements lie in [low, high].", "1 0 2\\n1\\n2", "1 null 2", "3 0 4 null 2 null null 1\\n1\\n3", "3 2 null 1"),
        ("BST Iterator", "binary-search-tree-iterator", "Medium", ["bst", "stack"], "Implement an iterator over the in-order traversal of a BST with next() and hasNext().", "next() next() hasNext() next() hasNext()", "3 7 true 9 true", "hasNext()", "true"),
        ("Unique Binary Search Trees", "unique-binary-search-trees", "Medium", ["bst", "dynamic-programming"], "Return the number of structurally unique BSTs which has exactly n nodes (Catalan number).", "3", "5", "1", "1"),
        ("Unique Binary Search Trees II", "unique-binary-search-trees-ii", "Medium", ["bst", "backtracking", "dynamic-programming"], "Generate all structurally unique BSTs stored with keys 1 to n.", "3", "5 trees", "1", "1 tree"),
        ("Two Sum IV - Input is a BST", "two-sum-iv-input-is-a-bst", "Easy", ["bst", "hash-map", "two-pointers"], "Return true if there exist two elements in the BST whose sum equals k.", "5 3 6 2 4 null 7\\n9", "true", "5 3 6 2 4 null 7\\n28", "false"),
        ("Minimum Absolute Difference in BST", "minimum-absolute-difference-in-bst", "Easy", ["bst", "recursion"], "Return the minimum absolute difference between values of any two different nodes.", "4 2 6 1 3", "1", "1 0 48 null null 12 49", "1"),
        ("Recover Binary Search Tree", "recover-binary-search-tree", "Medium", ["bst", "recursion"], "Two nodes in BST were swapped by mistake. Recover the tree without changing structure in O(1) space.", "1 3 null null 2", "3 1 null null 2", "3 1 4 null null 2", "2 1 4 null null 3"),
        ("All Nodes Distance K in Binary Tree", "all-nodes-distance-k-in-binary-tree", "Medium", ["binary-tree", "graph", "queue"], "Return array of the values of all nodes that have a distance k from target node.", "3 5 1 6 2 0 8 null null 7 4\\n5\\n2", "7 4 1", "1\\n1\\n3", ""),

        # Heap / Priority Queue (12)
        ("Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "Easy", ["heap"], "Design a class to find the kth largest element in a stream.", "3 [4 5 8 2] add(3) add(5) add(10) add(9) add(4)", "4 5 5 8 8", "1 [] add(-3)", "-3"),
        ("Last Stone Weight", "last-stone-weight", "Easy", ["heap", "array"], "Smash heaviest stones repeatedly until at most one stone remains.", "2 7 4 1 8 1", "1", "1", "1"),
        ("Find Median from Data Stream", "find-median-from-data-stream", "Hard", ["heap", "sorting"], "Find the median of all numbers added from data stream using max-heap and min-heap.", "addNum(1) addNum(2) findMedian() addNum(3) findMedian()", "1.5 2.0", "addNum(5) findMedian()", "5.0"),
        ("Task Scheduler", "task-scheduler", "Medium", ["heap", "greedy", "hash-map"], "Return least number of intervals CPU will take to finish all given tasks with cooling time n.", "A A A B B B\\n2", "8", "A A A B B B\\n0", "6"),
        ("Furthest Building You Can Reach", "furthest-building-you-can-reach", "Medium", ["heap", "greedy", "binary-search"], "Return furthest building index you can reach using bricks and ladders.", "4 2 7 6 9 14 12\\n5\\n1", "4", "4 12 2 7 3 18 20 3 19\\n10\\n2", "7"),
        ("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", "Medium", ["heap", "binary-search"], "Find kth smallest element in n x n matrix where each row and column is sorted.", "1 5 9\\n10 11 13\\n12 13 15\\n8", "13", "-5\\n1", "-5"),
        ("Minimum Cost to Connect Sticks", "minimum-cost-to-connect-sticks", "Medium", ["heap", "greedy"], "Connect sticks with minimum cost repeatedly connecting the two shortest sticks.", "2 4 3", "14", "1 8 3 5", "30"),
        ("Single-Threaded CPU", "single-threaded-cpu", "Medium", ["heap", "sorting"], "Simulate single-threaded CPU processing tasks ordered by available time and duration.", "1 2\\n2 4\\n3 2\\n4 1", "0 2 3 1", "7 10\\n7 12\\n7 5\\n7 4\\n7 2", "4 3 2 0 1"),
        ("Find K Closest Elements", "find-k-closest-elements", "Medium", ["heap", "two-pointers", "binary-search"], "Find k closest integers to x in sorted array.", "1 2 3 4 5\\n4\\n3", "1 2 3 4", "1 2 3 4 5\\n4\\n-1", "1 2 3 4"),
        ("Maximum Performance of a Team", "maximum-performance-of-a-team", "Hard", ["heap", "greedy", "sorting"], "Return maximum performance of at most k engineers modulo 10^9 + 7.", "6\\n2 10 3 1 5 8\\n5 4 3 9 7 2\\n2", "60", "6\\n2 10 3 1 5 8\\n5 4 3 9 7 2\\n3", "68"),
        ("Car Pooling", "car-pooling", "Medium", ["heap", "prefix-sum", "sorting"], "Return true if it is possible to pick up and drop off all passengers without exceeding capacity.", "2 1 5\\n3 3 7\\n4", "false", "2 1 5\\n3 3 7\\n5", "true"),
        ("Reduce Array Size to The Half", "reduce-array-size-to-the-half", "Medium", ["heap", "greedy", "hash-map"], "Return minimum size of set of integers to remove so that at least half the integers are removed.", "3 3 3 3 5 5 5 2 2 7", "2", "7 7 7 7 7 7", "1"),

        # Graphs (25)
        ("Number of Islands", "number-of-islands", "Medium", ["graph", "queue"], "Count the number of islands ('1's surrounded by '0's) using BFS/DFS.", "1 1 1 1 0\\n1 1 0 1 0\\n1 1 0 0 0\\n0 0 0 0 0", "1", "1 1 0 0 0\\n1 1 0 0 0\\n0 0 1 0 0\\n0 0 0 1 1", "3"),
        ("Max Area of Island", "max-area-of-island", "Medium", ["graph"], "Return maximum area of an island in a binary grid.", "0 0 1 0 0\\n1 1 1 0 0\\n0 1 0 0 1", "4", "0 0 0 0", "0"),
        ("Clone Graph", "clone-graph", "Medium", ["graph", "hash-map"], "Return a deep copy of a connected undirected graph.", "1 2 4\\n2 1 3\\n3 2 4\\n4 1 3", "Cloned Graph matches", "1", "1"),
        ("Course Schedule", "course-schedule", "Medium", ["graph", "topological-sort"], "Detect cycle in directed graph using Kahn's algorithm or DFS coloring.", "2\\n1 0", "true", "2\\n1 0\\n0 1", "false"),
        ("Course Schedule II", "course-schedule-ii", "Medium", ["graph", "topological-sort"], "Return valid topological ordering of courses to finish all courses.", "2\\n1 0", "0 1", "4\\n1 0\\n2 0\\n3 1\\n3 2", "0 1 2 3"),
        ("Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium", ["graph"], "Find all coordinates where water can flow to both Pacific and Atlantic oceans.", "1 2 2 3 5\\n3 2 3 4 4\\n2 4 5 3 1\\n6 7 1 4 5\\n5 1 1 2 4", "0 4\\n1 3\\n1 4\\n2 2\\n3 0\\n3 1\\n4 0", "1", "0 0"),
        ("Surrounded Regions", "surrounded-regions", "Medium", ["graph"], "Capture all regions surrounded by 'X' by turning all surrounded 'O's into 'X's.", "X X X X\\nX O O X\\nX X O X\\nX O X X", "X X X X\\nX X X X\\nX X X X\\nX O X X", "X", "X"),
        ("Rotting Oranges", "rotting-oranges", "Medium", ["graph", "queue"], "Return minimum minutes until no fresh orange remains using multi-source BFS.", "2 1 1\\n1 1 0\\n0 1 1", "4", "2 1 1\\n0 1 1\\n1 0 1", "-1"),
        ("Walls and Gates", "walls-and-gates", "Medium", ["graph", "queue"], "Fill each empty room with distance to its nearest gate in 2D grid.", "INF -1 0 INF\\nINF INF INF -1\\nINF -1 INF -1\\n0 -1 INF INF", "3 -1 0 1\\n2 2 1 -1\\n1 -1 2 -1\\n0 -1 3 4", "0", "0"),
        ("Word Ladder", "word-ladder", "Hard", ["graph", "queue", "hash-map"], "Find length of shortest transformation sequence from beginWord to endWord in dictionary.", "hit\\ncog\\nhot dot dog lot log cog", "5", "hit\\ncog\\nhot dot dog lot log", "0"),
        ("Graph Valid Tree", "graph-valid-tree", "Medium", ["graph"], "Check if undirected graph edges form a valid tree (no cycles and connected).", "5\\n0 1\\n0 2\\n0 3\\n1 4", "true", "5\\n0 1\\n1 2\\n2 3\\n1 3\\n1 4", "false"),
        ("Number of Connected Components", "number-of-connected-components", "Medium", ["graph"], "Find number of connected components in an undirected graph using Union-Find.", "5\\n0 1\\n1 2\\n3 4", "2", "5\\n0 1\\n1 2\\n2 3\\n3 4", "1"),
        ("Network Delay Time", "network-delay-time", "Medium", ["graph", "heap"], "Compute minimum time for all n nodes to receive signal using Dijkstra's algorithm.", "2 1 1\\n2 3 1\\n3 4 1\\n4\\n2", "2", "1 2 1\\n2\\n1", "1"),
        ("Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium", ["graph", "dynamic-programming", "heap"], "Find cheapest price from src to dst with at most k stops using Bellman-Ford / Dijkstra.", "4\\n0 1 100\\n1 2 100\\n2 0 100\\n1 3 600\\n2 3 200\\n0\\n3\\n1", "700", "3\\n0 1 100\\n1 2 100\\n0 2 500\\n0\\n2\\n1", "200"),
        ("Is Graph Bipartite?", "is-graph-bipartite", "Medium", ["graph", "queue"], "Determine whether an undirected graph is bipartite using 2-coloring BFS/DFS.", "1 3\\n0 2\\n1 3\\n0 2", "true", "1 2 3\\n0 2\\n0 1 3\\n0 2", "false"),
        ("Redundant Connection", "redundant-connection", "Medium", ["graph"], "Find edge that can be removed so that the resulting graph is a tree of n nodes.", "1 2\\n1 3\\n2 3", "2 3", "1 2\\n2 3\\n3 4\\n1 4\\n1 5", "1 4"),
        ("Critical Connections in a Network", "critical-connections-in-a-network", "Hard", ["graph"], "Find all bridges (critical connections) in network using Tarjan's algorithm.", "4\\n0 1\\n1 2\\n2 0\\n1 3", "1 3", "2\\n0 1", "0 1"),
        ("Shortest Path in Binary Matrix", "shortest-path-in-binary-matrix", "Medium", ["graph", "queue"], "Return length of shortest clear 8-direction path from top-left to bottom-right.", "0 1\\n1 0", "2", "0 0 0\\n1 1 0\\n1 1 0", "4"),
        ("Accounts Merge", "accounts-merge", "Medium", ["graph", "hash-map"], "Merge duplicate email accounts using Disjoint Set Union (Union-Find).", "John johnsmith@mail.com john_newyork@mail.com\\nJohn johnsmith@mail.com john00@mail.com", "John john00@mail.com john_newyork@mail.com johnsmith@mail.com", "Mary mary@mail.com", "Mary mary@mail.com"),
        ("Find Eventual Safe States", "find-eventual-safe-states", "Medium", ["graph", "topological-sort"], "Return all safe nodes in directed graph that only lead to terminal nodes.", "1 2\\n2 3\\n5\\n0\\n5\\n\\n", "2 4 5 6", "1 2 3 4\\n1 2\\n3 4\\n0 4\\n", "4"),
        ("As Far from Land as Possible", "as-far-from-land-as-possible", "Medium", ["graph", "queue"], "Find a water cell such that distance to nearest land cell is maximized.", "1 0 1\\n0 0 0\\n1 0 1", "2", "1 0 0\\n0 0 0\\n0 0 0", "4"),
        ("Path with Minimum Effort", "path-with-minimum-effort", "Medium", ["graph", "heap", "binary-search"], "Find minimum effort required to travel from top-left to bottom-right cell.", "1 2 2\\n3 8 2\\n5 3 5", "2", "1 2 3\\n3 8 4\\n5 3 5", "1"),
        ("Reconstruct Itinerary", "reconstruct-itinerary", "Hard", ["graph", "greedy"], "Find Eulerian path starting at 'JFK' using Hierholzer's algorithm.", "MUC LHR\\nJFK MUC\\nSFO SJC\\nLHR SFO", "JFK MUC LHR SFO SJC", "JFK SFO\\nJFK ATL\\nSFO ATL\\nATL JFK\\nATL SFO", "JFK ATL JFK SFO ATL SFO"),
        ("Snakes and Ladders", "snakes-and-ladders", "Medium", ["graph", "queue"], "Find least number of dice rolls to reach square n^2 on Snakes and Ladders board.", "-1 -1 -1 -1 -1 -1\\n-1 -1 -1 -1 -1 -1\\n-1 -1 -1 -1 -1 -1\\n-1 35 -1 -1 13 -1\\n-1 -1 -1 -1 -1 -1\\n-1 15 -1 -1 -1 -1", "4", "-1 -1\\n-1 3", "1"),
        ("Minimum Height Trees", "minimum-height-trees", "Medium", ["graph", "topological-sort"], "Find all root nodes of minimum height trees by repeatedly pruning leaf nodes.", "4\\n1 0\\n1 2\\n1 3", "1", "6\\n3 0\\n3 1\\n3 2\\n3 4\\n5 4", "3 4"),

        # Greedy (15)
        ("Partition Labels", "partition-labels", "Medium", ["greedy", "two-pointers", "string"], "Partition string into as many parts as possible so that each letter appears in at most one part.", "ababcbacadefegdehijhklij", "9 7 8", "eccbbbbdec", "10"),
        ("Valid Parenthesis String", "valid-parenthesis-string", "Medium", ["greedy", "string", "dynamic-programming"], "Check if string with '(', ')' and '*' (wildcard) can be valid.", "()", "true", "(*)", "true"),
        ("Assign Cookies", "assign-cookies", "Easy", ["greedy", "sorting", "two-pointers"], "Maximize number of content children given greed factors and cookie sizes.", "1 2 3\\n1 1", "1", "1 2\\n1 2 3", "2"),
        ("Lemonade Change", "lemonade-change", "Easy", ["greedy"], "Determine if you can provide correct change to every customer with $5, $10, and $20 bills.", "5 5 5 10 20", "true", "5 5 10 10 20", "false"),
        ("Minimum Number of Arrows to Burst Balloons", "minimum-number-of-arrows-to-burst-balloons", "Medium", ["greedy", "sorting", "array"], "Find minimum number of arrows to burst all balloons given intervals.", "10 16\\n2 8\\n1 6\\n7 12", "2", "1 2\\n3 4\\n5 6\\n7 8", "4"),
        ("Queue Reconstruction by Height", "queue-reconstruction-by-height", "Medium", ["greedy", "sorting", "array"], "Reconstruct queue of people with height h and k people in front >= h.", "7 0\\n4 4\\n7 1\\n5 0\\n6 1\\n5 2", "5 0\\n7 0\\n5 2\\n6 1\\n4 4\\n7 1", "6 0\\n5 0\\n4 0\\n3 2\\n2 2\\n1 4", "4 0\\n5 0\\n2 2\\n3 2\\n1 4\\n6 0"),
        ("Candy", "candy", "Hard", ["greedy", "array"], "Return minimum candies needed to distribute to children satisfying higher rating getting more candy.", "1 0 2", "5", "1 2 2", "4"),
        ("Minimum Deletions to Make Character Frequencies Unique", "minimum-deletions-to-make-character-frequencies-unique", "Medium", ["greedy", "hash-map", "string"], "Return minimum deletions so that no two characters have the same frequency.", "aab", "0", "aaabbbcc", "2"),
        ("Monotone Increasing Digits", "monotone-increasing-digits", "Medium", ["greedy", "math"], "Find largest number <= n whose digits are in monotone increasing order.", "10", "9", "1234", "1234"),
        ("Broken Calculator", "broken-calculator", "Medium", ["greedy", "math"], "Return minimum operations to transform startValue to target with operations: multiply by 2 or decrement by 1.", "2\\n3", "2", "5\\n8", "2"),
        ("Hand of Straights", "hand-of-straights", "Medium", ["greedy", "hash-map", "sorting"], "Check if hand of cards can be rearranged into groups of size groupSize with consecutive values.", "1 2 3 6 2 3 4 7 8\\n3", "true", "1 2 3 4 5\\n4", "false"),
        ("Two City Scheduling", "two-city-scheduling", "Medium", ["greedy", "sorting"], "Return minimum cost to fly 2n people such that exactly n arrive in each city.", "10 20\\n30 200\\n400 50\\n30 20", "110", "259 770\\n448 54\\n926 667\\n184 139\\n840 118\\n577 469", "1859"),
        ("Maximum Units on a Truck", "maximum-units-on-a-truck", "Easy", ["greedy", "sorting"], "Return maximum total number of units that can be put on the truck with truckSize boxes.", "1 3\\n2 2\\n3 1\\n4", "8", "5 10\\n2 5\\n4 7\\n3 9\\n10", "91"),
        ("Can Place Flowers", "can-place-flowers", "Easy", ["greedy", "array"], "Determine if n new flowers can be planted without violating no-adjacent-flowers rule.", "1 0 0 0 1\\n1", "true", "1 0 0 0 1\\n2", "false"),
        ("Task Scheduler II", "task-scheduler-ii", "Medium", ["greedy", "hash-map"], "Return minimum days to complete tasks in order with space constraint.", "1 2 1 2 3 1\\n3", "9", "5 8 8 5\\n2", "6"),

        # Backtracking (15)
        ("Subsets", "subsets", "Medium", ["backtracking", "array"], "Return all possible subsets (the power set) of unique integers in nums.", "1 2 3", "[]\\n[1]\\n[2]\\n[3]\\n[1,2]\\n[1,3]\\n[2,3]\\n[1,2,3]", "0", "[]\\n[0]"),
        ("Subsets II", "subsets-ii", "Medium", ["backtracking", "array"], "Return all possible subsets of array that may contain duplicates without duplicate subsets.", "1 2 2", "[]\\n[1]\\n[2]\\n[1,2]\\n[2,2]\\n[1,2,2]", "0", "[]\\n[0]"),
        ("Permutations", "permutations", "Medium", ["backtracking", "array"], "Return all possible permutations of an array of distinct integers.", "1 2 3", "[1,2,3]\\n[1,3,2]\\n[2,1,3]\\n[2,3,1]\\n[3,1,2]\\n[3,2,1]", "0 1", "[0,1]\\n[1,0]"),
        ("Permutations II", "permutations-ii", "Medium", ["backtracking", "array"], "Return all unique permutations of a collection of numbers that might contain duplicates.", "1 1 2", "[1,1,2]\\n[1,2,1]\\n[2,1,1]", "1 2 3", "6 unique permutations"),
        ("Combinations", "combinations", "Medium", ["backtracking"], "Return all possible combinations of k numbers chosen from range 1 to n.", "4\\n2", "[1,2]\\n[1,3]\\n[1,4]\\n[2,3]\\n[2,4]\\n[3,4]", "1\\n1", "[1]"),
        ("Combination Sum", "combination-sum", "Medium", ["backtracking", "array"], "Find all unique combinations of candidates that sum to target (candidates can be used unlimited times).", "2 3 6 7\\n7", "[2,2,3]\\n[7]", "2 3 5\\n8", "[2,2,2,2]\\n[2,3,3]\\n[3,5]"),
        ("Combination Sum II", "combination-sum-ii", "Medium", ["backtracking", "array"], "Find all unique combinations where each candidate number may only be used once.", "10 1 2 7 6 1 5\\n8", "[1,1,6]\\n[1,2,5]\\n[1,7]\\n[2,6]", "2 5 2 1 2\\n5", "[1,2,2]\\n[5]"),
        ("Combination Sum III", "combination-sum-iii", "Medium", ["backtracking"], "Find all valid combinations of k numbers that sum to n using only numbers from 1 to 9.", "3\\n7", "[1,2,4]", "3\\n9", "[1,2,6]\\n[1,3,5]\\n[2,3,4]"),
        ("Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "Medium", ["backtracking", "string"], "Return all possible letter combinations that the number digits could represent on keypad.", "23", "ad ae af bd be bf cd ce cf", "", "None"),
        ("Palindrome Partitioning", "palindrome-partitioning", "Medium", ["backtracking", "dynamic-programming", "string"], "Partition string s such that every substring of the partition is a palindrome.", "aab", "a a b\\naa b", "a", "a"),
        ("Word Search", "word-search", "Medium", ["backtracking", "array"], "Check if word exists in grid of characters following horizontally or vertically adjacent cells.", "A B C E\\nS F C S\\nA D E E\\nABCCED", "true", "A B C E\\nS F C S\\nA D E E\\nSEE", "true"),
        ("N-Queens", "n-queens", "Hard", ["backtracking"], "Place n queens on an n x n chessboard such that no two queens attack each other.", "4", ".Q..\\n...Q\\nQ...\\n..Q.", "1", "Q"),
        ("N-Queens II", "n-queens-ii", "Hard", ["backtracking"], "Return the total number of distinct solutions to the n-queens puzzle.", "4", "2", "1", "1"),
        ("Sudoku Solver", "sudoku-solver", "Hard", ["backtracking", "array"], "Solve a Sudoku puzzle by filling the empty cells in-place.", "5 3 . . 7 . . . .\\n6 . . 1 9 5 . . .", "Solved 9x9 board", ". . .\\n. . .", "Solved"),
        ("Generate Parentheses", "generate-parentheses", "Medium", ["backtracking", "string"], "Generate all combinations of well-formed parentheses given n pairs.", "3", "((()))\\n(()())\\n(())()\\n()(())\\n()()()", "1", "()"),

        # Dynamic Programming (25)
        ("Climbing Stairs", "climbing-stairs", "Easy", ["dynamic-programming", "recursion"], "How many distinct ways can you climb n stairs taking 1 or 2 steps each time?", "2", "2", "3", "3"),
        ("Min Cost Climbing Stairs", "min-cost-climbing-stairs", "Easy", ["dynamic-programming", "array"], "Find minimum cost to reach the top of the floor starting from step index 0 or 1.", "10 15 20", "15", "1 100 1 1 1 100 1 1 100 1", "6"),
        ("House Robber", "house-robber", "Medium", ["dynamic-programming", "array"], "Determine maximum money you can rob tonight without alerting police (cannot rob adjacent houses).", "1 2 3 1", "4", "2 7 9 3 1", "12"),
        ("House Robber II", "house-robber-ii", "Medium", ["dynamic-programming", "array"], "Houses are arranged in a circle. Return max money you can rob without robbing adjacent houses.", "2 3 2", "3", "1 2 3 1", "4"),
        ("Decode Ways", "decode-ways", "Medium", ["dynamic-programming", "string"], "Given string containing only digits, return number of ways to decode it to letters ('1'->'A'...'26'->'Z').", "12", "2", "226", "3"),
        ("Coin Change", "coin-change", "Medium", ["dynamic-programming", "array"], "Return fewest number of coins needed to make up amount. If not possible, return -1.", "1 2 5\\n11", "3", "2\\n3", "-1"),
        ("Coin Change II", "coin-change-ii", "Medium", ["dynamic-programming", "array"], "Return number of combinations that make up amount with given coin denominations.", "1 2 5\\n5", "4", "2\\n3", "0"),
        ("Maximum Product Subarray", "maximum-product-subarray", "Medium", ["dynamic-programming", "array"], "Find contiguous subarray with largest product within an integer array.", "2 3 -2 4", "6", "-2 0 -1", "0"),
        ("Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium", ["dynamic-programming", "binary-search"], "Find length of longest strictly increasing subsequence in O(n log n).", "10 9 2 5 3 7 101 18", "4", "0 1 0 3 2 3", "4"),
        ("Partition Equal Subset Sum", "partition-equal-subset-sum", "Medium", ["dynamic-programming", "array"], "Determine if array can be partitioned into two subsets with equal sum (0/1 Knapsack).", "1 5 11 5", "true", "1 2 3 5", "false"),
        ("Unique Paths", "unique-paths", "Medium", ["dynamic-programming", "math"], "Find number of possible unique paths for robot on m x n grid to reach bottom-right from top-left.", "3\\n7", "28", "3\\n2", "3"),
        ("Unique Paths II", "unique-paths-ii", "Medium", ["dynamic-programming", "array"], "Find number of unique paths on grid with obstacles ('1' represents obstacle).", "0 0 0\\n0 1 0\\n0 0 0", "2", "0 1\\n0 0", "1"),
        ("Minimum Path Sum", "minimum-path-sum", "Medium", ["dynamic-programming", "array"], "Find path from top left to bottom right which minimizes sum of all numbers along its path.", "1 3 1\\n1 5 1\\n4 2 1", "7", "1 2 3\\n4 5 6", "12"),
        ("Longest Common Subsequence", "longest-common-subsequence", "Medium", ["dynamic-programming", "string"], "Return length of longest common subsequence between text1 and text2.", "abcde\\nace", "3", "abc\\nabc", "3"),
        ("Edit Distance", "edit-distance", "Medium", ["dynamic-programming", "string"], "Return minimum operations (insert, delete, replace) required to convert word1 to word2.", "horse\\nros", "3", "intention\\nexecution", "5"),
        ("Target Sum", "target-sum", "Medium", ["dynamic-programming", "backtracking"], "Assign '+' or '-' signs to nums to build expression evaluating to target. Return ways.", "1 1 1 1 1\\n3", "5", "1\\n1", "1"),
        ("Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "Medium", ["dynamic-programming", "array"], "Maximize profit trading stocks with 1-day cooldown after selling.", "1 2 3 0 2", "3", "1", "0"),
        ("Best Time to Buy and Sell Stock with Transaction Fee", "best-time-to-buy-and-sell-stock-with-transaction-fee", "Medium", ["dynamic-programming", "greedy"], "Maximize profit trading stocks with transaction fee for every trade.", "1 3 2 8 4 9\\n2", "8", "1 3 7 5 10 3\\n3", "6"),
        ("Russian Doll Envelopes", "russian-doll-envelopes", "Hard", ["dynamic-programming", "binary-search", "sorting"], "Return maximum number of envelopes you can Russian doll (put one inside another).", "5 4\\n6 4\\n6 7\\n2 3", "3", "1 1\\n1 1", "1"),
        ("Maximal Square", "maximal-square", "Medium", ["dynamic-programming", "array"], "Find largest square containing only 1s in a 2D binary matrix and return its area.", "1 0 1 0 0\\n1 0 1 1 1\\n1 1 1 1 1\\n1 0 0 1 0", "4", "0 1\\n1 0", "1"),
        ("Burst Balloons", "burst-balloons", "Hard", ["dynamic-programming", "array"], "Burst balloons to maximize coins collected using interval DP.", "3 1 5 8", "167", "1 5", "10"),
        ("Interleaving String", "interleaving-string", "Medium", ["dynamic-programming", "string"], "Check if s3 is formed by an interleaving of s1 and s2.", "aabcc\\ndbbca\\naadbbcbcac", "true", "aabcc\\ndbbca\\naadbbbaccc", "false"),
        ("Distinct Subsequences", "distinct-subsequences", "Hard", ["dynamic-programming", "string"], "Return number of distinct subsequences of s which equals t.", "rabbbit\\nrabbit", "3", "babgbag\\nbag", "5"),
        ("Triangle", "triangle", "Medium", ["dynamic-programming", "array"], "Return minimum path sum from top to bottom of triangle array.", "2\\n3 4\\n6 5 7\\n4 1 8 3", "11", "-10", "-10"),
        ("Paint House", "paint-house", "Medium", ["dynamic-programming", "array"], "Find minimum cost to paint all houses such that no two adjacent houses have same color.", "17 2 17\\n16 16 5\\n14 3 19", "10", "7 6 2", "2"),

        # Recursion & Math (12)
        ("Pow(x, n)", "powx-n", "Medium", ["recursion"], "Implement pow(x, n), which calculates x raised to the power n in O(log n) time.", "2.00000\\n10", "1024.0", "2.10000\\n3", "9.261"),
        ("Factorial Trailing Zeroes", "factorial-trailing-zeroes", "Medium", ["recursion"], "Given integer n, return number of trailing zeroes in n!.", "3", "0", "5", "1"),
        ("Reverse Integer", "reverse-integer", "Medium", ["recursion"], "Reverse digits of a signed 32-bit integer, returning 0 if overflowing.", "123", "321", "-123", "-321"),
        ("Palindrome Number", "palindrome-number", "Easy", ["recursion"], "Determine whether an integer is a palindrome without converting to string.", "121", "true", "-121", "false"),
        ("Count Primes", "count-primes", "Medium", ["recursion", "array"], "Count number of prime numbers less than a non-negative number n using Sieve of Eratosthenes.", "10", "4", "0", "0"),
        ("Power of Three", "power-of-three", "Easy", ["recursion"], "Determine if an integer is a power of three without using loops.", "27", "true", "0", "false"),
        ("Power of Two", "power-of-two", "Easy", ["recursion"], "Determine if an integer is a power of two using bitwise tricks.", "1", "true", "16", "true"),
        ("Integer to Roman", "integer-to-roman", "Medium", ["recursion", "string"], "Convert an integer in range [1, 3999] to Roman numeral string.", "3", "III", "58", "LVIII"),
        ("Roman to Integer", "roman-to-integer", "Easy", ["recursion", "string", "hash-map"], "Convert Roman numeral string to an integer.", "III", "3", "LVIII", "58"),
        ("Divide Two Integers", "divide-two-integers", "Medium", ["recursion"], "Divide two integers without using multiplication, division, and mod operator.", "10\\n3", "3", "7\\n-3", "-2"),
        ("Add Digits", "add-digits", "Easy", ["recursion"], "Repeatedly add all digits until result has only one digit in O(1) time.", "38", "2", "0", "0"),
        ("Excel Sheet Column Title", "excel-sheet-column-title", "Easy", ["recursion", "string"], "Convert column number to corresponding Excel sheet column title.", "1", "A", "28", "AB"),
    ]

    print(f"Total problems planned: {len(problems_catalog)}")

    created_count = 0
    test_cases_count = 0

    for title, slug, diff, tag_slugs, desc, in1, out1, in2, out2 in problems_catalog:
        xp = 20 if diff == "Easy" else (40 if diff == "Medium" else 80)
        
        prob, created = Problem.objects.update_or_create(
            slug=slug,
            defaults={
                "title": title,
                "difficulty": diff,
                "xp_reward": xp,
                "description_markdown": desc,
                "input_format": "Read inputs from standard input according to problem constraints.",
                "output_format": "Print result to standard output.",
                "constraints": "1 <= N <= 10^5\\nMemory limit: 256MB\\nTime limit: 2.0s",
                "examples": [
                    {"input": in1.replace("\\n", "\n"), "output": out1.replace("\\n", "\n"), "explanation": f"Example 1 test for {title}"},
                    {"input": in2.replace("\\n", "\n"), "output": out2.replace("\\n", "\n"), "explanation": f"Example 2 test for {title}"},
                ],
                "time_limit_ms": 2000,
                "memory_limit_mb": 256,
                "starter_templates": {
                    "python": get_python_starter(title, slug),
                    "javascript": get_js_starter(title, slug),
                    "cpp": get_cpp_starter(title, slug),
                },
                "is_published": True,
            }
        )

        # Set tags
        tags_to_set = [tag_map[ts] for ts in tag_slugs if ts in tag_map]
        prob.tags.set(tags_to_set)

        # Create public test cases
        ProblemTestCase.objects.filter(problem=prob).delete()
        
        tc1 = ProblemTestCase.objects.create(
            problem=prob,
            input_data=in1.replace("\\n", "\n"),
            expected_output=out1.replace("\\n", "\n"),
            is_hidden=False,
            display_order=1
        )
        tc2 = ProblemTestCase.objects.create(
            problem=prob,
            input_data=in2.replace("\\n", "\n"),
            expected_output=out2.replace("\\n", "\n"),
            is_hidden=False,
            display_order=2
        )
        # Create 2 hidden test cases
        tc3 = ProblemTestCase.objects.create(
            problem=prob,
            input_data=in1.replace("\\n", "\n"),
            expected_output=out1.replace("\\n", "\n"),
            is_hidden=True,
            display_order=3
        )
        tc4 = ProblemTestCase.objects.create(
            problem=prob,
            input_data=in2.replace("\\n", "\n"),
            expected_output=out2.replace("\\n", "\n"),
            is_hidden=True,
            display_order=4
        )
        test_cases_count += 4
        created_count += 1

    print(f"Successfully seeded {created_count} problems and {test_cases_count} test cases into the database!")

if __name__ == '__main__':
    run()
