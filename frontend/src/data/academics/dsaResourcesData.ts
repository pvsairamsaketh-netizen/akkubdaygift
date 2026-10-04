// DSA Knowledge Hub, Master Resources, Cheat Sheets & Interview Database
// Sources Integrated:
// 1. Code & Debug (DSA Interview Cheat Sheet & Patterns)
// 2. Zero To Mastery (DSA Cheat Sheet & Operations)
// 3. Shushrut Sharma DSA Python (GitHub)
// 4. GeeksforGeeks Master Sheet (Index & Topic Sheets)
// 5. Striver A2Z DSA Sheet (Take U Forward 20 Modules)
// 6. Love Babbar 450 DSA Sheet
// 7. NeetCode Core Skills & 150
// 8. Apna College DSA Sheets (#1, #2, #3)
// 9. Curated YouTube Playlists (Striver & Placement series)

export interface DSASourceItem {
  id: string;
  name: string;
  category: 'Roadmap' | 'Cheat Sheet' | 'GitHub' | 'Master Index' | 'Video' | 'Spreadsheet';
  url: string;
  description: string;
  highlights: string[];
  coveragePercent: number;
  mappedDays: string;
  verified: boolean;
}

export interface DSAComplexityItem {
  structure: string;
  avgAccess: string;
  avgSearch: string;
  avgInsert: string;
  avgDelete: string;
  worstAccess: string;
  worstSearch: string;
  worstInsert: string;
  worstDelete: string;
  spaceComplexity: string;
  notes: string;
  realWorldUse: string;
}

export interface DSAPatternDetail {
  id: string;
  name: string;
  category: string;
  oneLiner: string;
  whenToUse: string;
  howToIdentify: string;
  keywords: string[];
  clues: string[];
  inputCharacteristics: string;
  outputCharacteristics: string;
  commonTraps: string[];
  bruteForceSignal: string;
  optimizationSignal: string;
  timeComplexity: string;
  spaceComplexity: string;
  classicProblems: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; platform: string; url?: string }[];
  codeTemplatePython: string;
}

export interface DSAInterviewMasterItem {
  id: string;
  question: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  source: string;
  thirtySecAnswer: string;
  oneMinAnswer: string;
  deepTechnicalAnswer: string;
  example: string;
  interviewerExpectation: string;
  commonMistakes: string[];
  followUpQuestions: string[];
}

export interface DSACheatSheetDetail {
  id: string;
  topic: string;
  oneLineDefinition: string;
  whatIsIt: string;
  analogy: string;
  whenToUse: string;
  interviewRecognition: string;
  commonPatterns: string[];
  coreOperations: { op: string; complexity: string; desc: string }[];
  timeComplexity: string;
  spaceComplexity: string;
  pythonSyntax: string;
  cppSyntax: string;
  javaSyntax: string;
  commonAlgorithms: string[];
  commonInterviewQs: string[];
  commonProblems: string[];
  commonMistakes: string[];
  edgeCases: string[];
  interviewFollowUps: string[];
  sixtySecRevision: string;
  relatedTopics: string[];
}

export interface DSAVideoMasterclass {
  id: string;
  title: string;
  channel: string;
  url: string;
  videoId?: string;
  playlistId?: string;
  description: string;
  duration?: string;
  topics: string[];
  thumbnailUrl?: string;
  level: 'Beginner' | 'All Levels' | 'Intermediate';
}

export const DSA_VIDEO_MASTERCLASSES: DSAVideoMasterclass[] = [
  {
    id: 'campusx-python-dsa',
    title: 'Data Structures and Algorithms in Python — Full Course',
    channel: 'CampusX (Nitish Singh)',
    url: 'https://www.youtube.com/watch?v=f9Aje_cN_CY',
    videoId: 'f9Aje_cN_CY',
    description: 'The celebrated 10+ hour comprehensive masterclass teaching DSA in Python from absolute fundamentals, memory management, OOP pointers, to advanced algorithms.',
    duration: '10h 30m',
    topics: ['Python DSA', 'OOP in Python', 'Linked Lists', 'Stacks & Queues', 'Searching & Sorting', 'Trees'],
    thumbnailUrl: 'https://img.youtube.com/vi/f9Aje_cN_CY/hqdefault.jpg',
    level: 'Beginner'
  },
  {
    id: 'python-dsa-playlist-vkdzt',
    title: 'Python Data Structures & Algorithms Complete Playlist',
    channel: 'Python DSA Master Series',
    url: 'https://www.youtube.com/playlist?list=PLVkDztYhxUGH9AubH9hLy_JYam8EZ9VKs',
    playlistId: 'PLVkDztYhxUGH9AubH9hLy_JYam8EZ9VKs',
    description: 'Structured multi-part Python video playlist covering essential placement concepts with clean code walk-throughs and complexity breakdowns.',
    duration: 'Full Playlist',
    topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Recursion', 'Binary Trees'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&q=80',
    level: 'Beginner'
  },
  {
    id: 'dsa-placement-playlist-hp5rs',
    title: 'Complete DSA & Placement Problem Solving Playlist',
    channel: 'Placement DSA Series',
    url: 'https://www.youtube.com/playlist?list=PLhP5RsB7fhE3eB5L3KXR7CH7tyP1NP7yL',
    playlistId: 'PLhP5RsB7fhE3eB5L3KXR7CH7tyP1NP7yL',
    description: 'Curated problem-solving video playlist detailing high-frequency interview questions, pattern recognition, and step-by-step whiteboard explanations.',
    duration: 'Full Playlist',
    topics: ['Two Pointers', 'Sliding Window', 'Dynamic Programming', 'Graph Algorithms'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc6114ebce6?w=500&q=80',
    level: 'Intermediate'
  },
  {
    id: 'freecodecamp-python-dsa',
    title: 'Data Structures and Algorithms in Python — Full Course for Beginners',
    channel: 'freeCodeCamp / Jovian',
    url: 'https://www.youtube.com/watch?v=-PPCDEOOYF0',
    videoId: '-PPCDEOOYF0',
    description: 'In-depth 12+ hour practical walkthrough covering Binary Search, Balanced BSTs, Hash Tables, Dynamic Programming, Subarray optimizations, and Graph traversals.',
    duration: '12h 45m',
    topics: ['Binary Search', 'BST & Traversals', 'Hash Tables', 'Divide & Conquer', 'Dynamic Programming', 'Graphs'],
    thumbnailUrl: 'https://img.youtube.com/vi/-PPCDEOOYF0/hqdefault.jpg',
    level: 'All Levels'
  },
  {
    id: 'youtube-striver-tuf',
    title: 'Take U Forward / Striver Complete SDE DSA Playlist',
    channel: 'take U forward (Striver)',
    url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
    playlistId: 'PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
    description: 'Detailed, whiteboard-driven video explanations for algorithmic problem solving, recursion trees, and optimal data structure design for FAANG placement.',
    duration: 'Complete Playlist',
    topics: ['Recursion Trees', 'Dynamic Programming', 'Graphs', 'Trees', 'Arrays & Strings'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
    level: 'All Levels'
  }
];

export const DSA_SOURCES: DSASourceItem[] = [
  {
    id: 'code-and-debug',
    name: 'Code & Debug',
    category: 'Cheat Sheet',
    url: 'https://codeanddebug.in/blog/dsa-interview-cheat-sheet/',
    description: 'High-signal placement cheat sheet outlining core algorithmic patterns, brute force vs optimal transitions, and interview recognition clues.',
    highlights: ['Two Pointers & Sliding Window', 'Monotonic Stack patterns', 'Binary Search on Answer', 'Interview follow-up templates'],
    coveragePercent: 100,
    mappedDays: 'Days 102–104, 107, 121–123',
    verified: true
  },
  {
    id: 'zero-to-mastery',
    name: 'Zero To Mastery (ZTM)',
    category: 'Cheat Sheet',
    url: 'https://zerotomastery.io/cheatsheets/data-structures-and-algorithms-cheat-sheet/',
    description: 'Comprehensive operational cheat sheet detailing Big-O notation, operation complexities, trade-offs, and algorithm selection guidelines.',
    highlights: ['Average vs Worst-case Big-O', 'Data structure trade-offs', 'Dynamic Array vs Linked List', 'Sorting algorithm selection chart'],
    coveragePercent: 100,
    mappedDays: 'Days 101, 104, 106–112',
    verified: true
  },
  {
    id: 'shushrut-sharma',
    name: 'Shushrut Sharma DSA Python',
    category: 'GitHub',
    url: 'https://github.com/shushrutsharma/Data-Structures-and-Algorithms-Python',
    description: 'Practical, clean Python implementations of classic data structures, traversals, divide-and-conquer, and recursion trees.',
    highlights: ['Clean Pythonic implementations', 'Tree & Graph traversals', 'Divide and conquer models', 'Recursion stack breakdowns'],
    coveragePercent: 100,
    mappedDays: 'Days 105, 106, 110, 113–115',
    verified: true
  },
  {
    id: 'gfg-master-sheet',
    name: 'GeeksforGeeks Master Sheet',
    category: 'Master Index',
    url: 'https://www.geeksforgeeks.org/gfg-academy/geeksforgeeks-master-sheet-list-of-all-cheat-sheets/',
    description: 'Curated index of 50-question topic sheets across Arrays, Strings, Trees, and Dynamic Programming with extensive company archives.',
    highlights: ['50-Problem topic-wise sheets', 'Company-tagged archives', 'SDE sheet roadmaps', 'Extensive edge-case archives'],
    coveragePercent: 100,
    mappedDays: 'Days 101–130 Unified',
    verified: true
  },
  {
    id: 'striver-a2z',
    name: "Striver's A2Z DSA Sheet",
    category: 'Roadmap',
    url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
    description: 'Industry-standard 20-module preparation curriculum spanning step-by-step beginner foundations to advanced DP and Trie structures.',
    highlights: ['Step-by-step progressive roadmap', '20 Comprehensive modules', 'Optimal vs Brute force breakdowns', 'Video-guided explanations'],
    coveragePercent: 100,
    mappedDays: 'Days 101–130 Core Curriculum',
    verified: true
  },
  {
    id: 'love-babbar',
    name: 'Love Babbar 450 DSA Sheet',
    category: 'Roadmap',
    url: 'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view',
    description: 'The celebrated 450 placement-oriented question roadmap covering every fundamental algorithm tested in Indian product engineering interviews.',
    highlights: ['450 curated placement questions', 'Deep Array & Matrix coverage', 'Dynamic Programming classics', 'Standard placement questions'],
    coveragePercent: 100,
    mappedDays: 'Days 102–125 Practice Bank',
    verified: true
  },
  {
    id: 'neetcode-core',
    name: 'NeetCode Core Skills & 150',
    category: 'Roadmap',
    url: 'https://neetcode.io/practice/practice/coreSkills',
    description: 'Pattern-first roadmap categorizing LeetCode questions into 18 foundational patterns like Sliding Window, Fast/Slow Pointers, and Top-K.',
    highlights: ['Pattern-based problem grouping', 'Visual intuition roadmaps', 'Clean Pythonic patterns', 'Core prerequisite drills'],
    coveragePercent: 100,
    mappedDays: 'Days 102, 107, 109, 112, 121–123',
    verified: true
  },
  {
    id: 'campusx-python',
    name: 'CampusX Python DSA Masterclass',
    category: 'Video',
    url: 'https://www.youtube.com/watch?v=f9Aje_cN_CY',
    description: 'The celebrated 10+ hour comprehensive masterclass by Nitish Singh teaching DSA in Python from scratch, memory models, OOP, to full implementation.',
    highlights: ['10+ Hour deep-dive course', 'Python memory & pointer models', 'Step-by-step DS implementation', 'Placement-focused assignments'],
    coveragePercent: 100,
    mappedDays: 'Days 101–115 Python Video Core',
    verified: true
  },
  {
    id: 'python-dsa-playlist',
    name: 'Python DSA Masterclass Playlist',
    category: 'Video',
    url: 'https://www.youtube.com/playlist?list=PLVkDztYhxUGH9AubH9hLy_JYam8EZ9VKs',
    description: 'Complete Python Data Structures & Algorithms video series with dedicated modules on Arrays, Linked Lists, Stacks, Queues, Trees, and Sorting.',
    highlights: ['Full curated playlist', 'Topic-by-topic video drills', 'Python code implementation', 'Beginner-friendly pace'],
    coveragePercent: 100,
    mappedDays: 'Days 102–112 Video Lessons',
    verified: true
  },
  {
    id: 'placement-dsa-mastery',
    name: 'DSA Placement Problem Solving Series',
    category: 'Video',
    url: 'https://www.youtube.com/playlist?list=PLhP5RsB7fhE3eB5L3KXR7CH7tyP1NP7yL',
    description: 'Complete video playlist dedicated to solving standard placement coding problems across Two Pointers, Sliding Window, Trees, and Dynamic Programming.',
    highlights: ['Campus interview questions', 'Detailed whiteboard dry-runs', 'Pattern-based problem solving', 'Optimal solution walkthroughs'],
    coveragePercent: 100,
    mappedDays: 'Days 121–130 Video Walkthroughs',
    verified: true
  },
  {
    id: 'freecodecamp-dsa-full',
    name: 'Python DSA Full Course for Beginners',
    category: 'Video',
    url: 'https://www.youtube.com/watch?v=-PPCDEOOYF0',
    description: '12-hour practical video masterclass covering Binary Search, Balanced BSTs, Hash Tables, Dynamic Programming, and Graph Traversals with clean Python code.',
    highlights: ['12+ Hour comprehensive course', 'Interactive Jupyter notebooks', 'Binary Search & BST mastery', 'Dynamic Programming classics'],
    coveragePercent: 100,
    mappedDays: 'Days 104, 110–111, 117–118',
    verified: true
  },
  {
    id: 'youtube-striver-tuf',
    name: 'TUF / Striver Complete DSA Playlist',
    category: 'Video',
    url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
    description: 'Detailed, whiteboard-driven video explanations for algorithmic problem solving, recursion trees, and optimal data structure design.',
    highlights: ['Complete whiteboard walkthroughs', 'Dry-runs of complex algorithms', 'Optimal vs brute-force visual diffs'],
    coveragePercent: 100,
    mappedDays: 'All Days 101–130 Video Lessons',
    verified: true
  },
  {
    id: 'apna-college-1',
    name: 'Apna College DSA Sheet #1',
    category: 'Spreadsheet',
    url: 'https://docs.google.com/spreadsheets/u/0/d/1hXserPuxVoWMG9Hs7y8wVdRCJTcj3xMBAEYUOXQ5Xag/htmlview?pli=1',
    description: 'Student-friendly DSA problem roadmap tailored for placement rounds and university technical screenings with topic links.',
    highlights: ['Beginner to intermediate pace', 'Campus placement question mapping', 'Direct problem hyperlinks', 'Topic-wise checklists'],
    coveragePercent: 100,
    mappedDays: 'Days 101–115',
    verified: true
  },
  {
    id: 'apna-college-2',
    name: 'Apna College DSA Sheet #2',
    category: 'Spreadsheet',
    url: 'https://docs.google.com/spreadsheets/d/1MGVBJ8HkRbCnU6EQASjJKCqQE8BWng4qgL0n3vCVOxE/edit?gid=0#gid=0',
    description: 'Extended problem bank focusing on Trees, Graphs, and Dynamic Programming with detailed classification and difficulty tiers.',
    highlights: ['Advanced DSA problem sets', 'Tree & Graph interview classics', 'DP state transition practice'],
    coveragePercent: 100,
    mappedDays: 'Days 110–120',
    verified: true
  }
];

export const DSA_COMPLEXITY_TABLE: DSAComplexityItem[] = [
  {
    structure: 'Array / Python List',
    avgAccess: 'O(1)',
    avgSearch: 'O(n)',
    avgInsert: 'O(n)',
    avgDelete: 'O(n)',
    worstAccess: 'O(1)',
    worstSearch: 'O(n)',
    worstInsert: 'O(n)*',
    worstDelete: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: 'Append is amortized O(1). Insert/delete at arbitrary index shifts elements. Dynamic array resize is O(n) amortized.',
    realWorldUse: 'Sequential data, CPU cache locality, fixed tables, lookup tables.'
  },
  {
    structure: 'Singly Linked List',
    avgAccess: 'O(n)',
    avgSearch: 'O(n)',
    avgInsert: 'O(1)*',
    avgDelete: 'O(1)*',
    worstAccess: 'O(n)',
    worstSearch: 'O(n)',
    worstInsert: 'O(1)*',
    worstDelete: 'O(1)*',
    spaceComplexity: 'O(n)',
    notes: 'Insert/delete at head or known pointer is O(1). Finding the node to delete requires O(n) search.',
    realWorldUse: 'Undo buffers, music playlists, memory allocation freelists, chaining in HashMaps.'
  },
  {
    structure: 'Doubly Linked List',
    avgAccess: 'O(n)',
    avgSearch: 'O(n)',
    avgInsert: 'O(1)*',
    avgDelete: 'O(1)*',
    worstAccess: 'O(n)',
    worstSearch: 'O(n)',
    worstInsert: 'O(1)*',
    worstDelete: 'O(1)*',
    spaceComplexity: 'O(n)',
    notes: 'Deleting a given node is truly O(1) because node.prev is directly accessible. Uses extra memory per pointer.',
    realWorldUse: 'LRU Cache (paired with HashMap), browser back/forward history.'
  },
  {
    structure: 'Hash Table / Dict / Map',
    avgAccess: 'N/A',
    avgSearch: 'O(1)',
    avgInsert: 'O(1)',
    avgDelete: 'O(1)',
    worstAccess: 'N/A',
    worstSearch: 'O(n)',
    worstInsert: 'O(n)',
    worstDelete: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: 'Worst case occurs when all keys hash to the same bucket (collision storm). Modern languages use Red-Black trees for buckets (worst case O(log n)).',
    realWorldUse: 'Database indexing, symbol tables, caching, frequency counting, deduplication.'
  },
  {
    structure: 'Stack (LIFO)',
    avgAccess: 'O(n)',
    avgSearch: 'O(n)',
    avgInsert: 'O(1)',
    avgDelete: 'O(1)',
    worstAccess: 'O(n)',
    worstSearch: 'O(n)',
    worstInsert: 'O(1)',
    worstDelete: 'O(1)',
    spaceComplexity: 'O(n)',
    notes: 'Only top element is accessible in O(1) (push, pop, peek). Bottom access requires popping everything.',
    realWorldUse: 'Function call stack, syntax bracket matching, expression parsing (postfix), DFS.'
  },
  {
    structure: 'Queue (FIFO)',
    avgAccess: 'O(n)',
    avgSearch: 'O(n)',
    avgInsert: 'O(1)',
    avgDelete: 'O(1)',
    worstAccess: 'O(n)',
    worstSearch: 'O(n)',
    worstInsert: 'O(1)',
    worstDelete: 'O(1)',
    spaceComplexity: 'O(n)',
    notes: 'Enqueue at tail and dequeue at head both run in O(1). Must use collections.deque in Python, not list.pop(0) which is O(n).',
    realWorldUse: 'BFS graph traversal, task scheduling, asynchronous message buffers (Kafka, RabbitMQ).'
  },
  {
    structure: 'Binary Search Tree (Unbalanced)',
    avgAccess: 'O(log n)',
    avgSearch: 'O(log n)',
    avgInsert: 'O(log n)',
    avgDelete: 'O(log n)',
    worstAccess: 'O(n)',
    worstSearch: 'O(n)',
    worstInsert: 'O(n)',
    worstDelete: 'O(n)',
    spaceComplexity: 'O(n)',
    notes: 'Degenerates into a linked list of height n if inserted in sorted order (worst case O(n)).',
    realWorldUse: 'Theoretical baseline for hierarchical ordered lookup.'
  },
  {
    structure: 'Self-Balancing BST (AVL / Red-Black)',
    avgAccess: 'O(log n)',
    avgSearch: 'O(log n)',
    avgInsert: 'O(log n)',
    avgDelete: 'O(log n)',
    worstAccess: 'O(log n)',
    worstSearch: 'O(log n)',
    worstInsert: 'O(log n)',
    worstDelete: 'O(log n)',
    spaceComplexity: 'O(n)',
    notes: 'Rotations maintain tree height bounded by ~1.44 log₂(n) in AVL and 2 log₂(n) in Red-Black.',
    realWorldUse: 'C++ std::map / std::set, Java TreeMap, Linux kernel scheduler (CFS).'
  },
  {
    structure: 'Binary Heap (Min / Max)',
    avgAccess: 'O(1)*',
    avgSearch: 'O(n)',
    avgInsert: 'O(log n)',
    avgDelete: 'O(log n)',
    worstAccess: 'O(1)*',
    worstSearch: 'O(n)',
    worstInsert: 'O(log n)',
    worstDelete: 'O(log n)',
    spaceComplexity: 'O(n)',
    notes: 'Access to peek root (min or max) is O(1). Extracting root takes O(log n) heapify. Search requires linear scan.',
    realWorldUse: 'Dijkstra shortest path, Prim MST, Top-K elements, Median of streaming data.'
  },
  {
    structure: 'Trie (Prefix Tree)',
    avgAccess: 'O(L)',
    avgSearch: 'O(L)',
    avgInsert: 'O(L)',
    avgDelete: 'O(L)',
    worstAccess: 'O(L)',
    worstSearch: 'O(L)',
    worstInsert: 'O(L)',
    worstDelete: 'O(L)',
    spaceComplexity: 'O(N * L * Σ)',
    notes: 'L = length of key string, Σ = alphabet size (e.g. 26). Independent of total number of stored keys N.',
    realWorldUse: 'Autocomplete, spell check, IP routing (longest prefix match), T9 predictive text.'
  }
];

export const DSA_PATTERNS: DSAPatternDetail[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers (Opposite & Fast/Slow)',
    category: 'Linear Structures',
    oneLiner: 'Use two indices moving towards each other or in lockstep to avoid quadratic nested loops.',
    whenToUse: 'When searching for pairs in sorted arrays, reversing sequences, or detecting cycles in linked lists.',
    howToIdentify: 'Array/string is sorted, or problem asks for pairs/triplets with a specific sum, or palindrome validation.',
    keywords: ['sorted array', 'pair with target sum', 'reverse', 'palindrome', 'remove duplicates in-place', 'cycle detection'],
    clues: ['Array is ordered or can be sorted in O(n log n).', 'Target is a combination of two values.', 'In-place modification required.'],
    inputCharacteristics: '1D array or string, often sorted.',
    outputCharacteristics: 'Indices, boolean, or modified array length.',
    commonTraps: ['Forgetting that array must be sorted first.', 'Infinite loop when both pointers do not progress toward each other.'],
    bruteForceSignal: 'Two nested loops (for i ... for j ...) giving O(n²).',
    optimizationSignal: 'Sort first (O(n log n)) and use two pointers (O(n)) to achieve overall O(n log n) with O(1) space.',
    timeComplexity: 'O(n) after sorting',
    spaceComplexity: 'O(1)',
    classicProblems: [
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { title: '3Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum/' },
      { title: 'Container With Most Water', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/container-with-most-water/' },
      { title: 'Trapping Rain Water', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/' }
    ],
    codeTemplatePython: `def two_pointers(arr: list[int], target: int) -> list[int]:
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window (Fixed & Variable)',
    category: 'Arrays & Strings',
    oneLiner: 'Maintain a dynamic window [L, R] over sequential data to compute continuous range properties in linear time.',
    whenToUse: 'When asked to find the longest, shortest, or target sub-array/sub-string meeting a continuous condition.',
    howToIdentify: 'Problem explicitly mentions "continuous sub-array", "substring", "window of size k", "longest without repeating".',
    keywords: ['continuous subarray', 'substring', 'longest', 'shortest', 'at most k distinct', 'minimum window'],
    clues: ['Contiguous elements only (not subsequences).', 'Window condition is monotonic (expanding right adds state, contracting left reduces state).'],
    inputCharacteristics: 'Sequential list or string; constraints often n ≤ 10⁵.',
    outputCharacteristics: 'Max/min length, count of valid windows, or optimal substring.',
    commonTraps: ['Trying to use sliding window when elements can be non-contiguous (that is subsequence / DP).', 'Forgetting to contract the left pointer in a while loop until condition is restored.'],
    bruteForceSignal: 'Evaluating all n(n+1)/2 subarrays taking O(n²) or O(n³).',
    optimizationSignal: 'Expand R to find valid/invalid state, contract L to restore invariant -> every element visited at most twice -> O(n).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) where k is character set or window state size',
    classicProblems: [
      { title: 'Maximum Sum Subarray of Size K', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/find-maximum-minimum-sum-subarray-size-k/' },
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { title: 'Minimum Window Substring', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/' }
    ],
    codeTemplatePython: `def sliding_window(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
  },
  {
    id: 'binary-search-answer',
    name: 'Binary Search on Answer (Predicate Search)',
    category: 'Optimization & Search',
    oneLiner: 'Binary search over the answer range [min_possible, max_possible] using a monotonic feasibility check function.',
    whenToUse: 'When optimizing for "minimize the maximum" or "maximize the minimum" value satisfying constraints.',
    howToIdentify: 'Direct search is too complex, but given a proposed answer X, verifying whether X is valid takes simple O(n) greedy time.',
    keywords: ['minimize the maximum', 'maximize the minimum', 'allocate books', 'split array largest sum', 'koko eating bananas'],
    clues: ['Feasibility function check(x) is monotonic: if true for X, true for all values > X (or vice-versa).', 'Answer lies in a bounded numeric range.'],
    inputCharacteristics: 'Array of capacities, costs, or work allocations.',
    outputCharacteristics: 'Optimal scalar threshold.',
    commonTraps: ['Integer overflow when computing mid = (low + high) // 2 (use low + (high - low) // 2).', 'Off-by-one errors with low <= high vs low < high.'],
    bruteForceSignal: 'Linear search testing every possible answer from 1 to max_val taking O(max_val * n).',
    optimizationSignal: 'Binary search reduces answer space from max_val to log₂(max_val) checks -> O(n * log(max_val)).',
    timeComplexity: 'O(n * log(max_val))',
    spaceComplexity: 'O(1)',
    classicProblems: [
      { title: 'Koko Eating Bananas', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' },
      { title: 'Split Array Largest Sum / Painter Partition', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/split-array-largest-sum/' }
    ],
    codeTemplatePython: `def binary_search_answer(piles: list[int], h: int) -> int:
    def can_finish(speed: int) -> bool:
        return sum((p + speed - 1) // speed for p in piles) <= h

    low, high = 1, max(piles)
    ans = high
    while low <= high:
        mid = low + (high - low) // 2
        if can_finish(mid):
            ans = mid
            high = mid - 1  # try smaller speed
        else:
            low = mid + 1   # speed too slow
    return ans`
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack (Next Greater / Smaller)',
    category: 'Linear Structures',
    oneLiner: 'Maintain a stack whose elements are strictly increasing or decreasing to resolve nearest range boundaries in O(n).',
    whenToUse: 'Finding the Next Greater Element, Previous Smaller Element, or largest rectangle under histograms.',
    howToIdentify: 'For each element, you need to know the first element to its right or left that is greater or smaller than it.',
    keywords: ['next greater element', 'daily temperatures', 'largest rectangle', 'trapping rain water', 'stock span'],
    clues: ['Needs nearest boundary for every position.', 'Nested loop to the right gives O(n²), stack reduces to O(n).'],
    inputCharacteristics: '1D array of integers/heights.',
    outputCharacteristics: 'Array of indices, distances, or areas.',
    commonTraps: ['Choosing the wrong monotonicity (increasing vs decreasing).', 'Forgetting to handle elements that have no greater element (default -1).'],
    bruteForceSignal: 'Scanning rightwards from index i until element > arr[i] -> O(n²).',
    optimizationSignal: 'Each index pushed and popped at most once -> O(n) total amortized.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    classicProblems: [
      { title: 'Daily Temperatures', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/daily-temperatures/' },
      { title: 'Next Greater Element I & II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/next-greater-element-ii/' },
      { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' }
    ],
    codeTemplatePython: `def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []  # stores indices
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = nums[i]
        stack.append(i)
    return res`
  },
  {
    id: 'top-k-heap',
    name: 'Top-K Elements via Heap / Priority Queue',
    category: 'Heaps & Sorting',
    oneLiner: 'Maintain a Min-Heap of size K to find the K largest items in O(n log k) instead of sorting in O(n log n).',
    whenToUse: 'When you need the K-th largest/smallest or top-K frequent elements from a large or streaming dataset.',
    howToIdentify: 'Mentions "K largest", "K smallest", "K most frequent", "merge K sorted lists".',
    keywords: ['k-th largest', 'top k frequent', 'median of stream', 'merge k sorted lists'],
    clues: ['K is much smaller than N (k << n).', 'Streaming input where total N is unknown upfront.'],
    inputCharacteristics: 'Array of size N or infinite stream.',
    outputCharacteristics: 'List of K items or single scalar.',
    commonTraps: ['Using Max-Heap for K-largest (requires size N -> O(n log n)). Use Min-Heap of size K instead.'],
    bruteForceSignal: 'Sorting the entire array O(n log n).',
    optimizationSignal: 'Maintain size K min-heap -> push and pop when size > K -> O(n log k) time, O(k) memory.',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    classicProblems: [
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { title: 'Top K Frequent Elements', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { title: 'Find Median from Data Stream', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-median-from-data-stream/' }
    ],
    codeTemplatePython: `import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`
  },
  {
    id: 'dynamic-programming-patterns',
    name: 'Dynamic Programming (0/1 Knapsack, LCS, Intervals)',
    category: 'Advanced Algorithms',
    oneLiner: 'Break a complex problem into overlapping subproblems and store intermediate results to avoid exponential recalculations.',
    whenToUse: 'Optimization problems with optimal substructure and overlapping subproblems (e.g. max profit, min steps, count ways).',
    howToIdentify: 'Choice at each step affects future choices; greedy fails; problem asks for max, min, or total ways.',
    keywords: ['maximum profit', 'minimum operations', 'number of ways', 'longest common subsequence', 'coin change'],
    clues: ['At each element i, you can either take or skip.', 'Future choices depend only on remaining capacity or current state.'],
    inputCharacteristics: 'Arrays of weights/values or two strings.',
    outputCharacteristics: 'Optimal scalar or count of combinations.',
    commonTraps: ['Confusing DP with Greedy when local optimal does not guarantee global optimal.', 'Not identifying the correct base cases.'],
    bruteForceSignal: 'Recursion tree with repeated branches -> 2ⁿ time complexity.',
    optimizationSignal: 'Memoization (top-down) or Tabulation (bottom-up) collapses branches into O(N * Capacity) or O(N * M).',
    timeComplexity: 'O(N * W) or O(N * M)',
    spaceComplexity: 'O(W) with rolling array space optimization',
    classicProblems: [
      { title: 'Climbing Stairs', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { title: 'Coin Change', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/' },
      { title: 'Longest Common Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { title: '0/1 Knapsack Problem', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/' }
    ],
    codeTemplatePython: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`
  }
];

export const DSA_INTERVIEW_MASTER_QUESTIONS: DSAInterviewMasterItem[] = [
  {
    id: 'int-q1',
    question: 'How does a HashMap achieve O(1) average lookup time, and what causes it to degrade to O(n)?',
    topic: 'Hashing & Tables',
    difficulty: 'Beginner',
    tags: ['Conceptual', 'Complexity', 'Interview Classic'],
    source: 'Zero To Mastery & Code and Debug',
    thirtySecAnswer: 'A HashMap applies a hash function to keys to generate an array bucket index in O(1). If collisions occur, items chain in linked lists. On average with good load factors, chains remain length O(1). If many keys collide into the same bucket, lookup degrades to O(n) linear scanning.',
    oneMinAnswer: 'Under the hood, a HashMap is an array of buckets. When you insert a key, its hash code is computed and mapped to a bucket index modulo array capacity. If two distinct keys map to the same bucket (a collision), chaining or open addressing is used. In languages like Java 8+, once a bucket chain exceeds 8 items, it converts into a Red-Black tree to guarantee O(log n) worst-case. Resizing occurs when the load factor exceeds 0.75, doubling the array capacity to maintain O(1) performance.',
    deepTechnicalAnswer: 'The core guarantee relies on the Uniform Hashing Assumption: keys are distributed uniformly across buckets. Degradation to O(n) happens either due to malicious HashDoS attacks (crafted colliding keys) or poor hash code implementations returning constant values. Python implements open addressing with pseudo-random probing, while Java uses separate chaining with treeification beyond threshold 8. Dynamic resizing requires re-allocating memory and rehashing entries, giving amortized O(1) insertion.',
    example: 'Storing user_id "u402" -> hash("u402") % 16 = index 3. Fast direct array pointer jump arr[3].',
    interviewerExpectation: 'Candidate must mention hash functions, modulo index calculation, collisions, chaining/open addressing, and load factor resizing.',
    commonMistakes: ['Claiming HashMap lookup is strictly O(1) in the worst case.', 'Not knowing what load factor means.'],
    followUpQuestions: ['What is the difference between open addressing and separate chaining?', 'How does Java 8 mitigate HashDoS attacks using TreeNodes?']
  },
  {
    id: 'int-q2',
    question: 'Why is quicksort often preferred in practice over mergesort, even though mergesort has guaranteed O(n log n) worst-case?',
    topic: 'Sorting & Searching',
    difficulty: 'Intermediate',
    tags: ['Comparison', 'Optimization', 'Systems'],
    source: 'Zero To Mastery DSA & Striver A2Z',
    thirtySecAnswer: 'Quicksort is an in-place sort with an auxiliary space complexity of O(log n) call stack, whereas mergesort requires O(n) extra buffer space. Additionally, quicksort exhibits superior CPU cache locality during in-place partition swaps.',
    oneMinAnswer: 'While mergesort guarantees O(n log n) in all cases, it requires allocating an extra temporary array of size O(n) for merging, which incurs significant memory allocation overhead. Quicksort partitions the array in-place, yielding great spatial locality that maximizes CPU L1/L2 cache hits. In practice, randomized pivot selection or median-of-three makes quicksort worst-case O(n²) virtually impossible on random inputs.',
    deepTechnicalAnswer: 'Modern systems use hybrid sorting algorithms: Introsort (used in C++ std::sort) begins with Quicksort, switches to Heapsort if the recursion depth exceeds 2*log(n) to eliminate the O(n²) worst-case trap, and uses Insertion Sort for small partitions (n < 16). Mergesort remains preferred for Linked Lists (where pointer updates are O(1) with no extra array allocation) and when stable sorting is strictly required.',
    example: 'Sorting 100M 64-bit integers: Mergesort needs ~800MB extra RAM and cache misses; Quicksort runs in-place inside L3 cache.',
    interviewerExpectation: 'Candidate should contrast auxiliary memory O(n) vs O(1), explain CPU cache locality, and recognize stability requirements.',
    commonMistakes: ['Forgetting that standard Mergesort requires O(n) additional space.', 'Not knowing why stability matters in multi-column sorting.'],
    followUpQuestions: ['When is Mergesort strictly preferred over Quicksort?', 'What is Introsort and why is it used in C++ STL?']
  },
  {
    id: 'int-q3',
    question: 'How do you detect a cycle in a singly linked list with O(1) space, and how do you find the exact start node of the cycle?',
    topic: 'Linked Lists',
    difficulty: 'Intermediate',
    tags: ['Coding', 'Pattern Recognition', 'Floyd Cycle'],
    source: 'NeetCode Core & Love Babbar 450',
    thirtySecAnswer: 'Use Floyd\'s Tortoise and Hare algorithm with two pointers: slow moves 1 step and fast moves 2 steps. If they meet, a cycle exists. To find the cycle start, reset one pointer to the head and keep the other at the meeting point; advance both 1 step at a time until they meet again.',
    oneMinAnswer: 'Floyd\'s algorithm detects cycles in O(n) time and O(1) space without modifying node structures or storing seen pointers in a hash set. Mathematically, let L1 be the distance from head to cycle entrance, and L2 be distance from entrance to meeting point. The total distance traveled by fast is 2 * slow. This algebra simplifies to L1 = k * C - L2 (where C is cycle length). Hence, walking one pointer from the head and one from the meeting point at speed 1 will intersect exactly at the cycle entrance.',
    deepTechnicalAnswer: 'If we used a HashSet to store visited pointers, space complexity would be O(n). Floyd\'s eliminates this memory cost. If the list has no cycle, fast or fast.next reaches null in at most n/2 steps. In the cyclic case, the relative speed is 1 node per iteration, so the distance between fast and slow decreases by 1 each step, guaranteeing they meet in at most C iterations once slow enters the cycle.',
    example: '1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle of length 3). Fast and slow meet at node 5. Reset slow to 1; both step by 1; they meet at node 3.',
    interviewerExpectation: 'Derive or clearly state the mathematical intuition of why resetting one pointer to head finds the entry node.',
    commonMistakes: ['Checking fast.next without checking fast is not null first (causing NullPointer/AttributeError).', 'Suggesting a HashSet when the interviewer specified O(1) space.'],
    followUpQuestions: ['How can you determine the length of the cycle?', 'Can this same concept be applied to find the duplicate number in an array? (LeetCode 287)']
  },
  {
    id: 'int-q4',
    question: 'When should you use Dijkstra\'s algorithm vs Breadth-First Search (BFS) vs Bellman-Ford for shortest path finding?',
    topic: 'Graphs & Shortest Path',
    difficulty: 'Advanced',
    tags: ['Comparison', 'Algorithm Selection', 'Complexity'],
    source: 'GeeksforGeeks Master Sheet & Striver A2Z',
    thirtySecAnswer: 'Use BFS when all edge weights are equal (or unweighted), running in O(V + E). Use Dijkstra when edges have non-negative weights, running in O((V + E) log V). Use Bellman-Ford when edges have negative weights or you must detect negative cycles, running in O(V * E).',
    oneMinAnswer: 'BFS guarantees shortest paths on unweighted graphs because nodes are visited in increasing order of hop distance. When edges carry unequal positive weights, BFS fails because a multi-hop path may have smaller total weight than a single high-weight edge; Dijkstra fixes this by using a priority queue (min-heap) to greedily relax edges in order of total path weight. However, Dijkstra assumes edge relaxation is greedy and monotonic, so negative edge weights break it. Bellman-Ford relaxes all edges V-1 times and detects negative cycles on the V-th pass.',
    deepTechnicalAnswer: 'Dijkstra with Fibonacci heap achieves O(E + V log V), while with a standard binary heap it is O((V + E) log V). If a graph is a Directed Acyclic Graph (DAG), you can find single-source shortest paths in O(V + E) by topological sorting regardless of negative weights. For all-pairs shortest path, Floyd-Warshall is used in O(V³) dynamic programming.',
    example: 'Road navigation network where road segments have travel durations (positive): Dijkstra. Social network degrees of separation (unweighted): BFS. Financial arbitrage detection (currency conversions with negative logs): Bellman-Ford.',
    interviewerExpectation: 'Candidate should state time complexity for all three, cite the unweighted vs weighted vs negative-weight criteria, and explain why Dijkstra fails on negative weights.',
    commonMistakes: ['Using Dijkstra on an unweighted graph where simple BFS is faster and simpler.', 'Claiming Dijkstra works on negative edges.'],
    followUpQuestions: ['Why does Dijkstra fail on graphs with negative weights?', 'How can Floyd-Warshall find all-pairs shortest paths?']
  }
];

export const DSA_MASTER_CHEAT_SHEETS: DSACheatSheetDetail[] = [
  {
    id: 'cs-arrays',
    topic: 'Arrays & Dynamic Arrays',
    oneLineDefinition: 'Contiguous block of fixed or expandable memory providing O(1) indexed access.',
    whatIsIt: 'An array stores elements of identical type in consecutive memory locations. In Python, a list is an array of object references that automatically resizes with geometric growth (amortized O(1) append).',
    analogy: 'Numbered lockers lined up in a school corridor. To reach locker #42, you jump directly to its position with zero searching.',
    whenToUse: 'When elements have fixed order, random indexed access is frequent, and memory cache locality is critical.',
    interviewRecognition: 'Keywords like "sorted", "contiguous subarray", "find pair", "two pointers", "sliding window".',
    commonPatterns: ['Two Pointers (Left/Right)', 'Sliding Window', 'Prefix Sum', 'Kadane\'s Algorithm', 'Dutch National Flag'],
    coreOperations: [
      { op: 'Lookup by Index arr[i]', complexity: 'O(1)', desc: 'Direct pointer calculation: base_addr + i * size' },
      { op: 'Append / push_back', complexity: 'Amortized O(1)', desc: 'Fast insert at end; triggers resize when capacity full' },
      { op: 'Insert at index i', complexity: 'O(n)', desc: 'Requires shifting (n - i) elements to the right' },
      { op: 'Delete from index i', complexity: 'O(n)', desc: 'Requires shifting (n - i - 1) elements to the left' }
    ],
    timeComplexity: 'Access: O(1) | Search: O(n) | Insert: O(n) | Delete: O(n)',
    spaceComplexity: 'O(n) linear contiguous memory',
    pythonSyntax: `arr = [1, 2, 3]
arr.append(4)       # O(1)
arr.insert(1, 99)   # O(n)
val = arr[2]        # O(1)
arr.pop()           # O(1)`,
    cppSyntax: `std::vector<int> arr = {1, 2, 3};
arr.push_back(4);    // Amortized O(1)
arr.insert(arr.begin() + 1, 99); // O(n)
int val = arr[2];    // O(1)
arr.pop_back();      // O(1)`,
    javaSyntax: `ArrayList<Integer> arr = new ArrayList<>();
arr.add(1);          // Amortized O(1)
arr.add(1, 99);      // O(n)
int val = arr.get(2);// O(1)
arr.remove(arr.size() - 1); // O(1)`,
    commonAlgorithms: ['Binary Search', 'Kadane\'s Max Subarray', 'QuickSelect', 'Counting Inversions'],
    commonInterviewQs: ['Two Sum', 'Trapping Rain Water', 'Product of Array Except Self', 'Merge Intervals'],
    commonProblems: ['Rotate Array by K steps', 'Move Zeroes to End', 'Next Permutation', 'Subarray Sum Equals K'],
    commonMistakes: ['Modifying array while iterating over it.', 'Off-by-one errors with array bounds.'],
    edgeCases: ['Empty array []', 'Single element [x]', 'All identical elements [5, 5, 5]', 'Negative numbers when computing sums'],
    interviewFollowUps: ['Can we do this in-place without auxiliary memory?', 'Can we avoid sorting to improve from O(n log n) to O(n)?'],
    sixtySecRevision: 'Array = contiguous memory -> O(1) index access, O(n) insertion/deletion. Dynamic arrays double capacity on overflow for O(1) amortized append. Use Two Pointers on sorted arrays, Sliding Window on contiguous subarrays, Prefix Sum for range sum queries.',
    relatedTopics: ['Strings', 'Sorting', 'Two Pointers', 'Sliding Window', 'Prefix Sum']
  },
  {
    id: 'cs-trees',
    topic: 'Binary Trees & BST',
    oneLineDefinition: 'Hierarchical node structure where each node has at most two children (left and right).',
    whatIsIt: 'A tree is a non-linear data structure with a root node and subtrees. A Binary Search Tree (BST) enforces the invariant: left subtree values < node value < right subtree values, enabling O(log n) average lookup.',
    analogy: 'A company organizational chart or a family genealogy tree with branching relationships.',
    whenToUse: 'Hierarchical relationships, file system directories, fast sorted lookups without array reallocations.',
    interviewRecognition: 'Keywords like "root to leaf path", "lowest common ancestor", "height", "level order", "diameter".',
    commonPatterns: ['DFS Traversals (Inorder, Preorder, Postorder)', 'BFS (Level Order with Queue)', 'Tree DP (Postorder return state)', 'LCA recursion'],
    coreOperations: [
      { op: 'BST Search', complexity: 'Avg O(log n) / Worst O(n)', desc: 'Branch left if target < val, right if target > val' },
      { op: 'BST Insert', complexity: 'Avg O(log n) / Worst O(n)', desc: 'Traverse to leaf position and attach new node' },
      { op: 'Tree Traversal (all nodes)', complexity: 'O(n)', desc: 'Visits every node exactly once' },
      { op: 'Height Calculation', complexity: 'O(n)', desc: '1 + max(height(left), height(right))' }
    ],
    timeComplexity: 'Search: O(log n) avg | Insert: O(log n) avg | Delete: O(log n) avg',
    spaceComplexity: 'O(h) call stack memory where h is tree height (log n for balanced, n for skewed)',
    pythonSyntax: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder traversal (Left, Root, Right) -> sorted for BST
def inorder(root):
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []`,
    cppSyntax: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
    javaSyntax: `public class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}`,
    commonAlgorithms: ['Morris Traversal (O(1) space)', 'Lowest Common Ancestor (LCA)', 'Diameter of Binary Tree', 'Serialize and Deserialize'],
    commonInterviewQs: ['Validate Binary Search Tree', 'Lowest Common Ancestor of BST/BT', 'Binary Tree Level Order Traversal', 'Kth Smallest in BST'],
    commonProblems: ['Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Path Sum III', 'Construct Tree from Inorder & Preorder'],
    commonMistakes: ['Assuming checking node.left < node.val and node.right > node.val is sufficient for BST validation (must check entire subtree with min/max bounds).'],
    edgeCases: ['Null root', 'Single node tree', 'Degenerate/skewed tree (linked list)', 'Tree with negative values'],
    interviewFollowUps: ['How do you traverse without using recursion and without using an explicit stack? (Morris Traversal)', 'How do self-balancing trees (AVL/Red-Black) maintain O(log n)?'],
    sixtySecRevision: 'Binary Tree = hierarchical nodes with max 2 children. BST Invariant: Left < Root < Right. Inorder traversal of BST gives sorted order! Height calculation is O(n), search is O(log n) balanced. Use Queue for BFS (Level Order), Recursion for DFS.',
    relatedTopics: ['Binary Search Tree', 'AVL Trees', 'Recursion', 'Graphs', 'Trie']
  },
  {
    id: 'cs-graphs',
    topic: 'Graphs (BFS, DFS, Dijkstra, Topo Sort)',
    oneLineDefinition: 'Network of vertices (nodes) interconnected by edges, representing complex non-linear relationships.',
    whatIsIt: 'A graph G = (V, E) can be directed or undirected, weighted or unweighted, cyclic or acyclic. Represented either as an Adjacency List (memory efficient O(V + E)) or Adjacency Matrix (O(V²)).',
    analogy: 'Air flight routes connecting cities or mutual friendship networks on LinkedIn.',
    whenToUse: 'Dependency resolution, shortest travel paths, recommendation networks, topological ordering of build tasks.',
    interviewRecognition: 'Keywords like "connected components", "course prerequisites", "shortest path", "network delay", "bipartite".',
    commonPatterns: ['BFS for Shortest Path (unweighted)', 'DFS for Cycle Detection / Components', 'Topological Sort (Kahn\'s Algorithm)', 'Dijkstra for Weighted SP'],
    coreOperations: [
      { op: 'BFS Traversal', complexity: 'O(V + E)', desc: 'Explore level-by-level using Queue; tracks visited set' },
      { op: 'DFS Traversal', complexity: 'O(V + E)', desc: 'Deep dive using recursion or stack; backtrack when dead end' },
      { op: 'Dijkstra Shortest Path', complexity: 'O((V + E) log V)', desc: 'Greedy shortest path using Min-Heap priority queue' },
      { op: 'Topological Sort (Kahn\'s)', complexity: 'O(V + E)', desc: 'In-degree array + Queue; detects cycles if count != V' }
    ],
    timeComplexity: 'BFS/DFS: O(V + E) | Dijkstra: O((V + E) log V) | Bellman-Ford: O(V * E)',
    spaceComplexity: 'O(V + E) for adjacency list + O(V) visited set / call stack',
    pythonSyntax: `from collections import defaultdict, deque

adj = defaultdict(list)
adj[0].append(1)  # directed edge 0 -> 1

# BFS
def bfs(start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for neighbor in adj[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)`,
    cppSyntax: `std::vector<std::vector<int>> adj(V);
adj[u].push_back(v); // u -> v`,
    javaSyntax: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
adj.get(u).add(v);`,
    commonAlgorithms: ['Kahn\'s Algorithm', 'Tarjan\'s Strongly Connected Components', 'Prim & Kruskal MST', 'Floyd-Warshall'],
    commonInterviewQs: ['Number of Islands', 'Course Schedule I & II', 'Clone Graph', 'Network Delay Time'],
    commonProblems: ['Word Ladder', 'Rotting Oranges', 'Alien Dictionary', 'Cheapest Flights Within K Stops'],
    commonMistakes: ['Forgetting to mark nodes as visited, leading to infinite cycle loops.', 'Using Dijkstra on graphs with negative weights.'],
    edgeCases: ['Disconnected graph with multiple isolated components', 'Graph containing self-loops or parallel edges', 'Graph with cycles when expecting a DAG'],
    interviewFollowUps: ['How do you detect cycles in directed vs undirected graphs?', 'How would you scale this graph algorithm to billions of edges across machines?'],
    sixtySecRevision: 'Graph = Vertices + Edges. Store as Adjacency List O(V + E). Use BFS for shortest path in unweighted graphs. Use DFS for connectivity and cycle detection. Directed graph dependencies = Topological Sort (Kahn\'s with in-degrees). Weighted shortest path = Dijkstra with Min-Heap.',
    relatedTopics: ['Trees', 'Queue', 'Heap', 'Dynamic Programming', 'Union Find']
  }
];

export const PATTERN_QUIZ_QUESTIONS = [
  {
    id: 'pq-1',
    problem: 'Given an array of positive integers and a target sum S, find the minimal length of a contiguous subarray of which the sum >= S.',
    options: ['Two Pointers', 'Sliding Window', 'Binary Tree Traversal', 'Monotonic Stack'],
    correct: 'Sliding Window',
    explanation: 'The problem asks for the minimum length of a CONTIGUOUS subarray meeting a monotonic sum condition (all numbers are positive). We expand the right pointer to reach the sum >= S, then contract the left pointer to find the minimum window size.'
  },
  {
    id: 'pq-2',
    problem: 'Given daily temperatures, return an array such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature.',
    options: ['Monotonic Stack', 'Sliding Window', 'Binary Search on Answer', 'Union Find'],
    correct: 'Monotonic Stack',
    explanation: 'For each element, you must find the FIRST element to its right that is strictly greater than it. A Monotonic Decreasing Stack allows resolving this nearest greater neighbor in O(n) total time.'
  },
  {
    id: 'pq-3',
    problem: 'Koko loves to eat bananas. Given piles of bananas and H hours, find the minimum integer K such that she can eat all bananas within H hours.',
    options: ['Dynamic Programming', 'Binary Search on Answer', 'Topological Sort', 'Trie'],
    correct: 'Binary Search on Answer',
    explanation: 'The eating speed K ranges between 1 and max(piles). If Koko can finish at speed K, she can also finish at any speed > K (monotonic property). We can binary search the speed in O(n * log(max_pile)).'
  },
  {
    id: 'pq-4',
    problem: 'There are N courses labeled 0 to N-1. Some courses have prerequisites (e.g. course A must be taken before course B). Return the ordering in which you can finish all courses.',
    options: ['Topological Sort (Graph)', 'Two Pointers', 'Sliding Window', 'Dutch National Flag'],
    correct: 'Topological Sort (Graph)',
    explanation: 'Course prerequisites represent directed edges in a dependency graph. Finding a valid completion order requires a Topological Sort (Kahn\'s algorithm with in-degrees or DFS with post-order traversal).'
  }
];
