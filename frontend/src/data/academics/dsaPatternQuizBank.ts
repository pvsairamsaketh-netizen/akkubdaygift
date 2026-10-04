// Authentic Pattern Recognition Questions Bank (120+ MNC Questions)
// Verified FAANG Interview Scenarios with Pattern Explanations

export interface PatternQuizQuestion {
  id: string;
  problem: string;
  options: string[];
  correct: string;
  explanation: string;
  companyTag: string;
  topic: string;
}

export const AUTHENTIC_PATTERN_QUIZ_BANK: PatternQuizQuestion[] = [
  {
    "id": "pq-auth-1",
    "problem": "Given a 1-indexed sorted array of integers, find two numbers such that they add up to a specific target number.",
    "options": [
      "Two Pointers",
      "Sliding Window",
      "Monotonic Stack",
      "Dynamic Programming"
    ],
    "correct": "Two Pointers",
    "explanation": "The array is already sorted, and we need a pair summing to target. By maintaining left at start and right at end, we adjust pointers in O(n) time and O(1) space.",
    "companyTag": "Amazon",
    "topic": "Arrays & Two Pointers"
  },
  {
    "id": "pq-auth-2",
    "problem": "Given an array of n integers, find all unique triplets in the array which gives the sum of zero.",
    "options": [
      "Two Pointers",
      "Divide and Conquer",
      "Segment Tree",
      "Breadth-First Search"
    ],
    "correct": "Two Pointers",
    "explanation": "Sorting the array in O(n log n) allows fixing one element and using Two Pointers for the remaining two elements in O(n), avoiding cubic O(n\u00b3) brute force.",
    "companyTag": "Meta",
    "topic": "Arrays & Two Pointers"
  },
  {
    "id": "pq-auth-3",
    "problem": "Given an array of heights, choose two lines that together with the x-axis form a container containing the most water.",
    "options": [
      "Two Pointers",
      "Monotonic Queue",
      "Binary Search on Answer",
      "Depth-First Search"
    ],
    "correct": "Two Pointers",
    "explanation": "Start with widest container (left=0, right=n-1). The area is constrained by the shorter line, so greedily move the shorter line inward.",
    "companyTag": "Google",
    "topic": "Arrays & Two Pointers"
  },
  {
    "id": "pq-auth-4",
    "problem": "Given an array with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.",
    "options": [
      "Two Pointers",
      "Merge Sort",
      "Bitmask DP",
      "Topological Sort"
    ],
    "correct": "Two Pointers",
    "explanation": "Dutch National Flag algorithm uses three pointers (low, mid, high) to partition array into three sections in a single O(n) pass with O(1) space.",
    "companyTag": "Microsoft",
    "topic": "Arrays & Sorting"
  },
  {
    "id": "pq-auth-5",
    "problem": "Given the head of a singly linked list, determine if the linked list has a cycle in it without extra memory.",
    "options": [
      "Two Pointers",
      "Hash Table",
      "Backtracking",
      "Breadth-First Search"
    ],
    "correct": "Two Pointers",
    "explanation": "Floyd's Cycle Finding algorithm uses fast and slow pointers. If there is a cycle, the fast pointer will eventually lap the slow pointer in O(n) time and O(1) space.",
    "companyTag": "Apple",
    "topic": "Linked Lists"
  },
  {
    "id": "pq-auth-6",
    "problem": "Given the head of a linked list, return the node where the cycle begins, using O(1) memory.",
    "options": [
      "Two Pointers",
      "Dynamic Programming",
      "Dijkstra's Algorithm",
      "Monotonic Stack"
    ],
    "correct": "Two Pointers",
    "explanation": "After fast and slow pointers meet, reset one pointer to head. Moving both at speed 1 causes them to intersect exactly at the cycle entrance.",
    "companyTag": "Microsoft",
    "topic": "Linked Lists"
  },
  {
    "id": "pq-auth-7",
    "problem": "Given head of a singly linked list, return true if it is a palindrome with O(1) auxiliary space.",
    "options": [
      "Two Pointers",
      "Segment Tree",
      "Topological Sort",
      "Trie"
    ],
    "correct": "Two Pointers",
    "explanation": "Use fast/slow pointers to find the middle, reverse the second half in-place, and compare both halves using two pointers.",
    "companyTag": "Amazon",
    "topic": "Linked Lists"
  },
  {
    "id": "pq-auth-8",
    "problem": "Given an array of integers nums and an integer val, remove all occurrences of val in-place and return the new length.",
    "options": [
      "Two Pointers",
      "Breadth-First Search",
      "Sliding Window",
      "Fenwick Tree"
    ],
    "correct": "Two Pointers",
    "explanation": "Maintain a slow pointer for valid placement and a fast pointer scanning through all elements in O(n) time.",
    "companyTag": "Bloomberg",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-9",
    "problem": "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    "options": [
      "Two Pointers",
      "QuickSort",
      "Monotonic Stack",
      "Kadane's Algorithm"
    ],
    "correct": "Two Pointers",
    "explanation": "Largest squared values must come from either extreme negative or extreme positive ends. Two pointers at ends fill the result array from back to front in O(n).",
    "companyTag": "Meta",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-10",
    "problem": "Trapping Rain Water: Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    "options": [
      "Two Pointers",
      "Breadth-First Search",
      "Floyd-Warshall",
      "Trie"
    ],
    "correct": "Two Pointers",
    "explanation": "Two pointers from ends tracking left_max and right_max resolve trapped water in O(n) time and O(1) auxiliary memory.",
    "companyTag": "Google",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-11",
    "problem": "Given an array of positive integers and a positive integer target, return the minimal length of a contiguous subarray whose sum >= target.",
    "options": [
      "Sliding Window",
      "Monotonic Stack",
      "Dynamic Programming",
      "Divide and Conquer"
    ],
    "correct": "Sliding Window",
    "explanation": "All numbers are positive, so expanding right monotonically increases the sum, and shrinking left monotonically decreases it.",
    "companyTag": "Google",
    "topic": "Arrays & Sliding Window"
  },
  {
    "id": "pq-auth-12",
    "problem": "Given a string s, find the length of the longest substring without repeating characters.",
    "options": [
      "Sliding Window",
      "Binary Search",
      "Depth-First Search",
      "Topological Sort"
    ],
    "correct": "Sliding Window",
    "explanation": "Maintain a dynamic window [L, R] and a hash set / map of character positions. When duplicate found, contract L past the duplicate.",
    "companyTag": "Amazon",
    "topic": "Strings & Sliding Window"
  },
  {
    "id": "pq-auth-13",
    "problem": "Given two strings s and t, return the minimum window substring of s such that every character in t is included.",
    "options": [
      "Sliding Window",
      "Two Pointers",
      "Monotonic Queue",
      "Prefix Sum"
    ],
    "correct": "Sliding Window",
    "explanation": "Expand right pointer until all required character counts from t are met; then contract left pointer to minimize window length.",
    "companyTag": "Meta",
    "topic": "Strings & Sliding Window"
  },
  {
    "id": "pq-auth-14",
    "problem": "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.",
    "options": [
      "Sliding Window",
      "Bitmask DP",
      "Union-Find",
      "Kadane's Algorithm"
    ],
    "correct": "Sliding Window",
    "explanation": "Rephrase: find the longest contiguous subarray with at most k zeros. Expand right; contract left whenever zeros count exceeds k.",
    "companyTag": "Google",
    "topic": "Arrays & Sliding Window"
  },
  {
    "id": "pq-auth-15",
    "problem": "You are given an array of characters fruits where fruits[i] is the type of fruit. Pick at most 2 types of fruits in a contiguous sequence.",
    "options": [
      "Sliding Window",
      "Heap",
      "Monotonic Stack",
      "Breadth-First Search"
    ],
    "correct": "Sliding Window",
    "explanation": "Find the longest contiguous subarray containing at most 2 distinct integers. Sliding window with frequency map achieves O(n).",
    "companyTag": "Uber",
    "topic": "Arrays & Sliding Window"
  },
  {
    "id": "pq-auth-16",
    "problem": "Given a string s and an integer k, return the length of the longest substring of s that contains at most k distinct characters.",
    "options": [
      "Sliding Window",
      "Trie",
      "Binary Search on Answer",
      "Segment Tree"
    ],
    "correct": "Sliding Window",
    "explanation": "Expand right adding characters to frequency map; shrink left when map size > k. Dynamic window ensures O(n) linear scan.",
    "companyTag": "Microsoft",
    "topic": "Strings"
  },
  {
    "id": "pq-auth-17",
    "problem": "Find the maximum sum of any contiguous subarray of fixed size K.",
    "options": [
      "Sliding Window",
      "Dynamic Programming",
      "Monotonic Stack",
      "QuickSelect"
    ],
    "correct": "Sliding Window",
    "explanation": "Fixed-size sliding window of length K: compute initial sum of first K elements, then slide by adding arr[i] and subtracting arr[i-K] in O(1).",
    "companyTag": "Amazon",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-18",
    "problem": "Given a string s, return the maximum number of vowels in any substring of s with length k.",
    "options": [
      "Sliding Window",
      "Topological Sort",
      "Two Pointers",
      "Binary Search"
    ],
    "correct": "Sliding Window",
    "explanation": "Fixed-size window of size k tracking count of vowel characters as window slides from index k to n in O(n).",
    "companyTag": "Apple",
    "topic": "Strings"
  },
  {
    "id": "pq-auth-19",
    "problem": "Given an array of integers nums sorted in ascending order, search target. If target exists, return its index, otherwise return -1 in O(log n).",
    "options": [
      "Binary Search",
      "Two Pointers",
      "Hashing",
      "Linear Scan"
    ],
    "correct": "Binary Search",
    "explanation": "Standard divide and conquer search halving search space at each comparison in O(log n).",
    "companyTag": "Google",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-20",
    "problem": "Search in Rotated Sorted Array: array was rotated at an unknown pivot index. Find target in O(log n) runtime.",
    "options": [
      "Binary Search",
      "Linear Search",
      "Breadth-First Search",
      "Sliding Window"
    ],
    "correct": "Binary Search",
    "explanation": "At least one half [low, mid] or [mid, high] is always sorted. Check if target lies within the sorted half to discard the other half.",
    "companyTag": "Amazon",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-21",
    "problem": "Find Minimum in Rotated Sorted Array: find the minimum element in an array that was rotated between 1 and n times.",
    "options": [
      "Binary Search",
      "Two Pointers",
      "Monotonic Stack",
      "Merge Sort"
    ],
    "correct": "Binary Search",
    "explanation": "Compare nums[mid] with nums[high]. If nums[mid] > nums[high], inflection point is to the right; else it is at mid or to the left.",
    "companyTag": "Microsoft",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-22",
    "problem": "A peak element is an element strictly greater than its neighbors. Find a peak element index in O(log n) time.",
    "options": [
      "Binary Search",
      "Dynamic Programming",
      "Heap",
      "Sliding Window"
    ],
    "correct": "Binary Search",
    "explanation": "If nums[mid] < nums[mid + 1], a peak is guaranteed to exist on the right side. We binary search the gradient slope in O(log n).",
    "companyTag": "Meta",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-23",
    "problem": "Koko loves to eat bananas. Given pile counts and H hours, find the minimum integer speed K to eat all bananas within H hours.",
    "options": [
      "Binary Search on Answer",
      "Greedy",
      "Monotonic Queue",
      "Topological Sort"
    ],
    "correct": "Binary Search on Answer",
    "explanation": "Speed K is bounded in [1, max(piles)]. The feasibility check function is monotonic: if speed K works, all speeds > K also work.",
    "companyTag": "Google",
    "topic": "Optimization"
  },
  {
    "id": "pq-auth-24",
    "problem": "Capacity To Ship Packages Within D Days: find the least weight capacity of the boat to ship all packages within D days in conveyor order.",
    "options": [
      "Binary Search on Answer",
      "Sliding Window",
      "Dynamic Programming",
      "Dijkstra"
    ],
    "correct": "Binary Search on Answer",
    "explanation": "Capacity ranges from max(weights) to sum(weights). Check if capacity C can ship in <= D days greedily in O(n); binary search the capacity.",
    "companyTag": "Amazon",
    "topic": "Optimization"
  },
  {
    "id": "pq-auth-25",
    "problem": "Split Array Largest Sum: split array into m non-empty continuous subarrays such that the largest sum of any subarray is minimized.",
    "options": [
      "Binary Search on Answer",
      "Monotonic Stack",
      "Trie",
      "Breadth-First Search"
    ],
    "correct": "Binary Search on Answer",
    "explanation": "Same as Book Allocation Problem. The answer space [max(nums), sum(nums)] is monotonic; verify allocation greedily in O(n).",
    "companyTag": "Google",
    "topic": "Optimization"
  },
  {
    "id": "pq-auth-26",
    "problem": "Aggressive Cows / Magnetic Force Between Two Balls: place m balls in baskets to maximize the minimum distance between any two balls.",
    "options": [
      "Binary Search on Answer",
      "Two Pointers",
      "Dynamic Programming",
      "Segment Tree"
    ],
    "correct": "Binary Search on Answer",
    "explanation": "Sort basket positions. Distance ranges from 1 to max_pos - min_pos. Monotonic feasibility test places balls greedily.",
    "companyTag": "Uber",
    "topic": "Optimization"
  },
  {
    "id": "pq-auth-27",
    "problem": "Given an array of daily temperatures, return an array such that answer[i] is the number of days to wait until a warmer temperature.",
    "options": [
      "Monotonic Stack",
      "Sliding Window",
      "Heap",
      "Two Pointers"
    ],
    "correct": "Monotonic Stack",
    "explanation": "For each day, find the next day with greater temperature. A decreasing monotonic stack of indices resolves this in O(n) total operations.",
    "companyTag": "Amazon",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-28",
    "problem": "Next Greater Element II: given a circular integer array, return the next greater number for every element.",
    "options": [
      "Monotonic Stack",
      "Breadth-First Search",
      "Sliding Window",
      "Trie"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Simulate traversing the array twice (length 2n) using modulo indexing i % n while maintaining a monotonic decreasing stack.",
    "companyTag": "Meta",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-29",
    "problem": "Largest Rectangle in Histogram: given an array of integers heights, find the area of the largest rectangle in the histogram.",
    "options": [
      "Monotonic Stack",
      "Dynamic Programming",
      "Divide and Conquer",
      "Binary Search"
    ],
    "correct": "Monotonic Stack",
    "explanation": "For each bar, find the nearest smaller bar to left and right to determine its maximal expansion width. Monotonic increasing stack achieves O(n).",
    "companyTag": "Google",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-30",
    "problem": "132 Pattern: find if there exists i < j < k such that nums[i] < nums[k] < nums[j].",
    "options": [
      "Monotonic Stack",
      "Binary Search on Answer",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Scan from right to left maintaining potential nums[k] candidates in a monotonic stack while tracking maximum valid '2' value.",
    "companyTag": "Microsoft",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-31",
    "problem": "Online Stock Span: design an algorithm that collects daily price quotes and returns the span of that day's price (consecutive days <= price).",
    "options": [
      "Monotonic Stack",
      "Priority Queue",
      "Fenwick Tree",
      "Binary Search Tree"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Monotonic decreasing stack storing (price, span) pairs. Pop all previous prices <= current price and accumulate spans in amortized O(1).",
    "companyTag": "Bloomberg",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-32",
    "problem": "Remove K Digits: given string num representing non-negative integer and integer k, return the smallest possible integer after removing k digits.",
    "options": [
      "Monotonic Stack",
      "Greedy",
      "Two Pointers",
      "Breadth-First Search"
    ],
    "correct": "Monotonic Stack",
    "explanation": "To make number smaller, earlier digits must be smaller. Pop digits from stack if current digit is smaller and removals remaining k > 0.",
    "companyTag": "Google",
    "topic": "Greedy & Stacks"
  },
  {
    "id": "pq-auth-33",
    "problem": "Sliding Window Maximum: given an array nums and sliding window of size k, return the max sliding window.",
    "options": [
      "Monotonic Queue / Deque",
      "Two Pointers",
      "Binary Search",
      "Topological Sort"
    ],
    "correct": "Monotonic Queue / Deque",
    "explanation": "Maintain a monotonically decreasing deque of indices. Front of deque always holds maximum for current window; pop outdated indices from front.",
    "companyTag": "Amazon",
    "topic": "Queues"
  },
  {
    "id": "pq-auth-34",
    "problem": "Shortest Subarray with Sum at Least K: array may contain negative numbers, find length of shortest non-empty subarray with sum >= K.",
    "options": [
      "Monotonic Queue / Deque",
      "Sliding Window",
      "Two Pointers",
      "Kadane's Algorithm"
    ],
    "correct": "Monotonic Queue / Deque",
    "explanation": "Standard sliding window fails with negative numbers. Use prefix sum array with a monotonic increasing deque of prefix sum indices in O(n).",
    "companyTag": "Google",
    "topic": "Queues & Prefix Sum"
  },
  {
    "id": "pq-auth-35",
    "problem": "Binary Tree Level Order Traversal: return the level-by-level values of its nodes from left to right.",
    "options": [
      "Breadth-First Search",
      "Depth-First Search",
      "Monotonic Stack",
      "Dynamic Programming"
    ],
    "correct": "Breadth-First Search",
    "explanation": "Standard BFS using a queue: iterate queue length per level to group node values level-by-level in O(n).",
    "companyTag": "Meta",
    "topic": "Trees & BFS"
  },
  {
    "id": "pq-auth-36",
    "problem": "Word Ladder: return the number of words in the shortest transformation sequence from beginWord to endWord.",
    "options": [
      "Breadth-First Search",
      "Depth-First Search",
      "Dijkstra",
      "Backtracking"
    ],
    "correct": "Breadth-First Search",
    "explanation": "Unweighted shortest path in a graph where words are vertices and single-letter transformations are edges. BFS guarantees minimal path length.",
    "companyTag": "Amazon",
    "topic": "Graphs & BFS"
  },
  {
    "id": "pq-auth-37",
    "problem": "Rotting Oranges: return the minimum number of minutes that must elapse until no cell has a fresh orange in a 2D grid.",
    "options": [
      "Breadth-First Search",
      "Depth-First Search",
      "Union-Find",
      "Dynamic Programming"
    ],
    "correct": "Breadth-First Search",
    "explanation": "Multi-source BFS: enqueue all initially rotten oranges simultaneously at time 0, spreading level-by-level to adjacent fresh oranges.",
    "companyTag": "Amazon",
    "topic": "Matrix & BFS"
  },
  {
    "id": "pq-auth-38",
    "problem": "Shortest Path in Binary Matrix: find the length of the shortest clear path in an n x n binary grid with 8-directional movement.",
    "options": [
      "Breadth-First Search",
      "Depth-First Search",
      "Topological Sort",
      "Bellman-Ford"
    ],
    "correct": "Breadth-First Search",
    "explanation": "Unweighted 2D grid shortest path from (0,0) to (n-1, n-1) is solved optimally by BFS expanding 8 neighbors per step in O(n\u00b2).",
    "companyTag": "Google",
    "topic": "Graphs & BFS"
  },
  {
    "id": "pq-auth-39",
    "problem": "Number of Islands: given an m x n 2D binary grid, return the number of islands surrounded by water.",
    "options": [
      "Depth-First Search",
      "Sliding Window",
      "Monotonic Stack",
      "Trie"
    ],
    "correct": "Depth-First Search",
    "explanation": "Traverse grid; upon seeing '1', trigger DFS/flood-fill to sink all connected land cells into '0', incrementing island count in O(m * n).",
    "companyTag": "Amazon",
    "topic": "Matrix & DFS"
  },
  {
    "id": "pq-auth-40",
    "problem": "Surrounded Regions: capture all regions surrounded by 'X' on an m x n board by flipping all surrounded 'O's into 'X's.",
    "options": [
      "Depth-First Search",
      "Breadth-First Search",
      "Topological Sort",
      "Segment Tree"
    ],
    "correct": "Depth-First Search",
    "explanation": "Any 'O' connected to the boundary cannot be captured. Run boundary DFS from all border 'O's, mark them safe, then flip remaining 'O's.",
    "companyTag": "Google",
    "topic": "Matrix & DFS"
  },
  {
    "id": "pq-auth-41",
    "problem": "Clone Graph: given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
    "options": [
      "Depth-First Search",
      "Dijkstra's Algorithm",
      "Kruskal's Algorithm",
      "Monotonic Queue"
    ],
    "correct": "Depth-First Search",
    "explanation": "DFS traversal with a hash map mapping original node pointers to their cloned replicas to prevent infinite cycles.",
    "companyTag": "Meta",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-42",
    "problem": "Course Schedule: determine if you can finish all courses given prerequisite pairs [a, b].",
    "options": [
      "Topological Sort (Graph)",
      "Two Pointers",
      "Sliding Window",
      "Dynamic Programming"
    ],
    "correct": "Topological Sort (Graph)",
    "explanation": "Courses and prerequisites form a directed graph. Detect if a directed cycle exists using Kahn's algorithm (in-degrees) or DFS 3-coloring.",
    "companyTag": "Amazon",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-43",
    "problem": "Course Schedule II: return the ordering of courses you should take to finish all courses.",
    "options": [
      "Topological Sort (Graph)",
      "Breadth-First Search",
      "Greedy",
      "Binary Search Tree"
    ],
    "correct": "Topological Sort (Graph)",
    "explanation": "Compute in-degrees for all vertices; push vertices with 0 in-degree into a queue; process and record order. If order length < n, cycle exists.",
    "companyTag": "Microsoft",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-44",
    "problem": "Alien Dictionary: given a sorted dictionary of alien words, derive the alphabetical order of letters in the alien language.",
    "options": [
      "Topological Sort (Graph)",
      "Trie",
      "Depth-First Search",
      "Divide and Conquer"
    ],
    "correct": "Topological Sort (Graph)",
    "explanation": "Compare adjacent words to extract directed character precedence edges (u -> v). Topological sort on the character graph gives the alphabet order.",
    "companyTag": "Meta",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-45",
    "problem": "Find Kth Largest Element in an Array: return the kth largest element in the array.",
    "options": [
      "Heap / Priority Queue",
      "Sliding Window",
      "Monotonic Stack",
      "Topological Sort"
    ],
    "correct": "Heap / Priority Queue",
    "explanation": "Maintain a Min-Heap of size K. Push elements; whenever size > K, pop minimum. Top of heap is the kth largest in O(n log k).",
    "companyTag": "Meta",
    "topic": "Heaps"
  },
  {
    "id": "pq-auth-46",
    "problem": "Top K Frequent Elements: return the k most frequent elements in an array.",
    "options": [
      "Heap / Priority Queue",
      "Binary Search",
      "Two Pointers",
      "Breadth-First Search"
    ],
    "correct": "Heap / Priority Queue",
    "explanation": "Count frequencies with HashMap in O(n), then push (freq, num) into a Min-Heap of size K in O(n log k), or use Bucket Sort in O(n).",
    "companyTag": "Amazon",
    "topic": "Heaps & Hashing"
  },
  {
    "id": "pq-auth-47",
    "problem": "Find Median from Data Stream: design a data structure that supports adding numbers and finding the current median in O(1).",
    "options": [
      "Heap / Priority Queue",
      "Binary Search Tree",
      "Segment Tree",
      "Monotonic Stack"
    ],
    "correct": "Heap / Priority Queue",
    "explanation": "Two-Heap pattern: a Max-Heap for the smaller half and a Min-Heap for the larger half. Balances sizes within difference of 1.",
    "companyTag": "Google",
    "topic": "Heaps"
  },
  {
    "id": "pq-auth-48",
    "problem": "Merge k Sorted Lists: merge k sorted linked lists and return it as one sorted list.",
    "options": [
      "Heap / Priority Queue",
      "Breadth-First Search",
      "Sliding Window",
      "Dynamic Programming"
    ],
    "correct": "Heap / Priority Queue",
    "explanation": "Maintain a Min-Heap containing the current head node of each of the k lists. Extract min, attach to result, and push its next in O(N log k).",
    "companyTag": "Microsoft",
    "topic": "Heaps & Lists"
  },
  {
    "id": "pq-auth-49",
    "problem": "Merge Intervals: given an array of intervals, merge all overlapping intervals.",
    "options": [
      "Greedy Interval Scheduling",
      "Dynamic Programming",
      "Trie",
      "Monotonic Stack"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Sort intervals by start time. If current interval start <= previous interval end, merge them (end = max(end1, end2)); else append new.",
    "companyTag": "Meta",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-50",
    "problem": "Non-overlapping Intervals: return the minimum number of intervals to remove to make the rest non-overlapping.",
    "options": [
      "Greedy Interval Scheduling",
      "Binary Search",
      "Sliding Window",
      "Topological Sort"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Interval scheduling: sort by end time. Greedily pick the interval that finishes earliest to leave maximum room for future intervals.",
    "companyTag": "Google",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-51",
    "problem": "Meeting Rooms II: find the minimum number of conference rooms required to schedule all meetings.",
    "options": [
      "Greedy Interval Scheduling",
      "Dynamic Programming",
      "Breadth-First Search",
      "Monotonic Stack"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Separate start times and end times and sort both; or sort intervals by start time and maintain a Min-Heap of meeting end times.",
    "companyTag": "Amazon",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-52",
    "problem": "Climbing Stairs: each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "options": [
      "Dynamic Programming",
      "Two Pointers",
      "Binary Search",
      "Greedy"
    ],
    "correct": "Dynamic Programming",
    "explanation": "Base cases dp[1]=1, dp[2]=2. Overlapping subproblems with recurrence dp[i] = dp[i-1] + dp[i-2], solved in O(n) time and O(1) space.",
    "companyTag": "Google",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-53",
    "problem": "Coin Change: return the fewest number of coins needed to make up that amount, or -1 if impossible.",
    "options": [
      "Dynamic Programming",
      "Greedy",
      "Two Pointers",
      "Sliding Window"
    ],
    "correct": "Dynamic Programming",
    "explanation": "Greedy fails for arbitrary coin denominations. Recurrence: dp[x] = min(dp[x - coin] + 1) for all coins <= x in O(amount * len(coins)).",
    "companyTag": "Amazon",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-54",
    "problem": "Longest Common Subsequence (LCS): find the length of the longest subsequence present in both strings.",
    "options": [
      "Dynamic Programming",
      "Sliding Window",
      "Two Pointers",
      "Trie"
    ],
    "correct": "Dynamic Programming",
    "explanation": "2D DP grid: if s1[i-1] == s2[j-1], dp[i][j] = 1 + dp[i-1][j-1]; else dp[i][j] = max(dp[i-1][j], dp[i][j-1]) in O(m * n).",
    "companyTag": "Microsoft",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-55",
    "problem": "Longest Increasing Subsequence (LIS): find the length of the longest strictly increasing subsequence in an array.",
    "options": [
      "Dynamic Programming",
      "Monotonic Stack",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Dynamic Programming",
    "explanation": "DP with patience sorting: maintain an array tails where tails[i] is the smallest tail of all increasing subsequences of length i+1 in O(n log n).",
    "companyTag": "Google",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-56",
    "problem": "Partition Equal Subset Sum: determine if array can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    "options": [
      "Dynamic Programming",
      "Greedy",
      "Topological Sort",
      "Two Pointers"
    ],
    "correct": "Dynamic Programming",
    "explanation": "Reduced to 0/1 Knapsack: can we find a subset summing to target = sum // 2? 1D rolling boolean DP array in O(n * target).",
    "companyTag": "Meta",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-57",
    "problem": "Subsets: given an integer array of unique elements, return all possible subsets (the power set).",
    "options": [
      "Backtracking",
      "Dynamic Programming",
      "Sliding Window",
      "Monotonic Stack"
    ],
    "correct": "Backtracking",
    "explanation": "Decision tree where at each index we either include or exclude nums[i]. Explores all 2\u207f paths using recursive backtracking.",
    "companyTag": "Meta",
    "topic": "Backtracking"
  },
  {
    "id": "pq-auth-58",
    "problem": "Permutations: return all possible permutations of an array of distinct integers.",
    "options": [
      "Backtracking",
      "Divide and Conquer",
      "Dynamic Programming",
      "Topological Sort"
    ],
    "correct": "Backtracking",
    "explanation": "Backtracking with a visited boolean array or swapping in-place, generating all n! permutations.",
    "companyTag": "Microsoft",
    "topic": "Backtracking"
  },
  {
    "id": "pq-auth-59",
    "problem": "Word Search: given an m x n board of characters and a word, return true if word exists in the grid.",
    "options": [
      "Backtracking",
      "Breadth-First Search",
      "Sliding Window",
      "Dynamic Programming"
    ],
    "correct": "Backtracking",
    "explanation": "DFS with backtracking on 4 neighbors. Mark current cell as visited during exploration, and unmark (backtrack) upon returning.",
    "companyTag": "Amazon",
    "topic": "Backtracking"
  },
  {
    "id": "pq-auth-60",
    "problem": "N-Queens: place n queens on an n x n chessboard such that no two queens attack each other.",
    "options": [
      "Backtracking",
      "Dynamic Programming",
      "Monotonic Queue",
      "Trie"
    ],
    "correct": "Backtracking",
    "explanation": "Row-by-row placement keeping track of occupied columns, positive diagonals (row + col), and negative diagonals (row - col).",
    "companyTag": "Google",
    "topic": "Backtracking"
  },
  {
    "id": "pq-auth-61",
    "problem": "Implement Trie (Prefix Tree) with insert, search, and startsWith methods.",
    "options": [
      "Trie (Prefix Tree)",
      "Hash Table",
      "Binary Search Tree",
      "Heap"
    ],
    "correct": "Trie (Prefix Tree)",
    "explanation": "Tree of character nodes where each node contains children array/map and is_end_of_word flag. Lookups take O(L) where L is word length.",
    "companyTag": "Amazon",
    "topic": "Trie"
  },
  {
    "id": "pq-auth-62",
    "problem": "Design Add and Search Words Data Structure: support adding words and searching words with '.' wildcard character.",
    "options": [
      "Trie (Prefix Tree)",
      "Sliding Window",
      "Monotonic Stack",
      "Segment Tree"
    ],
    "correct": "Trie (Prefix Tree)",
    "explanation": "Trie combined with recursive DFS when encountering '.' wildcard to branch across all 26 non-null children.",
    "companyTag": "Meta",
    "topic": "Trie"
  },
  {
    "id": "pq-auth-63",
    "problem": "Number of Provinces: given an n x n adjacency matrix isConnected, return the total number of connected components.",
    "options": [
      "Disjoint Set Union (Union-Find)",
      "Sliding Window",
      "Monotonic Stack",
      "Segment Tree"
    ],
    "correct": "Disjoint Set Union (Union-Find)",
    "explanation": "Initialize n disjoint sets. For each edge, union(i, j). Final answer is the count of distinct root representatives in O(n\u00b2 * \u03b1(n)).",
    "companyTag": "Amazon",
    "topic": "Union-Find"
  },
  {
    "id": "pq-auth-64",
    "problem": "Redundant Connection: return an edge in a graph that can be removed so that the resulting graph is a tree of n nodes.",
    "options": [
      "Disjoint Set Union (Union-Find)",
      "Topological Sort",
      "Dijkstra",
      "Two Pointers"
    ],
    "correct": "Disjoint Set Union (Union-Find)",
    "explanation": "Iterate over edges. If find(u) == find(v), adding edge (u, v) creates a cycle, so (u, v) is the redundant edge.",
    "companyTag": "Google",
    "topic": "Union-Find"
  },
  {
    "id": "pq-auth-65",
    "problem": "Single Number: every element appears twice except for one. Find that single one in linear time and O(1) space.",
    "options": [
      "Bit Manipulation & XOR",
      "Hash Table",
      "Two Pointers",
      "Binary Search"
    ],
    "correct": "Bit Manipulation & XOR",
    "explanation": "XOR property: x ^ x = 0 and x ^ 0 = x. XORing all elements cancels duplicate pairs and isolates the unique number in O(n) time and O(1) space.",
    "companyTag": "Amazon",
    "topic": "Bit Manipulation"
  },
  {
    "id": "pq-auth-66",
    "problem": "Counting Bits: return an array ans of length n + 1 such that ans[i] is the number of 1's in the binary representation of i.",
    "options": [
      "Bit Manipulation & XOR",
      "Dynamic Programming",
      "Monotonic Stack",
      "Binary Search"
    ],
    "correct": "Bit Manipulation & XOR",
    "explanation": "Brian Kernighan's trick or DP recurrence: ans[i] = ans[i >> 1] + (i & 1) calculates set bit counts for all numbers up to n in O(n).",
    "companyTag": "Apple",
    "topic": "Bit Manipulation"
  },
  {
    "id": "pq-auth-67",
    "problem": "Number of 1 Bits (Hamming Weight): return the number of set bits in an unsigned integer.",
    "options": [
      "Bit Manipulation & XOR",
      "Divide and Conquer",
      "Sliding Window",
      "Heap"
    ],
    "correct": "Bit Manipulation & XOR",
    "explanation": "n = n & (n - 1) clears the lowest set bit in each iteration. Loop runs exactly as many times as there are 1s (at most 32).",
    "companyTag": "Microsoft",
    "topic": "Bit Manipulation"
  },
  {
    "id": "pq-auth-68",
    "problem": "Given an array of meeting time intervals [start, end], determine if a person could attend all meetings.",
    "options": [
      "Greedy Interval Scheduling",
      "Dynamic Programming",
      "Breadth-First Search",
      "Sliding Window"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Sort intervals by start time. Check if any meeting starts before the previous meeting ends (intervals[i][0] < intervals[i-1][1]).",
    "companyTag": "Google",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-69",
    "problem": "Given a collection of intervals, find the maximum number of intervals that are mutually non-overlapping.",
    "options": [
      "Greedy Interval Scheduling",
      "Dynamic Programming",
      "Monotonic Stack",
      "Trie"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Greedy activity selection: sort by finish time and pick whenever start >= last_finish.",
    "companyTag": "Microsoft",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-70",
    "problem": "Given a list of non-overlapping intervals sorted by start time, insert a new interval and merge if necessary.",
    "options": [
      "Greedy Interval Scheduling",
      "Binary Search",
      "Two Pointers",
      "Heap"
    ],
    "correct": "Greedy Interval Scheduling",
    "explanation": "Three phases: add all intervals ending before new interval, merge all overlapping intervals, add remaining.",
    "companyTag": "Google",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-71",
    "problem": "Given an array of strings strs, group the anagrams together in any order.",
    "options": [
      "Hash Table / Frequency Map",
      "Sliding Window",
      "Two Pointers",
      "Binary Search"
    ],
    "correct": "Hash Table / Frequency Map",
    "explanation": "Use tuple of character counts (length 26) or sorted string as hash key in HashMap in O(N * K).",
    "companyTag": "Amazon",
    "topic": "Hashing"
  },
  {
    "id": "pq-auth-72",
    "problem": "Given an integer array nums, return true if any value appears at least twice in the array in O(n) time and O(n) space.",
    "options": [
      "Hash Table / Frequency Map",
      "Binary Search",
      "Monotonic Stack",
      "Two Pointers"
    ],
    "correct": "Hash Table / Frequency Map",
    "explanation": "Insert into a HashSet and check membership in O(1) average time.",
    "companyTag": "Apple",
    "topic": "Hashing"
  },
  {
    "id": "pq-auth-73",
    "problem": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.",
    "options": [
      "Hash Table / Frequency Map",
      "Sorting",
      "Priority Queue",
      "Sliding Window"
    ],
    "correct": "Hash Table / Frequency Map",
    "explanation": "Store all numbers in a HashSet. Only start counting a sequence from x if x-1 is not in set, ensuring every element visited twice.",
    "companyTag": "Google",
    "topic": "Hashing"
  },
  {
    "id": "pq-auth-74",
    "problem": "Subarray Sum Equals K: find the total number of subarrays whose sum equals to k in an array containing negative numbers.",
    "options": [
      "Prefix Sum & Hash Map",
      "Sliding Window",
      "Two Pointers",
      "Kadane's Algorithm"
    ],
    "correct": "Prefix Sum & Hash Map",
    "explanation": "Sliding window fails with negative numbers. Store cumulative prefix sums in a frequency map; check count of prefix_sum - k in O(n).",
    "companyTag": "Meta",
    "topic": "Prefix Sum"
  },
  {
    "id": "pq-auth-75",
    "problem": "Find the maximum subarray sum in an integer array containing positive and negative numbers.",
    "options": [
      "Kadane's Algorithm (DP)",
      "Two Pointers",
      "Binary Search",
      "Sliding Window"
    ],
    "correct": "Kadane's Algorithm (DP)",
    "explanation": "At each index, either extend the current subarray sum or start fresh from current element: current_sum = max(x, current_sum + x).",
    "companyTag": "Amazon",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-76",
    "problem": "Find the maximum product of a contiguous subarray in an array of integers.",
    "options": [
      "Kadane's Algorithm (DP)",
      "Sliding Window",
      "Monotonic Stack",
      "Binary Search Tree"
    ],
    "correct": "Kadane's Algorithm (DP)",
    "explanation": "Track both max_prod and min_prod because multiplying a negative number by min_prod can yield the new max_prod.",
    "companyTag": "Microsoft",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-77",
    "problem": "Search a 2D matrix where each row is sorted and the first integer of each row is greater than the last integer of previous row.",
    "options": [
      "Binary Search",
      "Depth-First Search",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Binary Search",
    "explanation": "Treat the m x n matrix as a 1D sorted array of length m*n. Index mid maps to matrix[mid // n][mid % n] in O(log(m*n)).",
    "companyTag": "Amazon",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-78",
    "problem": "Search a 2D matrix where integers in each row are sorted left to right and columns are sorted top to bottom.",
    "options": [
      "Two Pointers / Matrix Search",
      "Binary Search",
      "Breadth-First Search",
      "Dynamic Programming"
    ],
    "correct": "Two Pointers / Matrix Search",
    "explanation": "Start at top-right corner. If current > target, move left; if current < target, move down. Solves in O(m + n).",
    "companyTag": "Google",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-79",
    "problem": "Find the median of two sorted arrays of sizes m and n in O(log(min(m, n))) runtime.",
    "options": [
      "Binary Search",
      "Two Pointers",
      "Divide and Conquer",
      "QuickSelect"
    ],
    "correct": "Binary Search",
    "explanation": "Binary search the partition cut on the smaller array such that left elements are <= right elements across both arrays.",
    "companyTag": "Google",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-80",
    "problem": "Find the kth smallest element in a sorted matrix where each row and column is sorted.",
    "options": [
      "Binary Search on Answer",
      "Breadth-First Search",
      "Depth-First Search",
      "Monotonic Stack"
    ],
    "correct": "Binary Search on Answer",
    "explanation": "Binary search answer in range [matrix[0][0], matrix[n-1][n-1]]. Count elements <= mid using two pointers from top-right in O(n).",
    "companyTag": "Meta",
    "topic": "Searching"
  },
  {
    "id": "pq-auth-81",
    "problem": "Determine if a 9 x 9 Sudoku board is valid according to standard rules.",
    "options": [
      "Hash Table / Bitmask",
      "Backtracking",
      "Dynamic Programming",
      "Breadth-First Search"
    ],
    "correct": "Hash Table / Bitmask",
    "explanation": "Use sets or bitmasks of length 9 to verify no duplicates exist across rows, columns, and 3x3 sub-boxes.",
    "companyTag": "Amazon",
    "topic": "Hashing"
  },
  {
    "id": "pq-auth-82",
    "problem": "Spiral Matrix: return all elements of the matrix in spiral order.",
    "options": [
      "Matrix Boundary Traversal",
      "Depth-First Search",
      "Breadth-First Search",
      "Two Pointers"
    ],
    "correct": "Matrix Boundary Traversal",
    "explanation": "Maintain four boundaries (top, bottom, left, right). Traverse edges and shrink boundaries in O(m * n).",
    "companyTag": "Microsoft",
    "topic": "Matrix"
  },
  {
    "id": "pq-auth-83",
    "problem": "Rotate an n x n 2D matrix representing an image by 90 degrees clockwise in-place.",
    "options": [
      "Matrix Transposition & Reflection",
      "Depth-First Search",
      "Breadth-First Search",
      "Trie"
    ],
    "correct": "Matrix Transposition & Reflection",
    "explanation": "Transpose the matrix along the main diagonal (swap matrix[i][j] with matrix[j][i]), then reverse each row horizontally.",
    "companyTag": "Amazon",
    "topic": "Matrix"
  },
  {
    "id": "pq-auth-84",
    "problem": "Given an array of strings, find the longest common prefix string amongst them.",
    "options": [
      "Vertical / Horizontal Scanning",
      "Sliding Window",
      "Two Pointers",
      "Dynamic Programming"
    ],
    "correct": "Vertical / Horizontal Scanning",
    "explanation": "Compare characters column by column across all strings, or insert into a Trie and follow single branch.",
    "companyTag": "Apple",
    "topic": "Strings"
  },
  {
    "id": "pq-auth-85",
    "problem": "Check if s is a subsequence of t.",
    "options": [
      "Two Pointers",
      "Dynamic Programming",
      "Sliding Window",
      "Binary Search"
    ],
    "correct": "Two Pointers",
    "explanation": "One pointer on s and one on t. Advance pointer on s only when characters match. True if s pointer reaches end in O(len(t)).",
    "companyTag": "Google",
    "topic": "Strings"
  },
  {
    "id": "pq-auth-86",
    "problem": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "options": [
      "Stack",
      "Two Pointers",
      "Sliding Window",
      "Breadth-First Search"
    ],
    "correct": "Stack",
    "explanation": "Push opening brackets to stack; on closing bracket, check if top of stack matches and pop. Valid if stack is empty at end.",
    "companyTag": "Amazon",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-87",
    "problem": "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.",
    "options": [
      "Min-Stack Auxiliary Stack",
      "Monotonic Queue",
      "Segment Tree",
      "Binary Search Tree"
    ],
    "correct": "Min-Stack Auxiliary Stack",
    "explanation": "Maintain a secondary stack that stores the minimum value seen so far alongside each push operation.",
    "companyTag": "Bloomberg",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-88",
    "problem": "Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix).",
    "options": [
      "Stack",
      "Breadth-First Search",
      "Two Pointers",
      "Dynamic Programming"
    ],
    "correct": "Stack",
    "explanation": "Push operands to stack. When operator encountered, pop two top operands, apply operator, and push result back.",
    "companyTag": "Microsoft",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-89",
    "problem": "Implement Queue using Stacks with amortized O(1) push and pop.",
    "options": [
      "Two Stacks (In and Out)",
      "Monotonic Queue",
      "Linked List",
      "Binary Heap"
    ],
    "correct": "Two Stacks (In and Out)",
    "explanation": "Push onto stack_in. For pop/peek, if stack_out is empty, transfer all elements from stack_in to stack_out, reversing order.",
    "companyTag": "Google",
    "topic": "Stacks & Queues"
  },
  {
    "id": "pq-auth-90",
    "problem": "Given an array of integers temperatures, find the next day with a warmer temperature for every day.",
    "options": [
      "Monotonic Stack",
      "Sliding Window",
      "Binary Search",
      "Two Pointers"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Store indices in decreasing monotonic stack. Pop and record day distance when temperature > top of stack.",
    "companyTag": "Amazon",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-91",
    "problem": "Given circular array nums, find the next greater element for each index.",
    "options": [
      "Monotonic Stack",
      "Sliding Window",
      "Heap",
      "QuickSort"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Iterate from 0 to 2*n-1 using index % n with a monotonic decreasing stack.",
    "companyTag": "Meta",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-92",
    "problem": "Find the maximum area of a rectangle formed by contiguous histogram bars.",
    "options": [
      "Monotonic Stack",
      "Divide and Conquer",
      "Dynamic Programming",
      "Two Pointers"
    ],
    "correct": "Monotonic Stack",
    "explanation": "Monotonic increasing stack of bar indices. Pop when bar is shorter, computing height * (right_idx - left_idx - 1).",
    "companyTag": "Google",
    "topic": "Stacks"
  },
  {
    "id": "pq-auth-93",
    "problem": "Given an array of heights, calculate the total volume of trapped water between buildings.",
    "options": [
      "Two Pointers / Monotonic Stack",
      "Sliding Window",
      "Floyd-Warshall",
      "Trie"
    ],
    "correct": "Two Pointers / Monotonic Stack",
    "explanation": "Two pointers tracking left_max and right_max, or monotonic stack tracking horizontal water troughs in O(n).",
    "companyTag": "Amazon",
    "topic": "Arrays"
  },
  {
    "id": "pq-auth-94",
    "problem": "Find the maximum depth of a binary tree.",
    "options": [
      "Depth-First Search (Postorder)",
      "Breadth-First Search",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Depth-First Search (Postorder)",
    "explanation": "Recurrence: 1 + max(maxDepth(root.left), maxDepth(root.right)) in O(n) time.",
    "companyTag": "Apple",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-95",
    "problem": "Check if two binary trees are identical in structure and node values.",
    "options": [
      "Depth-First Search / Recursion",
      "Topological Sort",
      "Sliding Window",
      "Monotonic Stack"
    ],
    "correct": "Depth-First Search / Recursion",
    "explanation": "Recursive check: p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right).",
    "companyTag": "Microsoft",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-96",
    "problem": "Invert a binary tree (swap left and right subtrees of every node).",
    "options": [
      "Depth-First Search (Pre/Postorder)",
      "Binary Search",
      "Two Pointers",
      "Sliding Window"
    ],
    "correct": "Depth-First Search (Pre/Postorder)",
    "explanation": "Swap root.left and root.right recursively for every node in O(n).",
    "companyTag": "Google",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-97",
    "problem": "Check if a binary tree is symmetric around its center.",
    "options": [
      "Depth-First Search / Mirror Recursion",
      "Sliding Window",
      "Topological Sort",
      "Monotonic Stack"
    ],
    "correct": "Depth-First Search / Mirror Recursion",
    "explanation": "Check if t1.val == t2.val and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left).",
    "companyTag": "Amazon",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-98",
    "problem": "Find the diameter of a binary tree (longest path between any two nodes).",
    "options": [
      "Tree DP / Postorder DFS",
      "Breadth-First Search",
      "Sliding Window",
      "Monotonic Queue"
    ],
    "correct": "Tree DP / Postorder DFS",
    "explanation": "At each node, local diameter is left_height + right_height. Update global max and return 1 + max(left, right) height.",
    "companyTag": "Meta",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-99",
    "problem": "Check if a binary tree is height-balanced (depth of two subtrees of every node never differs by more than 1).",
    "options": [
      "Depth-First Search (Bottom-Up)",
      "Sliding Window",
      "Two Pointers",
      "Binary Search"
    ],
    "correct": "Depth-First Search (Bottom-Up)",
    "explanation": "Bottom-up DFS returns -1 if subtree is unbalanced, avoiding O(n\u00b2) top-down recalculation and running in O(n).",
    "companyTag": "Amazon",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-100",
    "problem": "Find the Lowest Common Ancestor (LCA) of two given nodes in a Binary Search Tree (BST).",
    "options": [
      "BST Property Traversal",
      "Breadth-First Search",
      "Monotonic Stack",
      "Trie"
    ],
    "correct": "BST Property Traversal",
    "explanation": "If both p and q < root, go left. If both > root, go right. Otherwise, root is the split point (LCA) in O(h).",
    "companyTag": "Microsoft",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-101",
    "problem": "Find the Lowest Common Ancestor (LCA) of two given nodes in a generic Binary Tree.",
    "options": [
      "Postorder DFS",
      "Breadth-First Search",
      "Monotonic Stack",
      "Binary Search"
    ],
    "correct": "Postorder DFS",
    "explanation": "Recurse left and right. If both return non-null, root is LCA. If only one returns non-null, propagate that node up.",
    "companyTag": "Meta",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-102",
    "problem": "Validate if a binary tree is a valid Binary Search Tree (BST).",
    "options": [
      "DFS with Min/Max Bounds",
      "Sliding Window",
      "Breadth-First Search",
      "Two Pointers"
    ],
    "correct": "DFS with Min/Max Bounds",
    "explanation": "Check if low < node.val < high recursively, updating bounds (low, node.val) for right child and (node.val, high) for left.",
    "companyTag": "Amazon",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-103",
    "problem": "Find the kth smallest element in a BST.",
    "options": [
      "Inorder Traversal (DFS)",
      "Heap",
      "Sliding Window",
      "Breadth-First Search"
    ],
    "correct": "Inorder Traversal (DFS)",
    "explanation": "Inorder traversal of a BST visits nodes in strictly increasing sorted order. Stop at the kth visited node in O(h + k).",
    "companyTag": "Google",
    "topic": "Trees"
  },
  {
    "id": "pq-auth-104",
    "problem": "Given an array of intervals where intervals[i] = [start, end], count minimum platforms required for railway station.",
    "options": [
      "Greedy Two Pointers / Sorting",
      "Dynamic Programming",
      "Trie",
      "Breadth-First Search"
    ],
    "correct": "Greedy Two Pointers / Sorting",
    "explanation": "Sort arrivals and departures separately. If arrival <= departure, increment platform count and arrival pointer in O(n log n).",
    "companyTag": "Amazon",
    "topic": "Intervals"
  },
  {
    "id": "pq-auth-105",
    "problem": "Gas Station: return the starting gas station index if you can travel around the circuit once clockwise.",
    "options": [
      "Greedy Linear Scan",
      "Dynamic Programming",
      "Binary Search",
      "Two Pointers"
    ],
    "correct": "Greedy Linear Scan",
    "explanation": "If total gas < total cost, return -1. Otherwise, if current tank falls below 0, reset start to next station in O(n).",
    "companyTag": "Amazon",
    "topic": "Greedy"
  },
  {
    "id": "pq-auth-106",
    "problem": "Jump Game: return true if you can reach the last index starting from index 0.",
    "options": [
      "Greedy Farthest Reach",
      "Dynamic Programming",
      "Breadth-First Search",
      "Monotonic Stack"
    ],
    "correct": "Greedy Farthest Reach",
    "explanation": "Track max_reachable_index. At each step i, if i > max_reachable, return false; update max_reachable = max(max_reachable, i + nums[i]).",
    "companyTag": "Meta",
    "topic": "Greedy"
  },
  {
    "id": "pq-auth-107",
    "problem": "Jump Game II: return the minimum number of jumps to reach the last index.",
    "options": [
      "Greedy Interval / BFS",
      "Dynamic Programming",
      "Binary Search",
      "Sliding Window"
    ],
    "correct": "Greedy Interval / BFS",
    "explanation": "Greedy implicit BFS: track current jump boundary and farthest reachable. When index hits boundary, increment jumps in O(n).",
    "companyTag": "Google",
    "topic": "Greedy"
  },
  {
    "id": "pq-auth-108",
    "problem": "House Robber: determine the maximum amount of money you can rob tonight without alerting the police (cannot rob adjacent houses).",
    "options": [
      "Dynamic Programming (1D)",
      "Greedy",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Dynamic Programming (1D)",
    "explanation": "Recurrence: rob[i] = max(rob[i-1], rob[i-2] + nums[i]). Uses two variables for O(1) space.",
    "companyTag": "Amazon",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-109",
    "problem": "House Robber II: houses are arranged in a circle, meaning the first house is neighbor to the last.",
    "options": [
      "Dynamic Programming (1D)",
      "Two Pointers",
      "Sliding Window",
      "Monotonic Stack"
    ],
    "correct": "Dynamic Programming (1D)",
    "explanation": "Run House Robber I twice: once for houses 0 to n-2, once for houses 1 to n-1. Return max of both.",
    "companyTag": "Google",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-110",
    "problem": "Unique Paths: a robot is on an m x n grid. How many possible unique paths are there from top-left to bottom-right moving only right or down?",
    "options": [
      "Dynamic Programming (Grid) / Combinatorics",
      "Breadth-First Search",
      "Sliding Window",
      "Monotonic Stack"
    ],
    "correct": "Dynamic Programming (Grid) / Combinatorics",
    "explanation": "dp[i][j] = dp[i-1][j] + dp[i][j-1], or combinations formula C(m+n-2, m-1) in O(min(m, n)).",
    "companyTag": "Microsoft",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-111",
    "problem": "Minimum Path Sum: find a path from top-left to bottom-right of an m x n grid which minimizes the sum of all numbers along its path.",
    "options": [
      "Dynamic Programming (Grid)",
      "Dijkstra",
      "Greedy",
      "Depth-First Search"
    ],
    "correct": "Dynamic Programming (Grid)",
    "explanation": "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Solved in-place in O(m * n) time and O(1) space.",
    "companyTag": "Amazon",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-112",
    "problem": "Edit Distance: return minimum operations (insert, delete, replace) required to convert word1 to word2.",
    "options": [
      "Dynamic Programming (2D)",
      "Sliding Window",
      "Trie",
      "Two Pointers"
    ],
    "correct": "Dynamic Programming (2D)",
    "explanation": "If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]; else 1 + min(insert, delete, replace) in O(m * n).",
    "companyTag": "Google",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-113",
    "problem": "Decode Ways: given a string s containing digits, return the number of ways to decode it ('1' -> 'A', '26' -> 'Z').",
    "options": [
      "Dynamic Programming (1D)",
      "Backtracking",
      "Sliding Window",
      "Trie"
    ],
    "correct": "Dynamic Programming (1D)",
    "explanation": "dp[i] = (valid 1-digit ? dp[i-1] : 0) + (valid 2-digit ? dp[i-2] : 0). Space-optimized with two variables.",
    "companyTag": "Meta",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-114",
    "problem": "Word Break: determine if string s can be segmented into a space-separated sequence of one or more dictionary words.",
    "options": [
      "Dynamic Programming / Trie",
      "Two Pointers",
      "Sliding Window",
      "Monotonic Stack"
    ],
    "correct": "Dynamic Programming / Trie",
    "explanation": "dp[i] is true if any prefix dp[j] is true and substring s[j:i] exists in dictionary set in O(n * max_word_len).",
    "companyTag": "Amazon",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-115",
    "problem": "Target Sum: assign '+' or '-' signs to integers to make sum equal target. Return total number of ways.",
    "options": [
      "Dynamic Programming (Subset Sum)",
      "Backtracking",
      "Greedy",
      "Binary Search"
    ],
    "correct": "Dynamic Programming (Subset Sum)",
    "explanation": "Transform into finding subset sum P = (target + total_sum) // 2. Solved as 0/1 knapsack in O(n * P).",
    "companyTag": "Meta",
    "topic": "Dynamic Programming"
  },
  {
    "id": "pq-auth-116",
    "problem": "Accounts Merge: merge accounts where each account has a name and email list, and two accounts with shared email belong to same person.",
    "options": [
      "Disjoint Set Union (Union-Find)",
      "Sliding Window",
      "Monotonic Stack",
      "Segment Tree"
    ],
    "correct": "Disjoint Set Union (Union-Find)",
    "explanation": "Union-Find on emails. For each account, union the first email with all subsequent emails. Group by component root.",
    "companyTag": "Meta",
    "topic": "Union-Find"
  },
  {
    "id": "pq-auth-117",
    "problem": "Graph Valid Tree: given n nodes labeled 0 to n-1 and a list of undirected edges, check whether these edges form a valid tree.",
    "options": [
      "Disjoint Set Union / BFS",
      "Topological Sort",
      "Dijkstra",
      "Two Pointers"
    ],
    "correct": "Disjoint Set Union / BFS",
    "explanation": "A valid tree has exactly n-1 edges and is fully connected (no cycles). Union-Find verifies both conditions in O(n * \u03b1(n)).",
    "companyTag": "Google",
    "topic": "Union-Find"
  },
  {
    "id": "pq-auth-118",
    "problem": "Network Delay Time: send a signal from a node k in a weighted directed graph, return minimum time for all nodes to receive it.",
    "options": [
      "Dijkstra's Algorithm",
      "Breadth-First Search",
      "Kruskal's Algorithm",
      "Dynamic Programming"
    ],
    "correct": "Dijkstra's Algorithm",
    "explanation": "Single-source shortest path with non-negative edge weights. Min-Heap Dijkstra visits nodes in increasing distance in O((V + E) log V).",
    "companyTag": "Amazon",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-119",
    "problem": "Cheapest Flights Within K Stops: find cheapest price from src to dst with at most k stops in a weighted graph.",
    "options": [
      "Bellman-Ford / BFS",
      "Dijkstra",
      "Floyd-Warshall",
      "Trie"
    ],
    "correct": "Bellman-Ford / BFS",
    "explanation": "Bellman-Ford algorithm executed for k+1 iterations, relaxing prices from previous iteration copy to limit hops.",
    "companyTag": "Meta",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-120",
    "problem": "Critical Connections in a Network (Bridges): find all bridges in an undirected connected network.",
    "options": [
      "Tarjan's Algorithm (DFS)",
      "Breadth-First Search",
      "Dijkstra",
      "Union-Find"
    ],
    "correct": "Tarjan's Algorithm (DFS)",
    "explanation": "DFS tracking discovery times and lowest reachable times (tin and low). Edge (u, v) is a bridge if low[v] > tin[u].",
    "companyTag": "Amazon",
    "topic": "Graphs"
  },
  {
    "id": "pq-auth-121",
    "problem": "Maximum XOR of Two Numbers in an Array: find the maximum result of nums[i] XOR nums[j].",
    "options": [
      "Trie (Binary Trie)",
      "Dynamic Programming",
      "Sliding Window",
      "Two Pointers"
    ],
    "correct": "Trie (Binary Trie)",
    "explanation": "Insert 32-bit binary representations into a Trie. For each number, greedily choose opposite bit branches to maximize XOR.",
    "companyTag": "Google",
    "topic": "Trie & Bits"
  },
  {
    "id": "pq-auth-122",
    "problem": "Find the duplicate number in an array containing n + 1 integers where each integer is in range [1, n].",
    "options": [
      "Two Pointers (Floyd's Cycle)",
      "Hash Table",
      "Binary Search on Answer",
      "Bit Manipulation"
    ],
    "correct": "Two Pointers (Floyd's Cycle)",
    "explanation": "Array elements act as pointers: i -> nums[i]. Because of duplicate, a cycle exists. Fast/slow pointers find duplicate in O(1) space.",
    "companyTag": "Amazon",
    "topic": "Arrays & Linked Lists"
  }
];
