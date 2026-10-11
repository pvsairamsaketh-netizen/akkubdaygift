import type { DayLesson, CodingExercise, ExternalResourceItem } from '../../types/academics';

/**
 * Universal Pedagogy Engine for 130 Days of Data Engineering & DSA
 * Generates structured, beginner-friendly explanations, real-world analogies,
 * verified external resources, video links, dry-run step models, and multi-tier hints.
 */

export interface TopicAnalogyInfo {
  analogy: string;
  realWorld: string;
  beginnerSummary: string;
  whatIsIt: string;
  whyWeNeedIt: string;
  howItWorks: string;
}

// Domain analogies library for all 130 Days of curriculum
export const TOPIC_ANALOGIES: Record<string, TopicAnalogyInfo> = {
  // DSA TRACK (Days 101–130)
  dsa_complexity: {
    analogy: 'Estimating travel time for a road trip: Big-O is planning for the worst traffic jam on a holiday, Big-Omega is cruising on an empty open highway, and Big-Theta is your predictable daily commute.',
    realWorld: 'Tech platforms benchmark algorithms so that serving 10,000,000 users runs in fractions of a second rather than crashing servers.',
    beginnerSummary: 'Time and space complexity measure how an algorithm\'s execution time and memory footprint grow as the input size N increases.',
    whatIsIt: 'Asymptotic notation (Big-O, Big-Theta, Big-Omega) mathematically describes algorithmic efficiency as input scale approaches infinity.',
    whyWeNeedIt: 'Without complexity analysis, code that works on 5 test items can freeze production servers when handling 5,000,000 real-world records.',
    howItWorks: 'Count the dominant operations relative to input size N, ignoring constant multipliers and smaller terms (e.g., 3N² + 5N simplifies to O(N²)).'
  },
  dynamic_arrays: {
    analogy: 'A restaurant table that automatically pulls up another matching table whenever unexpected guests arrive, doubling its seating capacity in one move.',
    realWorld: 'Python lists and C++ vectors automatically allocate contiguous memory blocks and resize with geometric doubling (amortized O(1) appends).',
    beginnerSummary: 'A dynamic array is a resizable list that allocates continuous computer memory and doubles capacity when full.',
    whatIsIt: 'A sequential data structure built on top of fixed-size contiguous memory with automatic resizing.',
    whyWeNeedIt: 'Fixed arrays require declaring memory upfront; dynamic arrays allow expanding collections dynamically with instant O(1) index access.',
    howItWorks: 'When capacity is exceeded, a new memory chunk with 2x capacity is allocated, existing elements are copied over, and the old buffer is freed.'
  },
  recursion_backtracking: {
    analogy: 'Russian nesting dolls (Matryoshka): opening smaller and smaller dolls until reaching the solid center (base case), then putting them back together in reverse order.',
    realWorld: 'Directory file explorers traversing nested folders and Sudoku solvers exploring tentative numbers before backtracking on conflicts.',
    beginnerSummary: 'Recursion is a technique where a function solves a problem by calling a smaller instance of itself until hitting a base case.',
    whatIsIt: 'Self-referential function execution driven by the call stack and base-case termination rules.',
    whyWeNeedIt: 'Simplifies divide-and-conquer logic, tree traversals, and combinatorial exploration into clean mathematical definitions.',
    howItWorks: 'Each recursive call pushes a new frame onto the thread call stack. When the base case returns, stack frames unwind in LIFO order.'
  },
  binary_search: {
    analogy: 'Opening a 1,000-page telephone directory at the exact middle (page 500). If the name is alphabetically later, throw away the first half and repeat. You find the name in just 10 flips.',
    realWorld: 'Database B-tree indexes use binary search to locate a user among 100 million rows in milliseconds.',
    beginnerSummary: 'Binary search is a divide-and-conquer algorithm that finds a target in a sorted collection in O(log N) time by repeatedly halving the search interval.',
    whatIsIt: 'A search algorithm that repeatedly divides a sorted search range in half to find a target value.',
    whyWeNeedIt: 'Searching 1,000,000 items takes up to 1,000,000 checks with linear search, but only 20 checks with binary search.',
    howItWorks: 'Calculate mid = (low + high) // 2. If arr[mid] == target, return index. If arr[mid] < target, eliminate left half. Otherwise, eliminate right half.'
  },
  sorting_algorithms: {
    analogy: 'Organizing playing cards in your hand: picking cards one by one and inserting them into their sorted position (Insertion Sort), or dividing a deck in half and merging sorted stacks (Merge Sort).',
    realWorld: 'Database query planners sort records for GROUP BY aggregations, window functions, and clustered index generation.',
    beginnerSummary: 'Sorting arranges elements in ascending or descending order to enable fast searching and organized presentation.',
    whatIsIt: 'Algorithmic procedures that systematically rearrange collection elements into strict monotonic order.',
    whyWeNeedIt: 'Sorted data enables binary search (O(log N)), accelerates duplicate elimination, and optimizes data compression.',
    howItWorks: 'Compare pairs, swap out-of-order elements, partition around pivots (Quick Sort), or merge sorted sub-arrays (Merge Sort).'
  },
  linked_lists: {
    analogy: 'A scavenger hunt where each clue box contains a prize and a written address on a piece of paper pointing to where the next box is hidden.',
    realWorld: 'Blockchain transaction blocks, browser back-and-forward history caches, and memory heap free-lists.',
    beginnerSummary: 'A linked list is a linear collection of nodes where each node stores a value and a pointer pointing to the next node in memory.',
    whatIsIt: 'A dynamic data structure where elements are connected via pointers rather than contiguous memory addresses.',
    whyWeNeedIt: 'Allows O(1) insertions and deletions at the head or tail without shifting remaining elements in memory.',
    howItWorks: 'Each node stores data and a pointer `next`. Inserting a node simply updates pointer references rather than shifting memory.'
  },
  stack_ds: {
    analogy: 'A spring-loaded stack of clean dinner plates in a cafeteria: the last plate washed and placed on top is the first plate taken by the next diner (LIFO).',
    realWorld: 'Browser "Back" navigation, IDE undo/redo buffers, compiler syntax parentheses matching, and OS call stacks.',
    beginnerSummary: 'A stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle: items are pushed and popped from the top.',
    whatIsIt: 'A restricted linear structure permitting push and pop operations exclusively at one end called the top.',
    whyWeNeedIt: 'Guarantees perfect state reversal for backtracking, matching delimiters, and managing function calls.',
    howItWorks: 'Push adds an element to the top in O(1). Pop removes the top element in O(1). Peek inspects the top element without removing it.'
  },
  queue_ds: {
    analogy: 'People standing in line at a movie ticket counter: the first person to arrive is served first, and newcomers join at the back of the line (FIFO).',
    realWorld: 'Operating system CPU task scheduling, print spoolers, and background message queues like RabbitMQ and Celery.',
    beginnerSummary: 'A queue is a linear data structure following the FIFO (First-In, First-Out) principle: items enter at the rear and exit from the front.',
    whatIsIt: 'A sequential collection where elements are enqueued at the back and dequeued from the front.',
    whyWeNeedIt: 'Preserves arrival order and fairly buffers workloads across asynchronous producers and consumers.',
    howItWorks: 'Enqueue appends to the rear pointer in O(1). Dequeue removes from the front pointer in O(1).'
  },
  hash_tables: {
    analogy: 'A coat check room at a theatre where your coat is hung on a specific hook number calculated directly from your ticket number for instant retrieval.',
    realWorld: 'Python dictionaries, Redis in-memory caches, database unique constraint indexing, and URL shorteners.',
    beginnerSummary: 'A hash table maps keys to values using a mathematical hash function, giving average O(1) instant lookups, insertions, and deletions.',
    whatIsIt: 'An associative array data structure that computes an index into an array of buckets using a hash function.',
    whyWeNeedIt: 'Provides O(1) constant-time key lookups without scanning through the entire collection.',
    howItWorks: 'Pass key through hash(key) % capacity to compute bucket index. Resolve collisions using chaining (linked lists) or open addressing.'
  },
  trees_bst: {
    analogy: 'A family tree or corporate organizational hierarchy: the CEO is at the root, and under each manager, subordinates to the left are junior while those to the right are senior.',
    realWorld: 'File system folder directory trees, HTML DOM tree parsers, and database B-Tree index structures.',
    beginnerSummary: 'A Binary Search Tree (BST) is a hierarchical node structure where every node\'s left subtree contains smaller values and right subtree contains larger values.',
    whatIsIt: 'A hierarchical node collection where each parent has at most two children adhering to the binary search invariant.',
    whyWeNeedIt: 'Maintains ordered data with dynamic insertions, deletions, and lookups in O(log N) average time.',
    howItWorks: 'Start at root. If target < node, traverse left. If target > node, traverse right. Inorder traversal (Left, Node, Right) visits keys in sorted order.'
  },
  heaps_priority_queues: {
    analogy: 'A hospital Emergency Room triage desk: doctors treat the patient with the highest medical severity first, regardless of when they walked in.',
    realWorld: 'Task scheduling by priority in operating systems, Dijkstra\'s shortest path algorithm, and finding top-K frequent streaming elements.',
    beginnerSummary: 'A heap is a specialized complete binary tree that maintains the minimum (Min-Heap) or maximum (Max-Heap) element at the root in O(1).',
    whatIsIt: 'A tree-based structure that satisfies the heap property: parent is always smaller than (Min-Heap) or greater than (Max-Heap) children.',
    whyWeNeedIt: 'Allows extracting the extreme (highest or lowest) priority element in O(log N) time with instant O(1) peek.',
    howItWorks: 'Store nodes in a compact array where node i has children at 2i+1 and 2i+2. Maintain invariants using bubble-up (insertion) and bubble-down (extraction).'
  },
  graphs: {
    analogy: 'An airline route network map: cities are vertices (nodes) and direct flights connecting them are edges, with flight durations acting as weights.',
    realWorld: 'Google Maps navigation (Dijkstra/A*), LinkedIn professional connection networks, and Apache Airflow DAG pipeline dependencies.',
    beginnerSummary: 'A graph is a network of nodes (vertices) connected by links (edges), which can be directed or undirected, weighted or unweighted.',
    whatIsIt: 'A non-linear data structure modeling pairwise relationships between arbitrary objects.',
    whyWeNeedIt: 'Models real-world networks, road maps, dependency chains, recommendation systems, and web page links.',
    howItWorks: 'Represented via Adjacency Lists or Matrices. Traversed using BFS (Queue FIFO for shortest paths) or DFS (Stack for cycle detection).'
  },
  greedy_algorithms: {
    analogy: 'A cashier dispensing change using the fewest coins possible by always handing over the largest coin denomination that fits into the remaining amount.',
    realWorld: 'Huffman file compression, minimum spanning tree construction (Kruskal/Prim), and bandwidth packet routing.',
    beginnerSummary: 'A greedy algorithm makes the locally optimal choice at each step with the hope of finding a globally optimal solution.',
    whatIsIt: 'An algorithmic paradigm that follows the problem-solving heuristic of making the locally best decision without backtracking.',
    whyWeNeedIt: 'Runs dramatically faster than brute-force and dynamic programming when greedy choice property holds.',
    howItWorks: 'Sort candidates by utility, iterate through greedily, and append choices that satisfy problem constraints.'
  },
  dynamic_programming: {
    analogy: 'Writing 1 + 1 + 1 + 1 = 4 on paper. If someone adds another "+ 1" to the end, you don\'t recount everything; you remember 4 and add 1 to get 5. Storing past results is memoization.',
    realWorld: 'Shortest path computation in Google Maps, text diff engines (Git diff / Longest Common Subsequence), and portfolio allocation algorithms.',
    beginnerSummary: 'Dynamic Programming breaks complex problems into overlapping subproblems, solves each subproblem once, and caches the results to avoid redundant work.',
    whatIsIt: 'An algorithmic optimization method combining mathematical induction with result caching (memoization or tabulation).',
    whyWeNeedIt: 'Transforms intractable exponential O(2ᴺ) brute-force recursion into efficient polynomial O(N) or O(N²) execution.',
    howItWorks: 'Identify recurrence relation. Cache results in a table (1D/2D array or hash map). Build solutions bottom-up or top-down.'
  },
  two_pointers: {
    analogy: 'Two inspectors walking from opposite ends of a long suspension bridge toward the center to check cables and meet at the midpoint.',
    realWorld: 'Container with most water problem, string palindrome verification, and sorting partition steps in QuickSort.',
    beginnerSummary: 'The two pointers technique uses two index pointers moving toward each other or in parallel across a collection to solve problems in O(N) time.',
    whatIsIt: 'An algorithmic pattern using multiple index coordinates to scan arrays with linear time bounds.',
    whyWeNeedIt: 'Reduces nested O(N²) loop comparisons down to single-pass O(N) linear time with O(1) space.',
    howItWorks: 'Initialize left at start and right at end. Compare elements, calculate condition, and increment left or decrement right toward target.'
  },
  sliding_window: {
    analogy: 'A photographer holding a picture frame over a wide panorama, sliding the frame horizontally to capture the best continuous view.',
    realWorld: 'Calculating 7-day moving averages of stock prices, network packet rate limiting, and longest substring without repeating characters.',
    beginnerSummary: 'Sliding window maintains a sub-segment (window) of an array or string that expands and contracts to satisfy specific criteria in O(N).',
    whatIsIt: 'A pattern that converts nested loop range checks into a dynamic continuous sub-array scan.',
    whyWeNeedIt: 'Avoids recalculating sums or sets for every subsegment from scratch by adding the new element and subtracting the evicted element.',
    howItWorks: 'Expand window right boundary. While condition is violated, contract left boundary. Record optimal window size.'
  },
  prefix_sums: {
    analogy: 'A car\'s cumulative odometer: to find out how many miles you drove between Tuesday and Friday, subtract Tuesday\'s reading from Friday\'s reading.',
    realWorld: 'Instant O(1) financial quarterly revenue checks over transaction ledgers and image processing integral images.',
    beginnerSummary: 'A prefix sum array pre-computes running totals so that any range sum query (from index i to j) can be answered in O(1) time.',
    whatIsIt: 'A pre-processed array where each index stores the cumulative sum of all elements up to that point.',
    whyWeNeedIt: 'Enables answering millions of range sum queries in O(1) time rather than O(N) per query.',
    howItWorks: 'Build prefix[i] = prefix[i-1] + arr[i]. Query range [L, R] using prefix[R] - prefix[L-1].'
  },
  tries: {
    analogy: 'A smartphone search bar or dictionary autocomplete: as you type letters, the suggestions branch down letter by letter.',
    realWorld: 'Search engine autocomplete, spell checkers, IP router routing table lookups, and DNA genome sequence matching.',
    beginnerSummary: 'A Trie (prefix tree) is a tree structure used to store strings where each node represents a character, enabling instant O(L) prefix searches.',
    whatIsIt: 'A specialized multi-way search tree optimized for storing and retrieving keys in a string alphabet dataset.',
    whyWeNeedIt: 'Allows prefix matching and dictionary search in time proportional to string length L, independent of database size.',
    howItWorks: 'Each node stores child pointers for each alphabet character and a boolean flag `is_end_of_word`.'
  },

  // DATA ENGINEERING TRACK (Days 1–100)
  python_basics: {
    analogy: 'Kitchen containers: small labeled spice jars for integers, measuring cups for floats, labeled envelopes for strings, and shopping baskets for lists.',
    realWorld: 'Python scripts ingest REST APIs, parse JSON payloads, and orchestrate database connections in data pipelines.',
    beginnerSummary: 'Python is a high-level, expressive programming language widely used in Data Engineering for ETL, data processing, and workflow orchestration.',
    whatIsIt: 'An interpreted, dynamically typed language with extensive libraries for data manipulation and distributed computing.',
    whyWeNeedIt: 'Industry standard for data engineering frameworks including PySpark, Apache Airflow, dbt, and Pandas.',
    howItWorks: 'CPython compiles human-readable code into bytecode, which runs on the CPython Virtual Machine with automatic memory management.'
  },
  sql_joins: {
    analogy: 'A wedding guest list: Sheet A has guest names and RSVP codes. Sheet B has dinner table numbers for each code. A JOIN connects each guest to their table using the shared RSVP code.',
    realWorld: 'Production analytical queries stitch together `orders`, `customers`, and `products` tables to compute revenue and customer lifetime value.',
    beginnerSummary: 'A SQL JOIN combines columns from two or more relational tables based on a related common key column.',
    whatIsIt: 'A relational database operation implementing relational algebra joins (Inner, Left, Right, Full, Cross).',
    whyWeNeedIt: 'Enables relational normalization, avoiding redundant data duplication across transactional tables.',
    howItWorks: 'The query engine evaluates join predicates using Nested Loop Joins, Hash Joins, or Sort-Merge Joins depending on dataset size.'
  },
  window_functions: {
    analogy: 'A stadium camera panning across spectators row by row, computing the running average height of each row without squashing the crowd into one number.',
    realWorld: 'Financial systems compute 7-day moving revenue averages, rank top sales reps per department, and detect transaction anomalies.',
    beginnerSummary: 'Window functions perform calculations across a set of table rows related to the current row without collapsing rows like GROUP BY does.',
    whatIsIt: 'SQL analytical functions operating over partitions and frames defined by an OVER() clause.',
    whyWeNeedIt: 'Calculates running totals, rankings, moving averages, and lead/lag differences while retaining row-level granularity.',
    howItWorks: 'Partition rows using PARTITION BY, order within partitions using ORDER BY, and evaluate aggregates over sliding row frames.'
  },
  etl_pipelines: {
    analogy: 'An industrial water treatment plant: raw river water is pumped in (Extract), filtered of contaminants and tested against quality rules (Validate), mineralized (Transform), and sent to clean city storage tanks (Load).',
    realWorld: 'Daily automated pipelines extract millions of mobile clickstream logs, clean bad data, and load curated tables into Snowflake or BigQuery.',
    beginnerSummary: 'ETL (Extract, Transform, Load) is the core engineering process of pulling data from source systems, validating and transforming it, and loading it into analytics stores.',
    whatIsIt: 'The foundational data engineering paradigm for moving and shaping raw data into clean business tables.',
    whyWeNeedIt: 'Raw application databases are unoptimized for analytics; ETL transforms messy transactional data into clean star schemas.',
    howItWorks: 'Extract from OLTP databases or APIs, filter invalid records, apply business transformations, and load idempotently into analytics tables.'
  },
  data_modeling_warehousing: {
    analogy: 'A department store layout: checkout registers record individual item sales (Fact table), while aisle directories describe Products, Customers, and Store locations (Dimension tables).',
    realWorld: 'Enterprise data warehouses structure sales and inventory data using Kimball Star Schemas to deliver sub-second BI dashboard queries.',
    beginnerSummary: 'Dimensional modeling structures data into Fact tables (numerical business metrics) and Dimension tables (contextual attributes) for fast analytical querying.',
    whatIsIt: 'The Kimball methodology of structuring analytical databases using Star and Snowflake schemas.',
    whyWeNeedIt: 'Optimizes query performance for Business Intelligence dashboards and provides business-friendly table structures.',
    howItWorks: 'Central Fact tables store foreign keys and numerical metrics. Dimension tables store surrogate keys and rich business attributes with SCD Type 1 or 2 versioning.'
  },
  pyspark_shuffles: {
    analogy: '100 postal workers sorting mail in parallel: when each worker sorts letters for their own neighborhood it is instantaneous (narrow transformation). When workers must swap letters destined for other cities, everyone stops to trade mail (expensive network shuffle).',
    realWorld: 'Large-scale big data jobs processing terabytes across AWS EC2 clusters spend up to 70% of execution time transferring data across network nodes during shuffles.',
    beginnerSummary: 'In Apache Spark, a shuffle is the physical transfer of data across cluster worker nodes when grouping, joining, or aggregating by key.',
    whatIsIt: 'The distributed repartitioning of data across cluster machines to satisfy wide transformations (groupByKey, join).',
    whyWeNeedIt: 'Essential for combining related records on the same machine, but must be minimized to avoid network and disk bottlenecks.',
    howItWorks: 'Source partitions write shuffle files to local disk; target executors fetch data over the network and sort/merge incoming partitions.'
  },
  kafka_streaming: {
    analogy: 'An airport baggage carousel: airlines constantly drop tagged bags (events) onto the belt at high speed, and passengers (consumers) pick up their bags at their own pace without stopping the carousel.',
    realWorld: 'Uber and Netflix stream ride requests and video telemetry into Kafka topics for real-time fraud detection and dynamic pricing.',
    beginnerSummary: 'Apache Kafka is a distributed event streaming platform used for publishing, storing, and consuming high-throughput real-time message streams.',
    whatIsIt: 'A distributed, partitioned, replicated commit log service providing high-throughput publish-subscribe messaging.',
    whyWeNeedIt: 'Decouples producer and consumer systems, providing buffer capacity and fault-tolerant real-time processing.',
    howItWorks: 'Producers publish events to partitioned topics. Brokers append events sequentially to disk logs. Consumer groups read messages using offsets.'
  },
  airflow_orchestration: {
    analogy: 'An automated car factory assembly line: the chassis must be welded before painting can begin, and if a robot misaligns, the system automatically retries before sounding an alarm.',
    realWorld: 'Production data teams schedule hundreds of interdependent Python, SQL, and Spark jobs with automated retries and alerting on Slack.',
    beginnerSummary: 'Apache Airflow is a platform to author, schedule, and monitor data workflows programmatically using Directed Acyclic Graphs (DAGs).',
    whatIsIt: 'A workflow orchestration engine that manages task dependencies, scheduling, retries, and execution state.',
    whyWeNeedIt: 'Prevents downstream analytics from reading half-processed data and provides automated backfills and monitoring.',
    howItWorks: 'Define pipelines as Python DAGs. Schedulers evaluate dependencies, workers execute tasks, and state is tracked in a metadata database.'
  },
  cloud_lakehouse: {
    analogy: 'A centralized national seaport: container ships unload cargo directly into standardized, version-controlled shipping containers with automated customs verification and tamper-proof audit manifests.',
    realWorld: 'Enterprises store petabytes of data on Amazon S3 or Google Cloud Storage using Delta Lake or Apache Iceberg for ACID transactions.',
    beginnerSummary: 'A Data Lakehouse combines the cost efficiency of object storage (data lake) with the ACID transaction guarantees and speed of a data warehouse.',
    whatIsIt: 'A modern storage architecture providing ACID guarantees and schema enforcement directly on cloud object storage.',
    whyWeNeedIt: 'Eliminates dual-system architectures by enabling BI and Machine Learning directly on single source-of-truth object storage.',
    howItWorks: 'Stores data in columnar Parquet files alongside a transaction log (Delta Log or Iceberg metadata) that guarantees atomic operations.'
  }
};

/**
 * Returns accurate topic category key for any given lesson across all 130 days
 */
export function getTopicKey(subject: string, title: string, dayNumber: number): string {
  const t = (title + ' ' + subject).toLowerCase();

  // DSA TRACK (Days 101–130)
  if (dayNumber >= 101) {
    if (dayNumber === 101 || t.includes('foundation') || t.includes('complexity') || t.includes('asymptotic') || t.includes('big-o')) {
      return 'dsa_complexity';
    }
    if (dayNumber === 102 || t.includes('dynamic array') || t.includes('string')) {
      return 'dynamic_arrays';
    }
    if (dayNumber === 103 || t.includes('recursion') || t.includes('backtrack')) {
      return 'recursion_backtracking';
    }
    if (dayNumber === 104 || (t.includes('binary search') && !t.includes('tree'))) {
      return 'binary_search';
    }
    if (dayNumber === 105 || t.includes('sort')) {
      return 'sorting_algorithms';
    }
    if (dayNumber === 106 || t.includes('linked list')) {
      return 'linked_lists';
    }
    if (dayNumber === 107 || t.includes('stack')) {
      return 'stack_ds';
    }
    if (dayNumber === 108 || t.includes('queue') || t.includes('deque')) {
      return 'queue_ds';
    }
    if (dayNumber === 109 || t.includes('hash') || t.includes('map')) {
      return 'hash_tables';
    }
    if (dayNumber === 110 || dayNumber === 111 || t.includes('tree') || t.includes('bst')) {
      return 'trees_bst';
    }
    if (dayNumber === 112 || t.includes('heap') || t.includes('priority')) {
      return 'heaps_priority_queues';
    }
    if (dayNumber >= 113 && dayNumber <= 115 || t.includes('graph')) {
      return 'graphs';
    }
    if (dayNumber === 116 || t.includes('greedy')) {
      return 'greedy_algorithms';
    }
    if (dayNumber >= 117 && dayNumber <= 120 || t.includes('dynamic') || t.includes('dp')) {
      return 'dynamic_programming';
    }
    if (dayNumber === 121 || t.includes('two pointer')) {
      return 'two_pointers';
    }
    if (dayNumber === 122 || t.includes('sliding window')) {
      return 'sliding_window';
    }
    if (dayNumber === 123 || t.includes('prefix')) {
      return 'prefix_sums';
    }
    if (dayNumber === 124 || t.includes('trie')) {
      return 'tries';
    }
    return 'dsa_complexity';
  }

  // DATA ENGINEERING TRACK (Days 1–100)
  if (dayNumber >= 1 && dayNumber <= 10) {
    return 'python_basics';
  }
  if (dayNumber >= 11 && dayNumber <= 15 || t.includes('join')) {
    return 'sql_joins';
  }
  if (dayNumber >= 16 && dayNumber <= 20 || t.includes('window') || t.includes('analytic')) {
    return 'window_functions';
  }
  if (dayNumber >= 21 && dayNumber <= 35 || t.includes('etl') || t.includes('pipeline')) {
    return 'etl_pipelines';
  }
  if (dayNumber >= 36 && dayNumber <= 50 || t.includes('model') || t.includes('warehouse') || t.includes('star') || t.includes('scd')) {
    return 'data_modeling_warehousing';
  }
  if (dayNumber >= 51 && dayNumber <= 70 || t.includes('spark') || t.includes('shuffle')) {
    return 'pyspark_shuffles';
  }
  if (dayNumber >= 71 && dayNumber <= 80 || t.includes('kafka') || t.includes('stream')) {
    return 'kafka_streaming';
  }
  if (dayNumber >= 81 && dayNumber <= 90 || t.includes('airflow') || t.includes('dag') || t.includes('orchestrat')) {
    return 'airflow_orchestration';
  }
  if (dayNumber >= 91 && dayNumber <= 100 || t.includes('cloud') || t.includes('lakehouse') || t.includes('delta')) {
    return 'cloud_lakehouse';
  }

  return 'python_basics';
}

/**
 * Enriches a DayLesson with full pedagogical features:
 * - Real-world analogy
 * - Clean structured beginner-friendly explanation
 * - What it is / Why we need it / How it works
 * - Verified external learning resources
 * - Video tutorial links
 * - 60-second revision bullets
 * - Why it matters in placements
 * - Mini Quiz
 */
export function getEnrichedLesson(lesson: DayLesson): DayLesson {
  const key = getTopicKey(lesson.subject, lesson.title, lesson.dayNumber);
  const info = TOPIC_ANALOGIES[key] || TOPIC_ANALOGIES.dsa_complexity;

  const enriched: DayLesson = { ...lesson };

  // 1. Real-life analogy
  if (!enriched.realLifeAnalogy) {
    enriched.realLifeAnalogy = {
      title: `${lesson.title} — Real-Life Intuition`,
      analogy: info.analogy,
      realWorldExample: info.realWorld
    };
  }

  // 2. Clean, structured beginner explanation without raw markdown clutter
  if (!enriched.beginnerExplanation) {
    enriched.beginnerExplanation = `${info.whatIsIt} ${info.whyWeNeedIt} ${info.howItWorks}`;
  }

  // 3. Why it matters in placements
  if (!enriched.whyItMattersInPlacements) {
    enriched.whyItMattersInPlacements = `This topic is heavily tested in Technical Screening and Placement rounds at top product and cloud companies (Amazon, Microsoft, Databricks, Snowflake, Uber). Interviewers test whether you understand underlying invariants, asymptotic limits, and clean edge-case handling.`;
  }

  // 4. Curated, verified external learning resources
  if (!enriched.externalResources || enriched.externalResources.length === 0) {
    const isDSA = lesson.dayNumber >= 101;
    const isSQL = lesson.subject.toLowerCase().includes('sql') || (lesson.dayNumber >= 11 && lesson.dayNumber <= 20);

    const resources: ExternalResourceItem[] = [];

    if (isDSA) {
      resources.push({
        name: 'W3Schools Data Structures',
        topic: lesson.title,
        difficulty: 'Beginner',
        estimatedTime: '12 min',
        whyUseful: 'Visual animations, step-by-step illustrations, and beginner-friendly sandbox examples.',
        url: 'https://www.w3schools.com/dsa/'
      });
      resources.push({
        name: 'GeeksforGeeks DSA Reference',
        topic: `${lesson.title} In-Depth Guide`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Detailed algorithmic trace, complexity charts, and multi-language implementation references.',
        url: 'https://www.geeksforgeeks.org/dsa-tutorial-learn-data-structures-and-algorithms/'
      });
      resources.push({
        name: 'LeetCode Placement Study Plan',
        topic: `${lesson.title} Standard Interview Problems`,
        difficulty: 'Intermediate',
        estimatedTime: '20 min',
        whyUseful: 'Curated list of standard coding questions asked in technical interview rounds with edge-case tests.',
        url: 'https://leetcode.com/problemset/all/'
      });
    } else if (isSQL) {
      resources.push({
        name: 'W3Schools SQL Tutorial',
        topic: lesson.title,
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        whyUseful: 'Interactive SQL query editor with immediate table output visualization.',
        url: 'https://www.w3schools.com/sql/'
      });
      resources.push({
        name: 'PostgreSQL Official Docs',
        topic: `${lesson.title} Engine Invariants & Query Plans`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Complete clause breakdown, syntax rules, and query optimization guidelines.',
        url: 'https://www.postgresql.org/docs/current/'
      });
    } else {
      resources.push({
        name: 'Databricks Learning Academy',
        topic: `${lesson.title} Production Architecture`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Authoritative data engineering documentation and production design patterns.',
        url: 'https://www.databricks.com/learn'
      });
      resources.push({
        name: 'Apache Official Guides',
        topic: `${lesson.title} Distributed Systems Architecture`,
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        whyUseful: 'Official architectural specifications, cluster execution models, and best practices.',
        url: 'https://spark.apache.org/docs/latest/'
      });
    }

    enriched.externalResources = resources;
  }

  // 5. 60-Second Revision Bullets
  if (!enriched.oneMinuteRevision || enriched.oneMinuteRevision.length === 0) {
    enriched.oneMinuteRevision = [
      `Core Concept: ${info.whatIsIt}`,
      `Why It Matters: ${info.whyWeNeedIt}`,
      `Real-Life Metaphor: ${info.analogy.slice(0, 100)}...`,
      `Production Impact: ${info.realWorld.slice(0, 100)}...`
    ];
  }

  return enriched;
}

/**
 * Enriches a CodingExercise with complete pedagogical scaffolding:
 * - Goal statement
 * - Real-world scenario
 * - Input/Output explanations
 * - Concrete sample inputs/outputs
 * - 5-Step "How to think about it"
 * - Step-by-step problem breakdown
 * - Structured pseudocode
 * - Interactive dry run trace with variable states
 * - Brute force, better, and optimal solutions
 */
export function getEnrichedExercise(exercise: CodingExercise, _lesson?: DayLesson): CodingExercise {
  const enriched: CodingExercise = { ...exercise };

  if (!enriched.goal) {
    enriched.goal = `Process the input according to the problem constraints and return the transformed or calculated output with minimal time and memory overhead.`;
  }

  if (!enriched.realLifeScenario) {
    enriched.realLifeScenario = `In data pipelines and distributed services, this pattern occurs whenever raw untrusted data must be parsed, filtered, deduplicated, or aggregated before loading into downstream analytics tables.`;
  }

  if (!enriched.sampleInputExplanation) {
    enriched.sampleInputExplanation = exercise.inputFormat || 'A structured Python dictionary, list, or primitive value passed as function arguments.';
  }

  if (!enriched.sampleOutputExplanation) {
    enriched.sampleOutputExplanation = exercise.outputFormat || 'The transformed collection, calculated scalar, or boolean verification result.';
  }

  if (!enriched.sampleExampleInput) {
    enriched.sampleExampleInput = exercise.testCases?.[0]?.input || '{"id": 101, "val": "42"}';
  }

  if (!enriched.sampleExampleOutput) {
    enriched.sampleExampleOutput = (exercise.testCases?.[0] as any)?.expected_output || (exercise.testCases?.[0] as any)?.expectedOutput || '{"id": 101, "val": 42}';
  }

  if (!enriched.howToThinkSteps || enriched.howToThinkSteps.length === 0) {
    enriched.howToThinkSteps = [
      'Step 1: Inspect what information we receive (types, nullability, constraints).',
      'Step 2: Identify what needs to change (cleaning, calculations, ordering, conversions).',
      'Step 3: Determine what should remain unchanged (immutability, preserving unaffected keys).',
      'Step 4: Consider edge cases (empty inputs, negative values, missing keys, invalid types).',
      'Step 5: Ensure the return format exactly matches the expected signature.'
    ];
  }

  if (!enriched.breakdownSteps || enriched.breakdownSteps.length === 0) {
    enriched.breakdownSteps = [
      '1. Initialize result structure or pointers.',
      '2. Iterate through input elements or execute query join.',
      '3. Apply transformation / condition checks line by line.',
      '4. Return the verified final output.'
    ];
  }

  if (!enriched.pseudocode) {
    enriched.pseudocode = `
START function(input_data):
    IF input_data is invalid or empty:
        RETURN default / None
    
    INITIALIZE accumulator / clean_result
    FOR each item IN input_data:
        TRANSFORM and VALIDATE item
        STORE in clean_result
        
    RETURN clean_result
END
    `.trim();
  }

  if (!enriched.skillsTested || enriched.skillsTested.length === 0) {
    enriched.skillsTested = [
      'Clean Code & Readability',
      'Data Transformation & Validation',
      'Algorithmic Complexity & Efficiency',
      'Edge Case & Exception Handling'
    ];
  }

  if (!enriched.estimatedMinutes) {
    enriched.estimatedMinutes = 15;
  }

  if (!enriched.dryRunSteps || enriched.dryRunSteps.length === 0) {
    enriched.dryRunSteps = [
      {
        line: 1,
        code: 'def process_data(payload):',
        variables: { payload: '{"id": 101, "val": "42"}' },
        explanation: 'Function is invoked with the input payload argument.'
      },
      {
        line: 2,
        code: '    if not payload: return None',
        variables: { payload: '{"id": 101, "val": "42"}', is_empty: 'False' },
        explanation: 'Guard clause checks if payload is empty or None. Condition is False, so execution continues.'
      },
      {
        line: 3,
        code: '    res = {k: v for k, v in payload.items()}',
        variables: { payload: '{"id": 101, "val": "42"}', res: '{"id": 101, "val": "42"}' },
        explanation: 'Initializes the working dictionary copy to avoid mutating the original reference.'
      },
      {
        line: 4,
        code: '    res["val"] = int(res["val"])',
        variables: { 'res["val"]': '42 (int)' },
        explanation: 'Casts string representation into clean integer type.'
      },
      {
        line: 5,
        code: '    return res',
        variables: { return_value: '{"id": 101, "val": 42}' },
        explanation: 'Returns final clean record satisfying all assertions.'
      }
    ];
  }

  if (!enriched.bruteForceApproach) {
    enriched.bruteForceApproach = {
      title: 'Initial Direct Approach',
      explanation: 'Straightforward iteration through the input with immediate conditional updates.',
      code: enriched.starterCode,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)'
    };
  }

  if (!enriched.optimalApproach) {
    enriched.optimalApproach = {
      title: 'Optimal Production Implementation',
      explanation: 'Optimized logic avoiding unnecessary copies, operating with in-place validation and bounded memory.',
      code: enriched.solutionCode,
      timeComplexity: enriched.timeComplexity || 'O(N)',
      spaceComplexity: enriched.spaceComplexity || 'O(1)'
    };
  }

  return enriched;
}

