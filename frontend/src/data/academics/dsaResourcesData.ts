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

import { AUTHENTIC_PATTERN_QUIZ_BANK, type PatternQuizQuestion } from './dsaPatternQuizBank';
import { AUTHENTIC_INTERVIEW_PITCH_BANK } from './dsaInterviewPitchBank';
import { AUTHENTIC_MASTER_CHEAT_SHEETS_BANK } from './dsaMasterCheatSheetsBank';

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
  companyTag?: string;
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

export const DSA_INTERVIEW_MASTER_QUESTIONS: DSAInterviewMasterItem[] = AUTHENTIC_INTERVIEW_PITCH_BANK;
export const DSA_MASTER_CHEAT_SHEETS: DSACheatSheetDetail[] = AUTHENTIC_MASTER_CHEAT_SHEETS_BANK;
export const PATTERN_QUIZ_QUESTIONS: PatternQuizQuestion[] = AUTHENTIC_PATTERN_QUIZ_BANK;

export {
  AUTHENTIC_PATTERN_QUIZ_BANK,
  AUTHENTIC_INTERVIEW_PITCH_BANK,
  AUTHENTIC_MASTER_CHEAT_SHEETS_BANK
};
export type { PatternQuizQuestion };

