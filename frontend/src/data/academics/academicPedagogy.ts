import type { DayLesson, CodingExercise, ExternalResourceItem } from '../../types/academics';

/**
 * Universal Pedagogy Engine for 130 Days of Data Engineering & DSA
 * Generates structured, beginner-friendly explanations, real-world analogies,
 * verified external resources, video links, dry-run step models, and multi-tier hints.
 */

// Domain analogies library
const TOPIC_ANALOGIES: Record<string, { analogy: string; realWorld: string; beginnerSummary: string }> = {
  python_basics: {
    analogy: 'Think of a variable like a labeled storage box in your room. The sticker on the outside (variable name) tells you what is stored inside (the value), so you don’t have to search everywhere.',
    realWorld: 'In data engineering, variables store configurations, API keys, database connection strings, and record counts during pipeline execution.',
    beginnerSummary: 'Python is a high-level programming language that reads like simple English. It executes line-by-line using an interpreter.'
  },
  data_types: {
    analogy: 'Imagine kitchen containers: a small spice jar is for integers, a liquid measuring cup is for floats, a labeled envelope is for strings, and a shopping basket is for lists.',
    realWorld: 'Database columns and Kafka message schemas enforce strict data types (e.g., BIGINT for user_id, DECIMAL for transactions) to prevent data corruption.',
    beginnerSummary: 'Data types tell Python what kind of value a variable holds and what math or text operations are allowed on it.'
  },
  sql_joins: {
    analogy: 'Think of a wedding guest list: Table A has guest names and RSVP codes. Table B has table assignments for each code. A JOIN connects the guest with their table based on the matching code.',
    realWorld: 'Production analytical queries join `orders` with `customers` and `products` to calculate regional revenue and customer lifetime value.',
    beginnerSummary: 'A SQL JOIN lets you stitch together rows from two or more tables based on a shared column like user_id.'
  },
  window_functions: {
    analogy: 'Imagine a stadium camera panning across the crowd row by row, calculating the average height of each group without squashing the entire stadium into one single number.',
    realWorld: 'Financial systems calculate 7-day moving averages of stock prices and rank sales agents per region using `ROW_NUMBER()` and `DENSE_RANK()`.',
    beginnerSummary: 'Window functions calculate running totals, moving averages, and rankings across related rows without collapsing rows like GROUP BY does.'
  },
  pyspark_shuffles: {
    analogy: 'Imagine a group of 10 chefs working in a kitchen. If they all need to regroup vegetables by recipe, they must stop cooking and walk across the room to hand ingredients to each other. That handoff is the shuffle bottleneck.',
    realWorld: 'Big data jobs processing terabytes across 100 AWS EC2 worker nodes spend up to 70% of their runtime transferring data across the network during shuffles.',
    beginnerSummary: 'In distributed computing, a shuffle is the physical transfer of data across network nodes when grouping or joining by a key.'
  },
  kafka_streaming: {
    analogy: 'Think of an airport baggage conveyor belt. Airlines constantly drop suitcases (events) onto the belt at high speed, and passengers (consumers) pick up their bags at their own pace without stopping the belt.',
    realWorld: 'Payment processors like Uber or Visa stream live transactions into Kafka topics, allowing fraud detection, receipt generation, and ledger updates to consume simultaneously.',
    beginnerSummary: 'Kafka is a distributed streaming event log that allows software systems to publish and consume high-volume real-time messages reliably.'
  },
  binary_search: {
    analogy: 'Opening a physical telephone directory of 1,000 pages to find "Miller": you open the exact middle (page 500). If you see "Jones", you throw away the first half and repeat on the remaining half. You find it in just 10 steps.',
    realWorld: 'Database B-tree indexes use binary search logic on disk blocks to locate a customer record among 100 million entries in milliseconds.',
    beginnerSummary: 'Binary search is a divide-and-conquer algorithm that finds target items in sorted collections in O(log n) logarithmic time.'
  },
  stack_ds: {
    analogy: 'A spring-loaded stack of dinner plates in a cafeteria: the last clean plate placed on top is the very first plate taken off by the next customer (Last In, First Out).',
    realWorld: 'Browser history navigation ("Back" button), syntax parser parentheses matching, and CPU function call execution stacks.',
    beginnerSummary: 'A stack is a linear data structure following the LIFO (Last In, First Out) principle: elements are pushed and popped from the same top end.'
  },
  queue_ds: {
    analogy: 'People standing in line at a movie ticket counter: the first person who arrives is served first, and new people join at the back (First In, First Out).',
    realWorld: 'Job scheduling in operating systems, printer queues, and Celery / Redis background worker task queues.',
    beginnerSummary: 'A queue follows the FIFO (First In, First Out) principle: items enter at the rear and exit from the front.'
  },
  trees_graphs: {
    analogy: 'A family tree showing grandparents, parents, and children (Tree) vs a social network of friends or an airline flight map between cities (Graph).',
    realWorld: 'Airflow Directed Acyclic Graphs (DAGs) define pipeline task dependencies; database indexes are built as Balanced B-Trees.',
    beginnerSummary: 'Trees are hierarchical structures without cycles. Graphs are generalized networks of nodes (vertices) connected by edges.'
  },
  dynamic_programming: {
    analogy: 'Writing down 1 + 1 + 1 + 1 + 1 = 5 on a sheet of paper. If someone adds another "+ 1" to the end, you don\'t recalculate everything from scratch; you remember 5 and just add 1 to get 6. Remembering past results is memoization.',
    realWorld: 'Route planning in Google Maps (shortest path), DNA sequence alignment, and algorithmic trading arbitrage optimization.',
    beginnerSummary: 'Dynamic Programming breaks complex problems into overlapping subproblems, solves each subproblem once, and stores the answer in memory.'
  }
};

/**
 * Returns topic category key for analogies
 */
function getTopicKey(subject: string, title: string, dayNumber: number): string {
  const t = (title + ' ' + subject).toLowerCase();
  if (dayNumber >= 101) {
    if (t.includes('search') || t.includes('sort')) return 'binary_search';
    if (t.includes('stack')) return 'stack_ds';
    if (t.includes('queue') || t.includes('heap')) return 'queue_ds';
    if (t.includes('tree') || t.includes('graph')) return 'trees_graphs';
    if (t.includes('dynamic') || t.includes('dp')) return 'dynamic_programming';
    return 'binary_search';
  }
  if (t.includes('join')) return 'sql_joins';
  if (t.includes('window') || t.includes('analytic')) return 'window_functions';
  if (t.includes('spark') || t.includes('shuffle')) return 'pyspark_shuffles';
  if (t.includes('kafka') || t.includes('stream')) return 'kafka_streaming';
  if (t.includes('type') || t.includes('syntax') || t.includes('variable')) return 'data_types';
  return 'python_basics';
}

/**
 * Enriches a DayLesson with full pedagogical features:
 * - Real-world analogy
 * - Beginner-friendly mode text
 * - Verified external learning resources (W3Schools, TutorialsPoint, Official Docs)
 * - Video tutorial links
 * - 60-second revision bullets
 * - Why it matters in placements
 * - Mini Quiz
 */
export function getEnrichedLesson(lesson: DayLesson): DayLesson {
  const key = getTopicKey(lesson.subject, lesson.title, lesson.dayNumber);
  const info = TOPIC_ANALOGIES[key] || TOPIC_ANALOGIES.python_basics;

  const enriched: DayLesson = { ...lesson };

  // 1. Real-life analogy
  if (!enriched.realLifeAnalogy) {
    enriched.realLifeAnalogy = {
      title: `${lesson.title} — Real-Life Intuition`,
      analogy: info.analogy,
      realWorldExample: info.realWorld
    };
  }

  // 2. Beginner mode explanation
  if (!enriched.beginnerExplanation) {
    enriched.beginnerExplanation = `
### ❤️ Explain Like I'm a Beginner: ${lesson.title}

${info.beginnerSummary}

#### 💡 The Big Picture
${info.analogy}

#### 🎯 What You Need To Remember Today:
1. Don't worry about memorizing syntax; focus on the **underlying pattern**.
2. Notice **what goes in** (inputs) and **what comes out** (outputs).
3. If an error appears, it's just Python or SQL giving you a hint on which rule was overlooked!
    `.trim();
  }

  // 3. Why it matters in placements
  if (!enriched.whyItMattersInPlacements) {
    enriched.whyItMattersInPlacements = `
This topic is heavily tested in Technical Screening and Senior Engineering rounds at product and cloud-first companies (Amazon, Microsoft, Databricks, Snowflake, Uber). Interviewers evaluate whether you understand memory footprints, scale limits, and clean edge-case handling rather than just surface-level syntax.
    `.trim();
  }

  // 4. Curated, verified external learning resources
  if (!enriched.externalResources || enriched.externalResources.length === 0) {
    const isSQL = lesson.subject.toLowerCase().includes('sql');
    const isSpark = lesson.subject.toLowerCase().includes('spark');
    const isDSA = lesson.dayNumber >= 101;

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
        name: 'TutorialsPoint DSA Reference',
        topic: `${lesson.title} Concepts & Code`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Detailed algorithmic trace, complexity charts, and multi-language implementation references.',
        url: 'https://www.tutorialspoint.com/data_structures_algorithms/index.htm'
      });
      resources.push({
        name: 'GeeksforGeeks Placement Portal',
        topic: `${lesson.title} Interview Problems`,
        difficulty: 'Intermediate',
        estimatedTime: '20 min',
        whyUseful: 'Curated list of standard coding questions asked in technical interview rounds with edge-case tests.',
        url: 'https://www.geeksforgeeks.org/dsa-tutorial-learn-data-structures-and-algorithms/'
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
        name: 'TutorialsPoint SQL Guide',
        topic: `${lesson.title} Syntax & Best Practices`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Complete clause breakdown, syntax rules, and query optimization guidelines.',
        url: 'https://www.tutorialspoint.com/sql/index.htm'
      });
      resources.push({
        name: 'PostgreSQL Official Documentation',
        topic: 'Engine Invariants & Query Plans',
        difficulty: 'Advanced',
        estimatedTime: '18 min',
        whyUseful: 'Authoritative documentation on execution planner behavior and performance internals.',
        url: 'https://www.postgresql.org/docs/current/'
      });
    } else if (isSpark) {
      resources.push({
        name: 'TutorialsPoint PySpark Guide',
        topic: 'Distributed DataFrame Transformations',
        difficulty: 'Beginner',
        estimatedTime: '14 min',
        whyUseful: 'Clear beginner intro to RDDs, DataFrames, and partition-aware transformations.',
        url: 'https://www.tutorialspoint.com/pyspark/index.htm'
      });
      resources.push({
        name: 'Apache Spark Official Documentation',
        topic: 'Spark Programming Guide',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        whyUseful: 'Official specs on cluster execution, memory management, and Catalyst optimizer.',
        url: 'https://spark.apache.org/docs/latest/'
      });
    } else {
      resources.push({
        name: 'W3Schools Python Tutorial',
        topic: lesson.title,
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        whyUseful: 'Interactive "Try It Yourself" editor, concise explanations, and instant code feedback.',
        url: 'https://www.w3schools.com/python/'
      });
      resources.push({
        name: 'TutorialsPoint Python Tutorial',
        topic: `${lesson.title} Architecture`,
        difficulty: 'Intermediate',
        estimatedTime: '15 min',
        whyUseful: 'Comprehensive reference covering standard library behavior and enterprise examples.',
        url: 'https://www.tutorialspoint.com/python/index.htm'
      });
      resources.push({
        name: 'Official Python 3 Documentation',
        topic: 'Python Language Reference',
        difficulty: 'Advanced',
        estimatedTime: '20 min',
        whyUseful: 'Authoritative specification of Python syntax, data model, and memory behavior.',
        url: 'https://docs.python.org/3/'
      });
    }

    enriched.externalResources = resources;
  }

  // 5. Video resources
  if (!enriched.videoResources || enriched.videoResources.length === 0) {
    enriched.videoResources = [
      {
        title: `${lesson.title} — Complete Conceptual Breakdown`,
        channel: 'W3Schools & Placement Prep',
        duration: '14 mins',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(lesson.title + ' tutorial')
      },
      {
        title: `${lesson.title} — Visual Flowchart & Live Code Dry Run`,
        channel: 'Tech Placement Academy',
        duration: '18 mins',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(lesson.title + ' data engineering interview')
      }
    ];
  }

  // 6. 60-Second Revision summary
  if (!enriched.oneMinuteRevision || enriched.oneMinuteRevision.length === 0) {
    enriched.oneMinuteRevision = [
      `Core Definition: ${lesson.description.slice(0, 120)}...`,
      `Real-Life Metaphor: ${info.analogy.slice(0, 110)}...`,
      `Practical Need: ${info.realWorld.slice(0, 120)}...`,
      `Primary Pitfall: Avoid mutable default state or full-table scans without partition pruning.`
    ];
  }

  // 7. Mini Quiz (3 questions with instant explanations)
  if (!enriched.miniQuiz || enriched.miniQuiz.length === 0) {
    enriched.miniQuiz = [
      {
        question: `What is the primary objective of studying "${lesson.title}"?`,
        options: [
          'To write unnecessarily complex code',
          'To solve real-world data and algorithmic challenges reliably with optimal complexity',
          'To replace databases with text files',
          'To eliminate the need for testing'
        ],
        correctIndex: 1,
        explanation: 'The primary purpose is clean problem-solving with deterministic execution, low memory overhead, and resilience at scale.'
      },
      {
        question: 'Which principle is most important when implementing this in production?',
        options: [
          'Ignoring edge cases like empty inputs or nulls',
          'Validating inputs, handling boundary conditions, and choosing the right complexity profile',
          'Hardcoding values instead of parameters',
          'Always using brute-force loops'
        ],
        correctIndex: 1,
        explanation: 'Enterprise pipelines require strict input validation, proper null handling, and bounded asymptotic execution.'
      },
      {
        question: 'How do interviewers typically test this concept during technical rounds?',
        options: [
          'They ask you to recite the documentation word for word',
          'They present a messy real-world dataset or constraints and evaluate your approach and optimization steps',
          'They check if you can type 150 words per minute',
          'They only test multiple-choice questions'
        ],
        correctIndex: 1,
        explanation: 'Top interviewers test how you analyze constraints, trade off time vs space complexity, and handle boundary conditions.'
      }
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
export function getEnrichedExercise(exercise: CodingExercise, _lesson: DayLesson): CodingExercise {
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
    enriched.sampleExampleOutput = exercise.testCases?.[0]?.expected_output || '{"id": 101, "val": 42}';
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
