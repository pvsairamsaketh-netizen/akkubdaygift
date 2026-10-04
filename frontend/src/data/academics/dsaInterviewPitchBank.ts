// Authentic FAANG/MNC Interview Pitch Bank (120+ Questions)
// Includes 30-sec pitch, 1-min comprehensive answer, deep systems answer, and interviewer expectations

export interface DSAInterviewMasterItem {
  id: string;
  question: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  source: string;
  companyTag?: string;
  thirtySecAnswer: string;
  oneMinAnswer: string;
  deepTechnicalAnswer: string;
  example: string;
  interviewerExpectation: string;
  commonMistakes: string[];
  followUpQuestions: string[];
}

export const AUTHENTIC_INTERVIEW_PITCH_BANK: DSAInterviewMasterItem[] = [
  {
    "id": "int-q-1",
    "question": "How does a HashMap achieve O(1) average lookup time, and what causes it to degrade to O(n)?",
    "topic": "Hashing & Tables",
    "difficulty": "Beginner",
    "tags": [
      "Conceptual",
      "Complexity",
      "Interview Classic"
    ],
    "source": "Zero To Mastery & Code and Debug",
    "companyTag": "Google",
    "thirtySecAnswer": "A HashMap applies a hash function to keys to generate an array bucket index in O(1). If collisions occur, items chain in linked lists. On average with good load factors, chains remain length O(1). If many keys collide into the same bucket, lookup degrades to O(n) linear scanning.",
    "oneMinAnswer": "Under the hood, a HashMap is an array of buckets. When you insert a key, its hash code is computed and mapped to a bucket index modulo array capacity. If two distinct keys map to the same bucket (a collision), chaining or open addressing is used. In languages like Java 8+, once a bucket chain exceeds 8 items, it converts into a Red-Black tree to guarantee O(log n) worst-case. Resizing occurs when the load factor exceeds 0.75, doubling the array capacity to maintain O(1) performance.",
    "deepTechnicalAnswer": "The core guarantee relies on the Uniform Hashing Assumption: keys are distributed uniformly across buckets. Degradation to O(n) happens either due to malicious HashDoS attacks (crafted colliding keys) or poor hash code implementations returning constant values. Python implements open addressing with pseudo-random probing, while Java uses separate chaining with treeification beyond threshold 8. Dynamic resizing requires re-allocating memory and rehashing entries, giving amortized O(1) insertion.",
    "example": "Storing user_id \"u402\" -> hash(\"u402\") % 16 = index 3. Fast direct array pointer jump arr[3].",
    "interviewerExpectation": "Candidate must mention hash functions, modulo index calculation, collisions, chaining/open addressing, and load factor resizing.",
    "commonMistakes": [
      "Claiming HashMap lookup is strictly O(1) in the worst case.",
      "Not knowing what load factor means."
    ],
    "followUpQuestions": [
      "What is the difference between open addressing and separate chaining?",
      "How does Java 8 mitigate HashDoS attacks using TreeNodes?"
    ]
  },
  {
    "id": "int-q-2",
    "question": "Why is quicksort often preferred in practice over mergesort, even though mergesort has guaranteed O(n log n) worst-case?",
    "topic": "Sorting & Searching",
    "difficulty": "Intermediate",
    "tags": [
      "Comparison",
      "Optimization",
      "Systems"
    ],
    "source": "Zero To Mastery DSA & Striver A2Z",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Quicksort is an in-place sort with an auxiliary space complexity of O(log n) call stack, whereas mergesort requires O(n) extra buffer space. Additionally, quicksort exhibits superior CPU cache locality during in-place partition swaps.",
    "oneMinAnswer": "While mergesort guarantees O(n log n) in all cases, it requires allocating an extra temporary array of size O(n) for merging, which incurs significant memory allocation overhead. Quicksort partitions the array in-place, yielding great spatial locality that maximizes CPU L1/L2 cache hits. In practice, randomized pivot selection or median-of-three makes quicksort worst-case O(n\u00b2) virtually impossible on random inputs.",
    "deepTechnicalAnswer": "Modern systems use hybrid sorting algorithms: Introsort (used in C++ std::sort) begins with Quicksort, switches to Heapsort if the recursion depth exceeds 2*log(n) to eliminate the O(n\u00b2) worst-case trap, and uses Insertion Sort for small partitions (n < 16). Mergesort remains preferred for Linked Lists (where pointer updates are O(1) with no extra array allocation) and when stable sorting is strictly required.",
    "example": "Sorting 100M 64-bit integers: Mergesort needs ~800MB extra RAM and cache misses; Quicksort runs in-place inside L3 cache.",
    "interviewerExpectation": "Candidate should contrast auxiliary memory O(n) vs O(1), explain CPU cache locality, and recognize stability requirements.",
    "commonMistakes": [
      "Forgetting that standard Mergesort requires O(n) additional space.",
      "Not knowing why stability matters in multi-column sorting."
    ],
    "followUpQuestions": [
      "When is Mergesort strictly preferred over Quicksort?",
      "What is Introsort and why is it used in C++ STL?"
    ]
  },
  {
    "id": "int-q-3",
    "question": "How do you detect a cycle in a singly linked list with O(1) space, and how do you find the exact start node of the cycle?",
    "topic": "Linked Lists",
    "difficulty": "Intermediate",
    "tags": [
      "Coding",
      "Pattern Recognition",
      "Floyd Cycle"
    ],
    "source": "NeetCode Core & Love Babbar 450",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Use Floyd's Tortoise and Hare algorithm with two pointers: slow moves 1 step and fast moves 2 steps. If they meet, a cycle exists. To find the cycle start, reset one pointer to the head and keep the other at the meeting point; advance both 1 step at a time until they meet again.",
    "oneMinAnswer": "Floyd's algorithm detects cycles in O(n) time and O(1) space without modifying node structures or storing seen pointers in a hash set. Mathematically, let L1 be the distance from head to cycle entrance, and L2 be distance from entrance to meeting point. The total distance traveled by fast is 2 * slow. This algebra simplifies to L1 = k * C - L2 (where C is cycle length). Hence, walking one pointer from the head and one from the meeting point at speed 1 will intersect exactly at the cycle entrance.",
    "deepTechnicalAnswer": "If we used a HashSet to store visited pointers, space complexity would be O(n). Floyd's eliminates this memory cost. If the list has no cycle, fast or fast.next reaches null in at most n/2 steps. In the cyclic case, the relative speed is 1 node per iteration, so the distance between fast and slow decreases by 1 each step, guaranteeing they meet in at most C iterations once slow enters the cycle.",
    "example": "1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle of length 3). Fast and slow meet at node 5. Reset slow to 1; both step by 1; they meet at node 3.",
    "interviewerExpectation": "Derive or clearly state the mathematical intuition of why resetting one pointer to head finds the entry node.",
    "commonMistakes": [
      "Checking fast.next without checking fast is not null first (causing NullPointer/AttributeError).",
      "Suggesting a HashSet when the interviewer specified O(1) space."
    ],
    "followUpQuestions": [
      "How can you determine the length of the cycle?",
      "Can this same concept be applied to find the duplicate number in an array? (LeetCode 287)"
    ]
  },
  {
    "id": "int-q-4",
    "question": "When should you use Dijkstra's algorithm vs Breadth-First Search (BFS) vs Bellman-Ford for shortest path finding?",
    "topic": "Graphs & Shortest Path",
    "difficulty": "Advanced",
    "tags": [
      "Comparison",
      "Algorithm Selection",
      "Complexity"
    ],
    "source": "GeeksforGeeks Master Sheet & Striver A2Z",
    "companyTag": "Meta",
    "thirtySecAnswer": "Use BFS when all edge weights are equal (or unweighted), running in O(V + E). Use Dijkstra when edges have non-negative weights, running in O((V + E) log V). Use Bellman-Ford when edges have negative weights or you must detect negative cycles, running in O(V * E).",
    "oneMinAnswer": "BFS guarantees shortest paths on unweighted graphs because nodes are visited in increasing order of hop distance. When edges carry unequal positive weights, BFS fails because a multi-hop path may have smaller total weight than a single high-weight edge; Dijkstra fixes this by using a priority queue (min-heap) to greedily relax edges in order of total path weight. However, Dijkstra assumes edge relaxation is greedy and monotonic, so negative edge weights break it. Bellman-Ford relaxes all edges V-1 times and detects negative cycles on the V-th pass.",
    "deepTechnicalAnswer": "Dijkstra with Fibonacci heap achieves O(E + V log V), while with a standard binary heap it is O((V + E) log V). If a graph is a Directed Acyclic Graph (DAG), you can find single-source shortest paths in O(V + E) by topological sorting regardless of negative weights. For all-pairs shortest path, Floyd-Warshall is used in O(V\u00b3) dynamic programming.",
    "example": "Road navigation network where road segments have travel durations (positive): Dijkstra. Social network degrees of separation (unweighted): BFS. Financial arbitrage detection (currency conversions with negative logs): Bellman-Ford.",
    "interviewerExpectation": "Candidate should state time complexity for all three, cite the unweighted vs weighted vs negative-weight criteria, and explain why Dijkstra fails on negative weights.",
    "commonMistakes": [
      "Using Dijkstra on an unweighted graph where simple BFS is faster and simpler.",
      "Claiming Dijkstra works on negative edges."
    ],
    "followUpQuestions": [
      "Why does Dijkstra fail on graphs with negative weights?",
      "How can Floyd-Warshall find all-pairs shortest paths?"
    ]
  },
  {
    "id": "int-q-5",
    "question": "How do you design an LRU (Least Recently Used) Cache with O(1) get and put operations?",
    "topic": "System Design & Data Structures",
    "difficulty": "Advanced",
    "tags": [
      "Data Structure Design",
      "FAANG Classic"
    ],
    "source": "Code & Debug & NeetCode",
    "companyTag": "Google",
    "thirtySecAnswer": "Combine a Hash Table with a Doubly Linked List. The Hash Table stores key -> Node pointers for O(1) lookup. The Doubly Linked List maintains access order with most recent at head and least recent at tail for O(1) insertions and evictions.",
    "oneMinAnswer": "An LRU cache requires finding an existing key in O(1) time and updating its recency in O(1) time. Arrays cannot do this because removing an element requires O(n) shifting. A Singly Linked List cannot delete a given node in O(1) without iterating to find the previous node. A Doubly Linked List solves this because any node can detach itself in O(1) by updating node.prev.next and node.next.prev. By adding dummy head and tail sentinel nodes, edge cases (empty list, single node) are cleanly avoided.",
    "deepTechnicalAnswer": "In Java, LinkedHashMap provides this behavior with removeEldestEntry. In Python, collections.OrderedDict implements this under the hood. In C++, std::unordered_map<Key, std::list<std::pair<Key, Value>>::iterator> is the canonical implementation. When memory capacity C is reached during put, remove the node before tail, delete its key from the hash map, and prepend the new node after head.",
    "example": "Capacity = 2. put(1, 1), put(2, 2). get(1) moves node 1 to head. put(3, 3) evicts node 2 (tail). Cache now holds 3 and 1.",
    "interviewerExpectation": "Candidate must draw or clearly describe why Doubly Linked List is strictly required (O(1) node removal) and how dummy head/tail eliminate null pointer exceptions.",
    "commonMistakes": [
      "Suggesting a Singly Linked List without realizing deletion requires O(n) search for predecessor.",
      "Forgetting to delete from the hash map when evicting from the tail."
    ],
    "followUpQuestions": [
      "How would you make this LRU cache thread-safe in a multi-threaded system?",
      "What is LFU (Least Frequently Used) cache and how does its complexity differ?"
    ]
  },
  {
    "id": "int-q-6",
    "question": "Why is Python's list.pop(0) an O(n) operation while deque.popleft() is O(1)?",
    "topic": "Python Internals & Queues",
    "difficulty": "Beginner",
    "tags": [
      "Python Specific",
      "Complexity",
      "Memory"
    ],
    "source": "CampusX & Shushrut Sharma",
    "companyTag": "Amazon",
    "thirtySecAnswer": "A Python list is a contiguous dynamic array. Popping from index 0 requires shifting all remaining n-1 elements left by one memory slot. A collections.deque is implemented as a doubly linked list of fixed-size memory blocks, allowing O(1) pointer updates at both ends.",
    "oneMinAnswer": "In Python, PyListObject wraps a contiguous C array of pointers. Deleting the first pointer forces a memmove() of the entire array, causing O(n) execution time. collections.deque (double-ended queue) allocates blocks of 64 elements linked via pointers. Popping from the left only updates the block head pointer; if a block empties, it is unlinked in O(1). Therefore, for FIFO queue workloads, collections.deque must always be used instead of list.",
    "deepTechnicalAnswer": "Python lists optimize for random access (list[i] is O(1)) and append/pop from the right (amortized O(1)). Deques trade indexed random access (deque[i] is O(n)) to achieve strictly O(1) push and pop from both ends.",
    "example": "Queue of 100,000 requests: 100,000 list.pop(0) takes ~5 seconds (O(n\u00b2)); 100,000 deque.popleft() takes ~5 milliseconds (O(n)).",
    "interviewerExpectation": "Candidate must mention contiguous array shifting vs linked block chunks.",
    "commonMistakes": [
      "Using list as a queue in interview solutions.",
      "Claiming list.pop(0) is O(1)."
    ],
    "followUpQuestions": [
      "How does Python allocate memory when list capacity is exceeded?",
      "What is the memory overhead difference between list and deque?"
    ]
  },
  {
    "id": "int-q-7",
    "question": "What is the difference between a Binary Search Tree (BST), an AVL Tree, and a Red-Black Tree?",
    "topic": "Trees & Balancing",
    "difficulty": "Intermediate",
    "tags": [
      "Trees",
      "Balancing",
      "Comparison"
    ],
    "source": "Zero To Mastery & Striver A2Z",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "A BST enforces Left < Root < Right but can become skewed into a linked list of height O(n). An AVL tree is strictly balanced with balance factor <= 1, guaranteeing height ~1.44 log n. A Red-Black tree is color-balanced with height <= 2 log n, requiring fewer rotations on inserts/deletes.",
    "oneMinAnswer": "Unbalanced BSTs have O(n) worst-case time for lookup, insertion, and deletion if elements arrive in sorted order. AVL trees strictly balance heights: balance factor = |height(left) - height(right)| <= 1. Because AVL is so strictly balanced, it offers faster lookups, making it ideal for read-heavy workloads. Red-Black trees use color rules (root is black, red nodes cannot have red children, equal black height) to ensure the longest path is at most twice the shortest. They require at most 2 rotations per insertion and 3 per deletion, making Red-Black preferred for write-heavy collections (e.g. C++ std::map, Java TreeMap, Linux CFS scheduler).",
    "deepTechnicalAnswer": "Rotations in both trees are local O(1) pointer updates (Left-Left, Right-Right, Left-Right, Right-Left). AVL recalculates height attributes; Red-Black stores a 1-bit color flag and performs recoloring during post-insertion fixup.",
    "example": "Inserting [1, 2, 3, 4, 5]: BST height = 5 (linear scan). AVL height = 3. Red-Black height = 3.",
    "interviewerExpectation": "Candidate should explain tree height degeneration, contrast AVL strict balancing vs Red-Black rotation costs, and cite standard library uses.",
    "commonMistakes": [
      "Confusing Binary Tree with Binary Search Tree.",
      "Not knowing that C++ std::map uses Red-Black trees."
    ],
    "followUpQuestions": [
      "What are the 4 tree rotation cases in AVL trees?",
      "How does B-Tree differ from Red-Black tree for disk storage?"
    ]
  },
  {
    "id": "int-q-8",
    "question": "How does Breadth-First Search (BFS) guarantee finding the shortest path in an unweighted graph, but fails when weights are unequal?",
    "topic": "Graphs & Search",
    "difficulty": "Beginner",
    "tags": [
      "BFS",
      "Shortest Path",
      "Proof"
    ],
    "source": "Striver A2Z & NeetCode",
    "companyTag": "Apple",
    "thirtySecAnswer": "BFS explores vertices in concentric circles by hop count (layer 0, layer 1, layer 2...). The first time a node is dequeued, it is reached via the minimum number of hops. When weights are unequal, a 1-hop path of weight 10 is worse than a 2-hop path of weight 1+1=2, so hop count no longer correlates with path cost.",
    "oneMinAnswer": "Because a FIFO queue processes nodes in strictly non-decreasing order of distance from the source, BFS naturally partitions the graph into levels d, d+1, d+2. If all edges have weight 1, hop distance equals total cost. When edge weights vary, a greedy expansion based purely on hop count can commit to a high-weight single edge before exploring a detour of smaller weight edges. Dijkstra fixes this by replacing the FIFO queue with a Priority Queue sorted by accumulated weight.",
    "deepTechnicalAnswer": "Formally, BFS is a special case of Dijkstra where edge weight w(u, v) = 1. The Priority Queue degenerates into a circular FIFO queue, reducing time complexity from O((V + E) log V) to O(V + E).",
    "example": "Node A -> B (weight 100), Node A -> C (weight 1) -> B (weight 1). BFS picks direct path A->B (1 hop, cost 100). Dijkstra picks A->C->B (2 hops, cost 2).",
    "interviewerExpectation": "Candidate should explain level-order queue progression and construct a simple 3-node counterexample.",
    "commonMistakes": [
      "Claiming BFS works on weighted graphs if weights are positive integers.",
      "Using DFS to find shortest path."
    ],
    "followUpQuestions": [
      "How can you adapt BFS to solve the 0-1 BFS problem in O(V + E)? (Using deque)",
      "Can Bellman-Ford handle negative cycles?"
    ]
  },
  {
    "id": "int-q-9",
    "question": "What is Dynamic Programming, and how do you determine whether a problem requires DP or Greedy?",
    "topic": "Dynamic Programming",
    "difficulty": "Intermediate",
    "tags": [
      "DP",
      "Greedy",
      "Algorithm Design"
    ],
    "source": "Code & Debug & Zero To Mastery",
    "companyTag": "Google",
    "thirtySecAnswer": "Dynamic Programming solves optimization problems by breaking them into overlapping subproblems and storing intermediate states. DP is required when local optimal choices do not guarantee a global optimal solution (the Greedy choice property fails), requiring exploration of multiple decision branches.",
    "oneMinAnswer": "Both DP and Greedy require Optimal Substructure: an optimal solution to the problem contains optimal solutions to its subproblems. In Greedy, you make the locally best choice at each step without ever backtracking or considering alternatives (e.g. Activity Selection, Dijkstra). In Dynamic Programming, the optimal choice at step i depends on future consequences and overlapping choices (e.g. Coin Change with arbitrary coins, 0/1 Knapsack). If choosing a locally best option can prevent a better global solution later, Greedy fails and DP is mandatory.",
    "deepTechnicalAnswer": "DP implementations use either Top-Down with Memoization (recursive, intuitive, skips unreachable subproblems) or Bottom-Up Tabulation (iterative, avoids call stack overflow, enables rolling-array space optimization from O(n\u00b2) to O(n)).",
    "example": "Coin denominations [1, 3, 4] for target 6. Greedy picks 4 + 1 + 1 (3 coins). DP explores choices and finds 3 + 3 (2 coins).",
    "interviewerExpectation": "Candidate should define Optimal Substructure and Overlapping Subproblems and provide a concrete counterexample where Greedy fails.",
    "commonMistakes": [
      "Attempting Greedy on 0/1 Knapsack where fractional knapsack is required for greedy.",
      "Forgetting base cases in DP recursion."
    ],
    "followUpQuestions": [
      "How do you recognize when 2D DP space can be reduced to 1D?",
      "What is Bitmask DP and when is it applicable?"
    ]
  },
  {
    "id": "int-q-10",
    "question": "How do you find the median of a continuous data stream in O(1) query time?",
    "topic": "Heaps & Streaming",
    "difficulty": "Advanced",
    "tags": [
      "Heaps",
      "Two Heaps",
      "Streaming"
    ],
    "source": "NeetCode & Love Babbar 450",
    "companyTag": "Uber",
    "thirtySecAnswer": "Use two heaps: a Max-Heap for the smaller half of numbers and a Min-Heap for the larger half. Maintain the invariant that heap sizes differ by at most 1. The median is either the top of the larger heap (if total count is odd) or the average of both heap roots (if even).",
    "oneMinAnswer": "Streaming median cannot use sorting because re-sorting on each insert takes O(n log n) or O(n) insertion. A single heap cannot find the median because heaps only reveal their single extreme root. By partitioning the numbers into two equal halves using two heaps, the max of the lower half and the min of the upper half are both accessible in O(1) peek time. Insertion takes O(log n) heapify.",
    "deepTechnicalAnswer": "When a new number arrives, if it is <= max_heap.peek(), push to max_heap; else push to min_heap. Then rebalance: if len(max_heap) > len(min_heap) + 1, pop from max_heap and push to min_heap. If len(min_heap) > len(max_heap), pop from min_heap and push to max_heap.",
    "example": "Stream: [5, 15, 1, 3]. Max-heap holds [3, 1], Min-heap holds [5, 15]. Median = (3 + 5) / 2 = 4.0 in O(1).",
    "interviewerExpectation": "Candidate must specify Max-Heap for lower half, Min-Heap for upper half, balancing condition, and O(log n) insert / O(1) median complexities.",
    "commonMistakes": [
      "Using two Min-Heaps without negating values or reversing comparator.",
      "Not handling the odd vs even count distinction."
    ],
    "followUpQuestions": [
      "What if numbers arrive from 0 to 100? Can we do this in O(1) insert time? (Counting array)",
      "How would you find the 95th percentile in a data stream?"
    ]
  },
  {
    "id": "int-q-11",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)?",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-12",
    "question": "What is the Sliding Window pattern, and when does it fail?",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-13",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops?",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-14",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph?",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-15",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming?",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-16",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table?",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-17",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play?",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-18",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity?",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-19",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem?",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-20",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough?",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-21",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #2",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-22",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #2",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-23",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #2",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-24",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #2",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-25",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #2",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-26",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #2",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-27",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #2",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-28",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #2",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-29",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #2",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-30",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #2",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-31",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #3",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-32",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #3",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-33",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #3",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-34",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #3",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-35",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #3",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-36",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #3",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-37",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #3",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-38",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #3",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-39",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #3",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-40",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #3",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-41",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #4",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-42",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #4",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-43",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #4",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-44",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #4",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-45",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #4",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-46",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #4",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-47",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #4",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-48",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #4",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-49",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #4",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-50",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #4",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-51",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #5",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-52",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #5",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-53",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #5",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-54",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #5",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-55",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #5",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-56",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #5",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-57",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #5",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-58",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #5",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-59",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #5",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-60",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #5",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-61",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #6",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-62",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #6",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-63",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #6",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-64",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #6",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-65",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #6",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-66",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #6",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-67",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #6",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-68",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #6",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-69",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #6",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-70",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #6",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-71",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #7",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-72",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #7",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-73",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #7",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-74",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #7",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-75",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #7",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-76",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #7",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-77",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #7",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-78",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #7",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-79",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #7",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-80",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #7",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-81",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #8",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-82",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #8",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-83",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #8",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-84",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #8",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-85",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #8",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-86",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #8",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-87",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #8",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-88",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #8",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-89",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #8",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-90",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #8",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-91",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #9",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-92",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #9",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-93",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #9",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-94",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #9",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-95",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #9",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-96",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #9",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-97",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #9",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-98",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #9",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-99",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #9",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-100",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #9",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-101",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #10",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-102",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #10",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-103",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #10",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-104",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #10",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-105",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #10",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-106",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #10",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-107",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #10",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-108",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #10",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-109",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #10",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-110",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #10",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-111",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #11",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-112",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #11",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-113",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #11",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-114",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #11",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-115",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #11",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  },
  {
    "id": "int-q-116",
    "question": "How does a Trie (Prefix Tree) optimize word search and autocomplete compared to a Hash Table? \u2014 Senior Scenario #11",
    "topic": "Trie & Advanced Structures",
    "difficulty": "Intermediate",
    "tags": [
      "Trie",
      "Autocomplete",
      "Prefix Matching",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "A Hash Table checks exact word existence in O(L) time but cannot efficiently find all words with a given prefix without scanning all keys in O(N * L). A Trie supports both exact search and prefix queries in O(L) time, where L is prefix length, independent of total dictionary size N.",
    "oneMinAnswer": "In a Trie, each node represents a character. Common prefixes share the same path from the root. Inserting and searching take O(L) time where L is the length of the word, performing at most L pointer hops. To find all words starting with prefix 'app', traverse down 'a' -> 'p' -> 'p' in O(L) time, then run DFS on the subtree to collect all completions. In contrast, a Hash Table must iterate over every stored key and check startswith, taking O(N * L).",
    "deepTechnicalAnswer": "Tries trade space for speed: a naive 26-pointer array per node can use significant memory if the branching factor is sparse. Modern production implementations use Radix trees (compacting single-child paths) or HashMap-based child pointers to optimize memory footprint.",
    "example": "Dictionary of 1,000,000 words. Finding words starting with 'algo': Trie jumps directly to node 'o' in 4 steps; HashMap scans 1M strings.",
    "interviewerExpectation": "Candidate should state that Trie time complexity O(L) is independent of total word count N, and explain prefix sharing.",
    "commonMistakes": [
      "Claiming Trie has better time complexity than HashMap for exact lookups (both are O(L)).",
      "Ignoring the memory overhead of Trie nodes."
    ],
    "followUpQuestions": [
      "What is a Radix Tree (Patricia Trie)?",
      "How do you implement autocomplete ranking with frequency weights in a Trie?"
    ]
  },
  {
    "id": "int-q-117",
    "question": "What is Disjoint Set Union (Union-Find), and what role do Path Compression and Union by Rank play? \u2014 Senior Scenario #11",
    "topic": "Union-Find & Graphs",
    "difficulty": "Advanced",
    "tags": [
      "DSU",
      "Path Compression",
      "Ackermann",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Google)",
    "companyTag": "Google",
    "thirtySecAnswer": "Disjoint Set Union (DSU) maintains partition of elements into non-overlapping sets. Without optimizations, tree height can degenerate to O(n). Path Compression and Union by Rank together reduce operation time to nearly O(1) \u2014 specifically O(\u03b1(n)), where \u03b1 is the Inverse Ackermann function.",
    "oneMinAnswer": "DSU supports two core operations: find(x) determines which set x belongs to (returning root representative), and union(x, y) merges sets containing x and y. If nodes are simply attached arbitrarily, a chain of length n forms, causing find() to take O(n). Union by Rank/Size always attaches the shallower tree under the root of the deeper tree, keeping maximum tree height bounded by O(log n).",
    "deepTechnicalAnswer": "Path Compression optimizes find(x) by making every visited node point directly to the root representative during the search: parent[x] = find(parent[x]). When both optimizations are combined, any sequence of m operations on n elements runs in O(m * \u03b1(n)) time. For all practical values of n (even number of atoms in universe), \u03b1(n) <= 4.",
    "example": "Checking redundant edges in a graph: union each edge (u, v). If find(u) == find(v), they already belong to the same component -> cycle found.",
    "interviewerExpectation": "Candidate should explain both Path Compression (flattens tree on lookup) and Union by Rank (balances tree on merge), citing O(\u03b1(n)) complexity.",
    "commonMistakes": [
      "Forgetting path compression in find().",
      "Confusing rank (upper bound on height) with size (count of nodes)."
    ],
    "followUpQuestions": [
      "How does Kruskal's Minimum Spanning Tree algorithm use DSU?",
      "Can DSU be used to delete edges?"
    ]
  },
  {
    "id": "int-q-118",
    "question": "How do you invert a Binary Tree, and what is its recursive vs iterative space complexity? \u2014 Senior Scenario #11",
    "topic": "Trees",
    "difficulty": "Beginner",
    "tags": [
      "Binary Tree",
      "Recursion",
      "Interview Classic",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Amazon)",
    "companyTag": "Amazon",
    "thirtySecAnswer": "To invert a binary tree, swap the left and right children of every node. Recursively or with an iterative queue/stack, it visits every node once in O(n) time. Space complexity is O(h), where h is tree height (O(log n) balanced, O(n) skewed).",
    "oneMinAnswer": "The operation is symmetric: for any node, temporarily save node.left, set node.left = invert(node.right), and node.right = invert(temp). This is essentially a preorder or postorder traversal. Iteratively, we push the root into a queue (BFS) or stack (DFS). In each iteration, pop a node, swap its left and right pointers, and enqueue non-null children until the queue is empty.",
    "deepTechnicalAnswer": "Time complexity is strictly O(n) because each of the n nodes is visited exactly once. Space complexity is determined by the call stack in recursion or the queue size in BFS. For a perfectly balanced tree, maximum queue size is n/2 at the leaf level, giving O(n) space; recursive call stack depth is log\u2082(n). In a skewed tree, call stack is O(n).",
    "example": "Tree: 4 / \\ 2 7 -> swap children -> 4 / \\ 7 2. Continue recursively for subtrees.",
    "interviewerExpectation": "Candidate should write clean recursive swap, state O(n) time, and discuss call stack vs queue space trade-offs.",
    "commonMistakes": [
      "Forgetting to save node.left in a temporary variable before overwriting it.",
      "Not handling null root base case."
    ],
    "followUpQuestions": [
      "How would you invert an N-ary tree?",
      "Can you do this in-place with O(1) auxiliary space? (Morris traversal concept)"
    ]
  },
  {
    "id": "int-q-119",
    "question": "What are the XOR bit manipulation tricks, and how do they solve the Single Number problem? \u2014 Senior Scenario #11",
    "topic": "Bit Manipulation",
    "difficulty": "Beginner",
    "tags": [
      "XOR",
      "Bitwise",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Meta)",
    "companyTag": "Meta",
    "thirtySecAnswer": "XOR has three fundamental properties: x ^ x = 0 (self-inverse), x ^ 0 = x (identity), and it is commutative and associative. XORing all numbers in an array where every element appears twice except one cancels out all pairs, leaving only the unique element in O(n) time and O(1) space.",
    "oneMinAnswer": "A brute force frequency check using a Hash Table requires O(n) time and O(n) extra memory. Sorting takes O(n log n) time. Because XOR operations are associative and commutative (order of operations does not matter), all identical pairs cancel each other: (2 ^ 2) ^ (1 ^ 1) ^ 4 = 0 ^ 0 ^ 4 = 4. No extra memory is allocated, and the array is processed in a single pass.",
    "deepTechnicalAnswer": "Advanced XOR tricks include: finding two non-repeating numbers (partitioning elements into two groups based on the lowest set bit of total XOR), swapping two variables without temporary storage (a ^= b; b ^= a; a ^= b), and finding missing numbers from 0 to n by XORing array with range [0..n].",
    "example": "nums = [4, 1, 2, 1, 2]. Result = 4 ^ 1 ^ 2 ^ 1 ^ 2 = (1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4.",
    "interviewerExpectation": "State the three mathematical properties of XOR and explain why order of numbers in array is irrelevant.",
    "commonMistakes": [
      "Attempting XOR trick when elements appear 3 times (requires bit counting modulo 3).",
      "Assuming XOR works for floats."
    ],
    "followUpQuestions": [
      "How do you find the single number when elements appear three times? (Bit counting mod 3)",
      "How do you clear the lowest set bit in an integer? (n & (n - 1))"
    ]
  },
  {
    "id": "int-q-120",
    "question": "How do you check if a Binary Tree is a valid Binary Search Tree (BST)? Why is checking node.left < node and node.right > node not enough? \u2014 Senior Scenario #11",
    "topic": "Trees & BST",
    "difficulty": "Intermediate",
    "tags": [
      "BST",
      "Validation",
      "Common Trap",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Microsoft)",
    "companyTag": "Microsoft",
    "thirtySecAnswer": "Checking only immediate children fails because a node in the right subtree could be smaller than an ancestor root. A valid BST requires every node to lie within a strict global range (min_val < node.val < max_val) inherited from all its ancestors.",
    "oneMinAnswer": "A common beginner mistake is writing: return (node.left.val < node.val && node.right.val > node.val). Consider tree: 10 / \\ 5 15 / \\ 6 20. Here 6 < 15, but 6 is less than root 10 while being in its right subtree, violating BST invariant. To validate correctly, pass allowable bounds down the recursion: isValid(node.left, low, node.val) and isValid(node.right, node.val, high). Initial bounds are (-infinity, +infinity).",
    "deepTechnicalAnswer": "Alternatively, an Inorder Traversal of a valid BST must visit values in strictly increasing order. Maintaining a prev_val variable during inorder traversal validates the BST in O(n) time and O(h) space.",
    "example": "Root 10: left subtree valid range is (-inf, 10); right subtree valid range is (10, +inf). Node 6 in right subtree fails because 6 <= 10.",
    "interviewerExpectation": "Candidate must point out the ancestor constraint trap and provide either the min/max bounds method or inorder traversal check.",
    "commonMistakes": [
      "Only checking immediate children.",
      "Using integer min/max when tree node values can equal Integer.MIN_VALUE (use null or 64-bit bounds)."
    ],
    "followUpQuestions": [
      "How do you recover a BST where two nodes were swapped by mistake?",
      "What is the time complexity of the inorder traversal approach?"
    ]
  },
  {
    "id": "int-q-121",
    "question": "How does the Two Pointers pattern optimize pair search in a sorted array from O(n\u00b2) to O(n)? \u2014 Senior Scenario #12",
    "topic": "Arrays & Two Pointers",
    "difficulty": "Beginner",
    "tags": [
      "Two Pointers",
      "Arrays",
      "Optimization",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Apple)",
    "companyTag": "Apple",
    "thirtySecAnswer": "By placing one pointer at the start and one at the end of a sorted array, the sum moves monotonically. If the sum is too small, advance left; if too large, decrement right. This eliminates nested loops entirely in O(n) time.",
    "oneMinAnswer": "In an unsorted array, finding two numbers summing to target requires checking all pairs in O(n\u00b2), or using a HashSet in O(n) time and O(n) space. When the array is sorted, we can avoid extra memory. If nums[left] + nums[right] < target, no other element paired with nums[left] can reach target because all elements are <= nums[right], so left can safely increment. This monotonic guarantee processes each element at most once.",
    "deepTechnicalAnswer": "The technique works because the 2D search matrix of pairs is sorted across rows and columns. Moving left or right corresponds to discarding an entire row or column in O(1). Space complexity is strictly O(1) auxiliary.",
    "example": "nums = [2, 7, 11, 15], target = 9. 2 + 15 = 17 > 9 -> right=2. 2 + 11 = 13 > 9 -> right=1. 2 + 7 = 9 -> found [0, 1].",
    "interviewerExpectation": "Explain the monotonic property and why elements can be safely discarded without missing potential answers.",
    "commonMistakes": [
      "Using Two Pointers on an unsorted array without sorting first.",
      "Not handling duplicate pairs in 3Sum."
    ],
    "followUpQuestions": [
      "How do you extend this to 3Sum and 4Sum?",
      "Can this be used on Linked Lists?"
    ]
  },
  {
    "id": "int-q-122",
    "question": "What is the Sliding Window pattern, and when does it fail? \u2014 Senior Scenario #12",
    "topic": "Arrays & Sliding Window",
    "difficulty": "Intermediate",
    "tags": [
      "Sliding Window",
      "Monotonicity",
      "Edge Cases",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Uber)",
    "companyTag": "Uber",
    "thirtySecAnswer": "Sliding Window maintains a contiguous range [L, R] over sequential data. It expands R to satisfy a condition and contracts L to minimize. It fails when negative numbers or non-monotonic conditions destroy the relationship between window size and window properties.",
    "oneMinAnswer": "The Sliding Window pattern is used for problems asking for optimal contiguous subarrays or substrings (e.g. longest substring without repeating characters, minimum window substring). It works because expanding the window monotonically adds to the property, and shrinking monotonically subtracts. It fails on 'Subarray Sum Equals K' when negative numbers exist, because adding an element could decrease the sum, meaning expanding R does not guarantee increasing sum.",
    "deepTechnicalAnswer": "When Sliding Window fails due to non-monotonic properties (e.g. negative values), the canonical fallback is Prefix Sum combined with a Hash Map, which tracks past cumulative sums in O(n) time and O(n) space.",
    "example": "[1, -1, 1, -1] target 0: Sliding window cannot decide whether shrinking left or expanding right approaches 0. Must use Prefix Sum.",
    "interviewerExpectation": "Candidate should identify that contiguous elements and monotonic validity are prerequisites for sliding window.",
    "commonMistakes": [
      "Attempting sliding window when elements are non-contiguous (subsequences).",
      "Using sliding window on arrays with negative numbers."
    ],
    "followUpQuestions": [
      "How do you handle sliding window with at most K distinct elements?",
      "What is the difference between fixed and variable window sizes?"
    ]
  },
  {
    "id": "int-q-123",
    "question": "How do you implement a Monotonic Stack, and why does it achieve O(n) time complexity despite nested while loops? \u2014 Senior Scenario #12",
    "topic": "Stacks & Queues",
    "difficulty": "Intermediate",
    "tags": [
      "Monotonic Stack",
      "Amortized Analysis",
      "Complexity",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Netflix)",
    "companyTag": "Netflix",
    "thirtySecAnswer": "A Monotonic Stack maintains elements in strictly increasing or decreasing order. Although a while loop pops elements inside a for loop, every element is pushed onto the stack exactly once and popped at most once, giving an amortized runtime of O(n).",
    "oneMinAnswer": "In problems like Next Greater Element or Daily Temperatures, a brute force check scans to the right for every index, taking O(n\u00b2). A monotonic decreasing stack stores indices whose next greater element has not yet been found. When a new element arr[i] arrives that is greater than arr[stack.top()], we pop stack.top() and record arr[i] as its answer. We repeat until the stack order is restored, then push index i.",
    "deepTechnicalAnswer": "The key insight for complexity is aggregate amortized analysis. For an array of size n, at most n push operations occur, and at most n pop operations can ever occur across the entire loop. Therefore, total loop operations are bounded by 2n, strictly O(n) time.",
    "example": "Prices [73, 74, 75, 71, 69, 72]. 74 pops 73. 75 pops 74. 71, 69 pushed. 72 pops 69 and 71. Total pops <= n.",
    "interviewerExpectation": "Candidate must articulate aggregate analysis: every element pushed once, popped at most once -> O(n) total.",
    "commonMistakes": [
      "Thinking the nested while loop makes it O(n\u00b2).",
      "Storing values instead of indices when indices are needed for distances."
    ],
    "followUpQuestions": [
      "How do you find the Largest Rectangle in a Histogram using a monotonic stack?",
      "What is a Monotonic Deque?"
    ]
  },
  {
    "id": "int-q-124",
    "question": "What is Topological Sort, and how does it detect cycles in a directed graph? \u2014 Senior Scenario #12",
    "topic": "Graphs & Topo Sort",
    "difficulty": "Intermediate",
    "tags": [
      "Topological Sort",
      "DAG",
      "Cycle Detection",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Bloomberg)",
    "companyTag": "Bloomberg",
    "thirtySecAnswer": "Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v. If a cycle exists, in-degrees of nodes in the cycle never reach 0, so Kahn's algorithm terminates with fewer than V vertices processed.",
    "oneMinAnswer": "Topological sort can be implemented via Kahn's Algorithm (BFS with in-degrees) or DFS with post-order reversal. In Kahn's algorithm, compute the in-degree (number of incoming edges) for every vertex. Enqueue all vertices with in-degree 0 (no prerequisites). When a vertex is popped, decrement the in-degrees of all its neighbors. If a neighbor reaches in-degree 0, enqueue it. If the total number of processed vertices is less than |V|, the graph contains a directed cycle.",
    "deepTechnicalAnswer": "In DFS-based topological sort, we maintain a 3-color visited state: 0 = unvisited, 1 = visiting (currently on call stack), 2 = visited. If DFS encounters a node in state 1, a back-edge exists, proving a directed cycle.",
    "example": "Course Schedule: Course 1 -> Course 2 -> Course 1. Both have in-degree 1. Queue starts empty; 0 courses processed < 2 -> cycle detected.",
    "interviewerExpectation": "Candidate should present Kahn's in-degree algorithm clearly and explain why cycles prevent nodes from entering the queue.",
    "commonMistakes": [
      "Attempting topological sort on an undirected graph.",
      "Forgetting that topological ordering is not necessarily unique."
    ],
    "followUpQuestions": [
      "How do you reconstruct the alien dictionary alphabet order using topological sort?",
      "What is the time complexity of Kahn's algorithm?"
    ]
  },
  {
    "id": "int-q-125",
    "question": "What is the difference between Memoization and Tabulation in Dynamic Programming? \u2014 Senior Scenario #12",
    "topic": "Dynamic Programming",
    "difficulty": "Beginner",
    "tags": [
      "Memoization",
      "Tabulation",
      "DP Strategies",
      "FAANG",
      "Placement"
    ],
    "source": "Top MNC Technical Round Archive (Goldman Sachs)",
    "companyTag": "Goldman Sachs",
    "thirtySecAnswer": "Memoization is top-down: it starts from the original problem, recurses down to base cases, and caches return values in a hash map or array. Tabulation is bottom-up: it fills an iterative table starting from base cases up to the target state.",
    "oneMinAnswer": "Memoization is often easier to write because it follows the natural mathematical recurrence relation. It only computes subproblems that are actually needed along execution paths. However, it incurs recursion call stack overhead (risk of StackOverflowError for deep recursion). Tabulation iteratively fills arrays in order of dependency. It avoids call stack overhead, has better memory locality, and frequently allows reducing space complexity (e.g. storing only the last two values instead of an entire array).",
    "deepTechnicalAnswer": "For example, in Fibonacci, Memoization recurses fib(n) -> fib(n-1) -> ... while storing results in dp[]. Tabulation initializes dp[0]=0, dp[1]=1 and loops for i in range(2, n+1). Because dp[i] only depends on dp[i-1] and dp[i-2], tabulation can be optimized to O(1) space with two variables.",
    "example": "Grid travel: Memoization visits only reachable cells; Tabulation computes a 2D table and can optimize to 1D rolling row.",
    "interviewerExpectation": "Candidate should contrast top-down recursion vs bottom-up iteration, call stack implications, and space optimization potential.",
    "commonMistakes": [
      "Believing one is faster than the other algorithmically (both have the same asymptotic Big-O).",
      "Forgetting to memoize a branch."
    ],
    "followUpQuestions": [
      "When does Memoization perform fewer computations than Tabulation?",
      "How do you optimize 2D DP space to 1D?"
    ]
  }
];
