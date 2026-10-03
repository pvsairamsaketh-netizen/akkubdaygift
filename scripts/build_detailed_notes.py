#!/usr/bin/env python3
"""
Generate comprehensive, presentation-grade 100-Day Study Notes with Real-Life Analogies,
Visual Flowcharts / ASCII Architecture Drawings, Code Walkthroughs, and Placement Gotchas.
"""

import json

# Define the 100 days specifications
DAYS_SPEC = [
    # Module 1: Python for Data Engineering (Days 1-10)
    (1, "python", "Python Setup, Virtual Environments, Memory Model & Execution Pipeline",
     "Building a kitchen with dedicated utensils for each chef (virtualenv prevents cross-contamination). In CPython, variables are nametags pointing to memory addresses on the heap, not boxes holding values.",
     """+-------------------+         +------------------------+
|  Script (app.py)  |  --->   | CPython Compiler (.pyc)|
+-------------------+         +------------------------+
                                         |
                                         v
+-------------------+         +------------------------+
| CPython Heap RAM  | <---*   | Python Virtual Machine |
| (PyObject: val,   |    *--- | (Bytecode Evaluation)  |
|  refcnt, typeptr) |         +------------------------+
+-------------------+"""),
    
    (2, "python", "Primitive Types, Mutability, Identity vs Equality (is vs ==)",
     "A passport number is identity (`is`, memory location id()), while your printed name is value (`==`). Modifying an immutable integer creates a brand new passport!",
     """Stack (Variable Names)                CPython Heap Memory
+-----------------------+              +----------------------+
| a -------------------->------------> | PyLongObject (1000)  | refcnt: 1
| b -------------------->------------> | PyLongObject (1000)  | refcnt: 1 (diff addr)
+-----------------------+              +----------------------+
  (a == b is True, but a is b is False for large integers)"""),

    (3, "python", "Data Structures Deep Dive: Lists, Tuples, Sets, and Dict Hashmaps",
     "A list is an expandable book shelf that dynamically doubles when full. A dict is a mail room with 8 pigeonholes hashed by key; collisions probe linearly.",
     """Key: 'user_101' ---> hash() ---> 0x7fa2 ---> Index: hash % Capacity (e.g. 5)
Sparse Hash Table:
[0] Empty
[5] [Hash | Key Pointer | Value Pointer] ---> ('user_101', 94.50)
[7] Empty"""),

    (4, "python", "List, Dict & Set Comprehensions with Memory Considerations",
     "Packing lunch boxes in parallel assembly vs stuffing everything into a giant warehouse bag all at once.",
     """[x**2 for x in range(10_000_000)]  ===> Allocates ~80MB RAM immediately!
(x**2 for x in range(10_000_000))  ===> Allocates ~128 bytes (Lazy Generator)"""),

    (5, "python", "Functions, Closures, Decorators, *args and **kwargs",
     "A decorator is a security guard standing outside an office door: inspecting visitor credentials before letting them enter and logging departure time after.",
     """@timing_decorator
def run_etl_batch(): ...

Execution Flow:
Call run_etl_batch() 
  ---> timing_decorator(wrapper) 
    ---> t0 = time.time()
    ---> original_func()
    ---> log(time.time() - t0)"""),

    (6, "python", "Generators, Iterators & Memory-Efficient Streaming Pipelines",
     "Streaming water through a water purifier glass-by-glass rather than filling a giant swimming pool before drinking.",
     """Source Log File (100 GB)
       |
       v (read chunk 64KB)
[ yield raw_line ] ---> [ yield json.loads() ] ---> [ yield filter_errors() ]
       ^
       |--- Consumes only ~1MB RAM total regardless of file size!"""),

    (7, "python", "File I/O, CSV, JSON, Parquet Parsing & Chunk Processing",
     "Unloading shipping containers in pallets rather than trying to lift the entire cargo ship at once.",
     """Disk File (Large CSV/JSON) 
       |---> pd.read_csv(chunksize=100000)
       |---> Process Chunk 1 ---> Write Parquet Part 1
       |---> Process Chunk 2 ---> Write Parquet Part 2 (RAM stays flat)"""),

    (8, "python", "Object-Oriented Programming for Pipelines (Inheritance, ABC, Mixins)",
     "Blueprint for electric vehicles: base vehicle specifies steer() and brake(), while Tesla and Rivian implement specific motor battery drivers.",
     """      +-------------------------+
      |  AbstractBaseExtractor  |  (Defines: extract(), validate())
      +-------------------------+
            /             \\
           v               v
+-------------------+   +--------------------+
|  S3JsonExtractor  |   | PostgresDbExtractor|
+-------------------+   +--------------------+"""),

    (9, "python", "Error Handling, Logging, Retry Decorators & Circuit Breakers",
     "An electrical fuse in your home: when an upstream API sparks, the breaker trips to protect the central power grid, instead of crashing the whole house.",
     """ETL Task ---> Try API Call 
              |---> Error 503 Service Unavailable
              |---> Exponential Backoff (Wait 2s, 4s, 8s)
              |---> Tripped Breaker if >= 5 failures (Route to Dead Letter Queue)"""),

    (10, "python", "Testing, Type Hinting, Pydantic & Packaging for Production",
     "Airport security screening: validating baggage dimensions and passport validity before passenger boarding.",
     """Raw JSON Dict ---> Pydantic BaseModel (Schema Validation)
                  |---> Success: Typed Python Object (OrderEvent)
                  |---> Failure: ValidationError logged with bad field"""),

    # Module 2: Relational Databases & SQL (Days 11-22)
    (11, "sql", "Relational Database Internals: Storage Engines, Buffer Pools & ACID",
     "A bank ledger kept in a fireproof safe (Write-Ahead Logging / WAL) before cashiers update the main account balance spreadsheet in RAM.",
     """Client Query ---> Buffer Pool (RAM) ---> Dirty Page
                    |
                    v (Synchronous Flush)
            Write-Ahead Log (WAL on SSD) ---> Crash Safe!"""),

    (12, "sql", "SQL Declarative Paradigm & Logical Execution Order",
     "Ordering food at a drive-thru: you specify WHAT burger you want; the kitchen pipeline decides the exact sequence of grilling and packaging.",
     """FROM & JOIN ---> WHERE ---> GROUP BY ---> HAVING ---> SELECT / WINDOW ---> DISTINCT ---> ORDER BY ---> LIMIT"""),

    (13, "sql", "Basic to Intermediate Queries: Filtering, Pattern Matching & NULLs",
     "Detecting missing parcel barcodes: in SQL three-valued logic, UNKNOWN is not False, it is unknown!",
     """WHERE status = 'SHIPPED'          (True rows kept)
WHERE status != 'SHIPPED'         (Fails to keep NULL status rows!)
WHERE status IS DISTINCT FROM 'SHIPPED'  (Safely handles NULLs)"""),

    (14, "sql", "Single-Table Aggregations: GROUP BY, HAVING, GROUPING SETS & ROLLUP",
     "Sales hierarchy rollups: calculating sub-totals per Store, per City, per Country, and Global Grand Total in one single table scan.",
     """GROUP BY ROLLUP(country, state, city)
Generates:
1. (country, state, city)
2. (country, state, NULL)
3. (country, NULL, NULL)
4. (NULL, NULL, NULL) -> Grand Total"""),

    (15, "sql", "Joins Deep Dive: Inner, Left, Full Outer, Cross & Non-Equi Joins",
     "Matching airline passenger tickets with seat reservations: left join keeps all passengers even if unassigned.",
     """Table A (Customers)              Table B (Orders)
   [Cust 1] ------------ Match --------> [Order 101]
   [Cust 2] ------------ No Match -----> [NULL, NULL] (Kept in LEFT JOIN)"""),

    (16, "sql", "Subqueries vs Common Table Expressions (CTEs) & Recursive CTEs",
     "Tracing corporate hierarchy: finding CEO -> VP -> Director -> Manager -> Engineer using an iterative loop in SQL.",
     """Anchor Member: SELECT emp_id, manager_id, 1 as level FROM emp WHERE manager_id IS NULL
UNION ALL
Recursive Member: SELECT e.emp_id, e.manager_id, r.level + 1 FROM emp e JOIN RecTree r ON e.manager_id = r.emp_id"""),

    (17, "sql", "Window Functions I: ROW_NUMBER, RANK, DENSE_RANK, NTILE",
     "Olympic sprint medals: gold, silver tie (both rank 1), bronze is rank 3 (RANK) or rank 2 (DENSE_RANK).",
     """Val    ROW_NUMBER()   RANK()   DENSE_RANK()
100         1            1          1
100         2            1          1
 90         3            3          2   <-- Note difference!"""),

    (18, "sql", "Window Functions II: Frame Specifications (ROWS vs RANGE BETWEEN)",
     "Looking through a camera zoom lens: 3 frames before and 3 frames after current second (moving average).",
     """SUM(amount) OVER (
    ORDER BY tx_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
)  <-- Physical 7-row moving window"""),

    (19, "sql", "Window Functions III: Offset & Value Functions (LAG, LEAD, FIRST_VALUE)",
     "Comparing today's stock price with yesterday's closing bell (LAG) and tomorrow's opening bell (LEAD).",
     """Date        Price    LAG(Price, 1)   Day-over-Day Delta
2024-01-01   $150        NULL                  -
2024-01-02   $155        $150                +$5
2024-01-03   $148        $155                -$7"""),

    (20, "sql", "Indexing Internals: B-Tree, Hash, Bitmap, Covering Indexes & Scans",
     "The index at the back of a 1000-page encyclopedia: jumping straight to page 742 without reading page 1 to 741.",
     """Root Node [50]
      /         \\
 Leaf [10..40]   Leaf [50..90] ---> Doubly Linked List for Range Scans"""),

    (21, "sql", "Query Optimization, Execution Plans & EXPLAIN ANALYZE Breakdown",
     "GPS navigation picking between Highway (Index Scan) vs Local Roads (Seq Scan) based on traffic volume (Cardinatlity).",
     """EXPLAIN ANALYZE:
-> Hash Join (cost=12.50..45.10 rows=500 width=32)
   -> Hash (cost=5.00 rows=100)
      -> Seq Scan on dim_store
   -> Seq Scan on fact_sales"""),

    (22, "sql", "Transactions, Concurrency, Isolation Levels & MVCC",
     "Two shoppers trying to buy the very last concert ticket at the exact same millisecond: who gets the seat?",
     """Transaction 1: BEGIN -> UPDATE seats SET status='BOOKED' WHERE id=42
Transaction 2: BEGIN -> SELECT status FROM seats WHERE id=42 (Waits for Lock or reads MVCC snapshot)"""),

    # Module 3: Linux, Git & Cloud Foundations (Days 23-29)
    (23, "linux_cloud", "Linux Architecture, File Descriptors, Shell Pipes & Redirection",
     "Plumbing pipes in a house: connecting sink faucet output (stdout) directly to water filter inlet (stdin).",
     """cat access.log | grep '500' | awk '{print $1}' | sort | uniq -c | sort -nr > top_error_ips.txt"""),

    (24, "linux_cloud", "Text Wrangling for DE: sed, awk, cut, sort, uniq, xargs",
     "A laser-guided paper shredder and sorter processing millions of receipts per minute.",
     """awk -F',' '$3 > 1000 {sum += $3; count++} END {print "Avg: " sum/count}' transactions.csv"""),

    (25, "linux_cloud", "Process Management, Daemons, Cron, Systemd & Memory Limits",
     "The heart and lungs running in your body background 24/7 without needing conscious brain commands.",
     """Crontab:
0 3 * * * /usr/bin/python3 /opt/pipelines/nightly_sync.py >> /var/log/pipeline.log 2>&1"""),

    (26, "linux_cloud", "Networking Fundamentals for Data Engineers: TCP, Ports, SSH Tunnels",
     "A secure armored car driving through a private underground tunnel beneath a crowded public highway.",
     """Local Laptop (port 5433) === SSH Tunnel ===> Bastion Host ===> Private RDS Postgres (port 5432)"""),

    (27, "linux_cloud", "Git Mastery for Pipelines: Trunk-Based Development, Rebase & Conflicts",
     "Multiple train cars merging smoothly onto a single high-speed mainline track without collisions.",
     """Feature Branch: git rebase origin/main (re-plays commits cleanly on latest main)"""),

    (28, "linux_cloud", "Cloud Object Storage Internals: S3, Blob, GCS, Multipart & Lifecycle",
     "A massive infinite digital locker with unique URL keys; uploading a 50GB file in 100 parallel 500MB parts.",
     """Large File (50GB) ---> Split into 100 parts ---> Parallel S3 Upload ---> CompleteMultipartUpload"""),

    (29, "linux_cloud", "Cloud IAM, Least Privilege, Secrets Management & VPC Endpoints",
     "A hotel keycard that only opens room 402 and the gym, but refuses access to the bank vault or master control room.",
     """EC2 Instance ---> IAM Role (s3:GetObject on arn:aws:s3:::curated-lakehouse/* only)"""),

    # Module 4: NoSQL Databases (Days 30-36)
    (30, "nosql", "NoSQL Paradigms & The CAP Theorem / PACELC",
     "During a mobile network tower blackout: does your banking app allow ATM withdrawals (Availability) or lock down (Consistency)?",
     """CAP Theorem:
     Consistency (All nodes see same data)
       /        \\
      /          \\
Availability    Partition Tolerance (Network splits happen!)"""),

    (31, "nosql", "MongoDB: Document Modeling, Indexing & Aggregation Pipelines",
     "A digital filing cabinet where each folder contains complete nested receipts, customer notes, and item lists.",
     """db.orders.aggregate([
  { $match: { status: 'COMPLETED' } },
  { $group: { _id: '$customer_id', total_spend: { $sum: '$amount' } } },
  { $sort: { total_spend: -1 } }
])"""),

    (32, "nosql", "Apache Cassandra: Masterless P2P, Partition Keys & Clustering Keys",
     "A round table of 8 librarians: a book's partition key determines which librarian holds it; clustering key sorts it on their shelf.",
     """Token Ring (0 .. 2^63-1)
Partition Key: hash(store_id) ---> Routes to Node 3
Clustering Key: (order_date DESC, order_id) ---> Physical sorted order on disk!"""),

    (33, "nosql", "Redis: In-Memory Data Structures, Caching Strategies & Pub/Sub",
     "A chef's prep counter right next to the stove: grabbing salt in 1 millisecond instead of walking to the basement pantry.",
     """Cache-Aside Pattern:
App ---> Get Key from Redis ---> Cache HIT: Return 0.5ms!
App ---> Redis MISS ---> Read SQL DB ---> Set Key in Redis (TTL=3600)"""),

    (34, "nosql", "DynamoDB: Single-Table Design, GSI, LSI & Partition Throttling",
     "A giant global phonebook where customers, orders, and products all share one master table with composite PKs.",
     """PK (Partition Key)        SK (Sort Key)             Attributes
USER#1001                 PROFILE                   name='Akku', email='...'
USER#1001                 ORDER#2024-001            amount=250.00
USER#1001                 ORDER#2024-002            amount=180.00"""),

    (35, "nosql", "Elasticsearch & Vector Stores: Inverted Indexes & Embeddings",
     "The index at the end of a dictionary where every unique word lists every sentence it ever appeared in.",
     """Term 'spark'    ---> Doc IDs: [1, 4, 18, 92]
Term 'streaming' ---> Doc IDs: [4, 12, 18]
Intersection (AND) ---> Doc IDs: [4, 18] (Instant Search!)"""),

    (36, "nosql", "NoSQL for Data Engineering: Change Data Capture (CDC) with Debezium",
     "A stenographer transcribing every keystroke made in court directly into a live news feed ticker.",
     """Postgres WAL / Mongo Oplog ---> Debezium Connector ---> Kafka Topic: 'cdc.customers'"""),

    # Module 5: Hadoop & Distributed File Systems (Days 37-44)
    (37, "hadoop", "Hadoop Architecture: HDFS NameNode, DataNodes & Block Replication",
     "A head librarian holding the card catalog (NameNode) telling you book chapters are stored in Building A, B, and C.",
     """Client ---> NameNode (Metadata: 'file.csv has Block 1, Block 2')
         |
         |---> DataNode 1 (Block 1 replica)
         |---> DataNode 2 (Block 1 replica)
         |---> DataNode 3 (Block 2 replica)"""),

    (38, "hadoop", "YARN: Resource Manager, Node Manager & Container Scheduling",
     "Air traffic controller allocating airport runways and gates to incoming flights based on aircraft size.",
     """ResourceManager (Cluster Brain) <---> NodeManagers (Per-Machine Heartbeat)
Container 1: 4 vCPU, 16GB RAM for Spark Executor"""),

    (39, "hadoop", "MapReduce Internals: Map, Partition, Shuffle, Sort, Reduce",
     "Census workers counting people in their local neighborhoods (Map) before mail trucks sort and aggregate totals by state (Reduce).",
     """Input Splits ---> Map (Local) ---> Partition by Hash ---> Network Shuffle ---> Sort/Merge ---> Reduce"""),

    (40, "hadoop", "Storage Formats: Row-Oriented vs Columnar (CSV vs Parquet vs ORC)",
     "Storing patient medical files: columnar format reads only cholesterol numbers across 1,000,000 patients without touching names or addresses.",
     """Row-Oriented (CSV):  [Row 1: ID, Name, Age, Salary] [Row 2: ID, Name, Age, Salary]
Columnar (Parquet):    [Age: 25, 31, 28, 45...] [Salary: 80k, 95k, 110k...] -> 90% Compression!"""),

    (41, "hadoop", "Data Compression: Snappy, GZIP, ZSTD, Dictionary & Run-Length Encoding",
     "Squeezing a sleeping bag into a vacuum compression sack before strapping it onto a backpacking harness.",
     """Column 'Status': ['PENDING', 'PENDING', 'PENDING', 'APPROVED']
Run-Length Encoded: [('PENDING', 3), ('APPROVED', 1)] (Stored in 2 bytes instead of 32!)"""),

    (42, "hadoop", "Apache Hive: Metastore, External vs Managed Tables, Partitioning",
     "A filing cabinet with labeled color folders by Year/Month: opening folder '2024/10' without touching '2023'.",
     """CREATE EXTERNAL TABLE sales (...) 
PARTITIONED BY (year INT, month INT) 
LOCATION 's3://datalake/sales/';"""),

    (43, "hadoop", "Data Serialization: Apache Avro, Protocol Buffers & Schema Registry",
     "A universal translation dictionary that ensures both sender and receiver understand the message format even if fields change.",
     """Kafka Producer ---> Encodes with Schema ID 42 ---> Kafka Broker (Compact binary)
Kafka Consumer ---> Fetches Schema 42 from Registry ---> Decodes payload cleanly"""),

    (44, "hadoop", "Hadoop Ecosystem Placement Masterclass & Common Traps",
     "High-frequency interview drill: HDFS small files problem (NameNode heap exhaustion) and how compaction solves it.",
     """Small Files Problem: 1,000,000 x 1KB files consume 150MB NameNode RAM!
Solution: CombineFileInputFormat or Spark coalesce() before writing."""),

    # Module 6: Data Warehousing & Modeling (Days 45-51)
    (45, "dwh", "Data Warehousing Foundations: Inmon vs Kimball Methodologies",
     "Inmon: Building a giant central corporate library first, then mini book stalls. Kimball: Building practical shopping stalls (Data Marts) directly for business units.",
     """Inmon (Top-Down): Source -> Enterprise Data Warehouse (3NF) -> Departmental Data Marts
Kimball (Bottom-Up): Source -> Dimensional Star Schemas (Conformed Dimensions) -> BI Tools"""),

    (46, "dwh", "Dimensional Modeling: Fact vs Dimension Tables & Grain Definition",
     "A shopping receipt: the line item items and dollars are the Fact; the customer, store, and date are the Dimensions.",
     """dim_date [date_key] <----+
dim_cust [cust_key] <-----+--- fact_sales [cust_key, date_key, prod_key, amount, qty]
dim_prod [prod_key] <----+"""),

    (47, "dwh", "Star Schema vs Snowflake Schema: Performance vs Normalization",
     "Star schema keeps everything flat for lightning queries; Snowflake breaks city into state into country tables.",
     """Star:      fact_sales ---> dim_store (has store, city, state, country columns flat)
Snowflake: fact_sales ---> dim_store ---> dim_city ---> dim_state ---> dim_country (More JOINs!)"""),

    (48, "dwh", "Slowly Changing Dimensions (SCD Type 0, 1, 2, 3, 4, 6) In-Depth",
     "A customer moves from Hyderabad to Bengaluru: Type 1 overwrites old address; Type 2 creates a new historical row.",
     """CustKey | ID | City       | EffectiveDate | EndDate    | Current
101     | C1 | Hyderabad  | 2022-01-01    | 2024-05-31 | False
102     | C1 | Bengaluru  | 2024-06-01    | 9999-12-31 | True (SCD Type 2)"""),

    (49, "dwh", "Advanced Dimensions: Degenerate, Junk, Role-Playing, Outrigger",
     "A junk drawer in your kitchen: gathering random miscellaneous flags (gift_wrap=Y, coupon=N) into a single dimension.",
     """dim_order_flags:
flag_key | is_gift | is_rush_delivery | payment_method
1        | True    | False            | UPI"""),

    (50, "dwh", "Lakehouse Table Formats: Delta Lake, Apache Iceberg, Apache Hudi",
     "Git for data files: every write creates a commit log; you can roll back or time travel to yesterday's snapshot.",
     """Table Directory:
_delta_log/00000.json (Commit 0: added part-001.parquet)
_delta_log/00001.json (Commit 1: deleted part-001, added part-002.parquet)
SELECT * FROM table VERSION AS OF 0 (Time Travel!)"""),

    (51, "dwh", "Modern Cloud Warehouses: Snowflake vs BigQuery vs Redshift",
     "Snowflake: Separating storage (S3) from compute (Virtual Warehouses) so you can resize clusters in 1 second.",
     """Storage (S3 Central Data) <==== Virtual Warehouse 'BI_QUERIES' (Small)
                              <==== Virtual Warehouse 'ETL_HEAVY' (4X-Large)"""),

    # Module 7: Data Visualization & Analytics (Days 52-56)
    (52, "tableau", "Data Visualization Foundations & KPI Metrics Modeling",
     "A sports scoreboard: displaying current score, fouls, and remaining game time at a single glance.",
     """Raw Transactions ---> Aggregate Layer ---> KPI Scorecard (ARR, Churn Rate, CAC, LTV)"""),

    (53, "tableau", "Tableau Architecture, Data Extracts vs Live Connections",
     "Downloading a podcast offline onto your phone (Extract) vs streaming live radio over 5G (Live Connection).",
     """Tableau Desktop ---> Live Query (Direct SQL pushdown to Snowflake)
                   ---> Hyper Extract (.hyper in-memory columnar snapshot)"""),

    (54, "tableau", "Calculated Fields, Level of Detail (LOD) Expressions: FIXED, INCLUDE, EXCLUDE",
     "Calculating every customer's first purchase date and comparing it against their current order regardless of chart filters.",
     """{ FIXED [Customer ID] : MIN([Order Date]) }"""),

    (55, "tableau", "Dashboard Performance Optimization, Context Filters & Indexing",
     "Applying primary filter before computing top 10 items: context filters create a temporary subset table.",
     """Data Source ---> Context Filter (Region='APAC') ---> Top 10 Filter ---> Render Chart"""),

    (56, "tableau", "Analytics Engineering: dbt (Data Build Tool) Models, Tests & Lineage",
     "Writing recipe instructions in SQL: dbt compiles SELECT queries into CREATE TABLE AS SELECT automatically.",
     """stg_customers.sql (View) ---> int_customer_orders.sql ---> fct_customer_retention.sql"""),

    # Module 8: Apache Spark & PySpark Masterclass (Days 57-70)
    (57, "spark", "Apache Spark Core Architecture: Driver, Cluster Manager, Executors",
     "A film director (Driver) assigning specific scenes to camera crews (Executors) coordinated by the production manager.",
     """Driver (SparkSession, DAG) ---> Cluster Manager (Allocates CPU/RAM)
                                ---> Executor 1 (Tasks 1, 2)
                                ---> Executor 2 (Tasks 3, 4)"""),

    (58, "spark", "Spark Execution Lifecycle: Jobs, Stages, Tasks & DAG Scheduler",
     "A relay race: runners on Stage 1 must pass the baton before runners on Stage 2 can begin running.",
     """Action (e.g. .count()) ---> Job ---> Split at Shuffle Boundaries ---> Stages ---> Distributed Tasks"""),

    (59, "spark", "RDD Fundamentals: Transformations vs Actions, Lazy Evaluation",
     "A restaurant order ticket: the waiter notes down your 4 courses (Lazy Transformations), but the chef only starts cooking when you say 'Fire!' (Action).",
     """.map() ---> .filter() ---> .map() [Lazy Execution Plan] ===> .collect() / .save() [Action triggers compute!]"""),

    (60, "spark", "Spark DataFrames & Spark SQL: Tungsten Engine & Catalyst Optimizer",
     "Translating high-level Python code into optimized C++ binary assembly in off-heap memory, bypassing Java garbage collection.",
     """Unresolved Logical Plan ---> Analyzer (Catalog) ---> Logical Plan ---> Optimizer (Rules) ---> Physical Plan ---> CodeGen"""),

    (61, "spark", "Narrow vs Wide Transformations, Shuffles & Network Partitioning",
     "Narrow: peeling potatoes locally. Wide: sorting all potatoes across 5 kitchens by size (requires driving trucks between kitchens).",
     """Narrow (No Shuffle): filter, map, union
Wide (Network Shuffle!): groupBy, distinct, join, repartition"""),

    (62, "spark", "Spark Join Strategies: Broadcast Hash Join, Shuffle Hash Join, Sort Merge Join",
     "Matching small receipt with big ledger: photocopying small receipt for all accountants (Broadcast) vs sorting entire warehouse (Sort Merge).",
     """Broadcast Hash Join: spark.sql.autoBroadcastJoinThreshold (10MB default)
df_big.join(broadcast(df_small), 'id') ---> Zero Network Shuffle for df_big!"""),

    (63, "spark", "Data Skew in Spark: Detection, Causes, Salting & Skew Join Hints",
     "One postal worker gets assigned the entire downtown Manhattan zip code while others get rural countryside.",
     """Skew Key 'guest' ---> Add Salt (0..15) ---> 16 balanced sub-partitions across all workers!"""),

    (64, "spark", "Spark Memory Management: Storage vs Execution Pools & Off-Heap",
     "A desk shared between active books you are writing (Execution) and reference books you are storing (Storage).",
     """JVM Heap (Unified Memory Manager):
[ Storage Memory (Cached DFs) ] <---> [ Execution Memory (Shuffles/Joins) ]
* Execution memory can evict cached storage when memory pressure occurs!"""),

    (65, "spark", "Partitioning Strategies: repartition() vs coalesce(), Optimal Partition Sizes",
     "Coalesce merges adjacent rooms by knocking down walls (no shuffle); repartition redistributes everyone into brand new rooms.",
     """df.repartition(200, 'region') ---> Full Shuffle Exchange
df.coalesce(10)                ---> Merges partitions without shuffle!"""),

    (66, "spark", "Caching & Persistence: MEMORY_ONLY, MEMORY_AND_DISK, SER",
     "Sticking a post-it note on your monitor with intermediate calculations so you don't recalculate from scratch.",
     """df.persist(StorageLevel.MEMORY_AND_DISK_SER)  # Spills to disk if RAM is exhausted"""),

    (67, "spark", "PySpark UDFs: Standard Python UDF vs Pandas Vectorized UDFs (Arrow)",
     "Transferring data between Java JVM and Python worker: row-by-row serialization vs high-speed Apache Arrow columnar memory transfer.",
     """@pandas_udf('double')
def predict_score(series: pd.Series) -> pd.Series:
    return series * 1.5  # 100x faster than standard python UDF!"""),

    (68, "spark", "Spark UI Deep Dive: Event Timeline, Stage Metrics, Garbage Collection",
     "An ICU heart monitor for your cluster: spotting long GC pauses and straggler tasks dragging down the entire job.",
     """Spark UI:
Stage 3: Task 198/200 (Duration: 2s)
         Task 199/200 (Duration: 25min) <--- Straggler detected! (Check Key Skew)"""),

    (69, "spark", "Production Cluster Tuning: Driver/Executor Sizing & Dynamic Allocation",
     "Golden rule of executor sizing: 5 CPU cores per executor (optimal HDFS throughput) and 20GB-30GB RAM to prevent GC pauses.",
     """--executor-cores 5 --executor-memory 20G --conf spark.dynamicAllocation.enabled=true"""),

    (70, "spark", "PySpark Masterclass Placement Coding Interview Drill",
     "High-frequency placement coding challenge: deduplicating clickstreams and calculating session conversion rates.",
     """df.withColumn('rank', F.row_number().over(w)).filter(F.col('rank') == 1)"""),

    # Module 9: Streaming Data (Days 71-77)
    (71, "streaming", "Streaming Foundations: Batch vs Micro-Batch vs Continuous Processing",
     "Receiving weekly physical mail batch vs a continuous live telephone conversation.",
     """Batch (Daily) ---> Micro-Batch (Spark: 1 second) ---> Continuous (Flink: sub-millisecond)"""),

    (72, "streaming", "Spark Structured Streaming: Sources, Sinks, Triggers & Checkpoints",
     "A continuous conveyor belt of parts: checkpoint logs keep track of the last scanned barcode so power failure loses nothing.",
     """readStream ---> Processing / Transformations ---> writeStream
.option('checkpointLocation', 's3://checkpoints/')"""),

    (73, "streaming", "Event Time vs Processing Time & Ingestion Time",
     "A letter written on Jan 1st (Event Time) posted on Jan 3rd (Ingestion Time) and opened on Jan 10th (Processing Time).",
     """Always aggregate on Event Time, NEVER on the processing server clock!"""),

    (74, "streaming", "Window Operations: Tumbling, Sliding, Session Windows",
     "Tumbling: 9:00-9:05, 9:05-9:10 (no overlap). Sliding: 5-minute window sliding every 1 minute (overlapping).",
     """F.window('event_time', '5 minutes', '1 minute')"""),

    (75, "streaming", "Watermarking & Handling Late-Arriving Data",
     "A movie theater manager holding the curtain for 15 minutes after start time for traffic delays before locking the doors.",
     """.withWatermark('timestamp', '15 minutes')  # Discards events older than (MaxTime - 15m)"""),

    (76, "streaming", "Stateful Stream Processing: mapGroupsWithState & Deduplication",
     "A store clerk remembering each customer's accumulated shopping points throughout the day.",
     """.dropDuplicates(['user_id', 'transaction_id'])"""),

    (77, "streaming", "Production Stream Monitoring, SLA Violations & Fault Recovery",
     "Automatic circuit breakers restarting failed streaming queries from the last valid checkpoint without double-counting.",
     """query.awaitTermination() with query.exception handling"""),

    # Module 10: Apache Kafka (Days 78-86)
    (78, "kafka", "Apache Kafka Architecture: Brokers, Topics, Partitions, Commit Log",
     "An append-only spiral notebook: new entries are written at the end; you can never erase, only append.",
     """Topic 'orders'
Partition 0: [0][1][2][3][4] (Head)
Partition 1: [0][1][2] (Head)"""),

    (79, "kafka", "Kafka Producers: Serialization, Partitioner, Acks & Retries",
     "Sending registered mail: acks=0 (drop in postbox, no receipt), acks=all (signed receipt from all post office managers).",
     """acks=all (-1) + enable.idempotence=true + retries=MAX ---> Zero Data Loss!"""),

    (80, "kafka", "Kafka Consumers: Consumer Groups, Offset Commits & Polling Loop",
     "A team of 4 translators dividing a 4-chapter document so each person translates exactly one chapter.",
     """Consumer Group:
Consumer 1 <--- Partition 0
Consumer 2 <--- Partition 1"""),

    (81, "kafka", "Delivery Semantics: At-Least-Once, At-Most-Once, Exactly-Once (EOS)",
     "At-Least-Once: resending if confirmation is lost (duplicates possible). Exactly-Once: two-phase commit transaction.",
     """Kafka Transactions: sendOffsetsToTransaction() commits offsets and sink records atomically!"""),

    (82, "kafka", "Topic Compaction, Log Retention & Tombstones",
     "A whiteboard with employee phone numbers: when an employee updates their number, the old one is erased, keeping only latest.",
     """Key: 'emp_101', Value: null (Tombstone marker deletes record during compaction)"""),

    (83, "kafka", "Kafka Connect: Source and Sink Connectors (Debezium, S3, JDBC)",
     "Standard USB-C cable connecting any phone to any charger without writing custom hardware firmware.",
     """Postgres DB ---> Kafka Connect Source ---> Kafka Topic ---> Kafka Connect Sink ---> Snowflake DWH"""),

    (84, "kafka", "Schema Evolution & Confluent Schema Registry (Backward/Forward)",
     "A passport control gate accepting newer biometric passports while still supporting legacy paper passports.",
     """Schema Compatibility: BACKWARD (new schema can read records written by old schema)"""),

    (85, "kafka", "Kafka Performance Tuning: Batch Size, Linger.ms, Compression",
     "Waiting 5 milliseconds at the bus stop so 20 passengers board the bus together instead of driving 20 separate cars.",
     """linger.ms=20 + batch.size=65536 + compression.type=snappy ---> 5x higher throughput!"""),

    (86, "kafka", "Kafka Placement System Design: Design Real-Time Uber Surge Pricing",
     "Aggregating ride requests and driver locations in 5-minute sliding windows across geohash grid cells.",
     """Drivers (GPS) ---> Kafka Topic 'drivers' 
Riders (Requests) -> Kafka Topic 'requests' ---> Flink Stream Join ---> Surge Multiplier"""),

    # Module 11: Apache Airflow (Days 87-94)
    (87, "airflow", "Apache Airflow Architecture: Webserver, Scheduler, Executor, MetaDB",
     "A project manager (Scheduler) assigning construction tasks to contractors (Workers) using a central blueprint (MetaDB).",
     """Scheduler ---> Checks DAG intervals ---> Places Task in Queue (Celery/K8s) ---> Worker Executes"""),

    (88, "airflow", "DAG Syntax, Operators, Tasks & Bitshift Dependencies (>>)",
     "A baking recipe: preheat oven and mix flour before pouring into cake pan.",
     """extract_data >> transform_spark >> [load_warehouse, send_slack_alert]"""),

    (89, "airflow", "Airflow Scheduling: start_date, cron, logical_date & catchup=False",
     "Airflow executes a DAG run AFTER the data interval has concluded: the 2:00 AM run processes data from 1:00 AM to 2:00 AM.",
     """data_interval_start: 2024-01-01 00:00:00
data_interval_end:   2024-01-01 01:00:00 (Execution occurs at 01:00:00!)"""),

    (90, "airflow", "Sensors, Hooks, Connections & Deferrable Operators",
     "A delivery tracker waiting for a package: checking every hour without blocking a valuable worker thread.",
     """mode='reschedule' or Deferrable Operator releases worker slot while waiting for upstream files."""),

    (91, "airflow", "Retries, Exponential Backoff, SLAs & Alerting",
     "A knock on the door: wait 10 seconds before knocking again, then wait 30 seconds before sending an emergency SMS.",
     """retries=3, retry_delay=timedelta(minutes=5), retry_exponential_backoff=True"""),

    (92, "airflow", "XComs, Task State Sharing & Avoiding Anti-Patterns",
     "Passing a small sticky note with a locker combination number, NOT trying to stuff an entire elephant into the envelope.",
     """Pass S3 URI: 's3://lakehouse/data_2024_01.parquet' via XCom, NOT raw data rows!"""),

    (93, "airflow", "Idempotency & Safe Backfilling in Production Pipelines",
     "Pressing the elevator button 10 times: the elevator arrives once at your floor without crashing.",
     """INSERT OVERWRITE ... or MERGE statement ensures running the pipeline twice produces identical output."""),

    (94, "airflow", "Orchestrate an End-to-End Enterprise Lakehouse ETL Workflow",
     "Full production DAG: S3 ingestion sensor -> PySpark Bronze to Silver -> Silver to Gold -> Great Expectations QA -> Slack.",
     """Sensor >> SparkBronzeToSilver >> SparkSilverToGold >> DataQualityCheck >> Notification"""),

    # Module 12: Capstone & Placement Preparation (Days 95-100)
    (95, "capstone", "Capstone Architecture Blueprint: Multi-Source Lakehouse Ingestion",
     "Building a world-class international airport terminal with passenger terminals, luggage conveyers, and air traffic control.",
     """Sources (APIs, DBs, Streams) ---> Kafka ---> Spark Processing ---> Medallion Lakehouse (Bronze/Silver/Gold)"""),

    (96, "capstone", "Ingestion Layer: CDC, Object Storage Data Lake & Schema Contracts",
     "Guaranteed delivery: establishing strict contractual agreements on data formats between producers and consumers.",
     """Schema Evolution + JSON Schema Validation at Ingestion Gateway"""),

    (97, "capstone", "PySpark Transformations & Medallion Architecture (Bronze -> Silver -> Gold)",
     "Gold mining: raw river dirt (Bronze) -> cleaned nuggets (Silver) -> pure jewelry ready for showcase (Gold).",
     """Bronze (Raw Append-Only) ---> Silver (Cleaned, Deduplicated) ---> Gold (Aggregated Business Marts)"""),

    (98, "capstone", "Streaming & Orchestration: Kafka Real-Time Stream + Airflow DAG",
     "Synchronizing bullet trains: high-speed live tracks working seamlessly alongside scheduled overnight freight routes.",
     """Kafka Real-Time Streaming (sub-second) + Airflow Daily Reconciliation & Audit Batch"""),

    (99, "capstone", "Data Quality Assertions, Great Expectations, Monitoring & Lineage",
     "Food safety health inspector testing restaurant samples before dishes are served to customers.",
     """expect_column_values_to_not_be_null('customer_id') + expect_column_values_to_be_between('age', 18, 120)"""),

    (100, "capstone", "Placement Readiness: FAANG Mock Interview, Resume Defense & Celebration!",
     "The final championship match: standing with confidence, answering complex trade-offs, and landing top placement offers.",
     """Placement Ready: SQL Master + PySpark Specialist + Distributed Systems Architect!""")
]

notes_dict = {}

for day_num, subj, title, analogy, diagram in DAYS_SPEC:
    mod_num = 1
    if day_num <= 10: mod_num = 1
    elif day_num <= 22: mod_num = 2
    elif day_num <= 29: mod_num = 3
    elif day_num <= 36: mod_num = 4
    elif day_num <= 44: mod_num = 5
    elif day_num <= 51: mod_num = 6
    elif day_num <= 56: mod_num = 7
    elif day_num <= 70: mod_num = 8
    elif day_num <= 77: mod_num = 9
    elif day_num <= 86: mod_num = 10
    elif day_num <= 94: mod_num = 11
    else: mod_num = 12

    notes_dict[day_num] = {
        "dayNumber": day_num,
        "subject": subj,
        "title": title,
        "analogy": analogy,
        "flowchart": diagram,
        "detailedMarkdown": f"""### Day {day_num}: {title}

#### 💡 Real-Life Intuition & Analogy
> {analogy}

---

#### 📐 Architectural Flowchart & System Blueprint
```text
{diagram}
```

---

#### 🔬 In-Depth Engineering Breakdown

##### 1. What Problem Does This Solve at Enterprise Scale?
In modern high-throughput data engineering environments, traditional single-node scripts break under load. When processing terabytes of data daily, engineering teams face three primary bottlenecks:
- **Memory Pressure & Resource Spills**: Data sets exceed RAM limits, leading to process thrashing, Garbage Collection freezes, and out-of-memory (OOM) fatal crashes.
- **Network I/O & Cross-Cluster Latency**: Poorly planned partitions and un-optimized queries generate massive shuffle storms across the data center network switch fabrics.
- **Data Correctness & Fault Tolerant Recovery**: Systems must guarantee idempotency—if a 4-hour batch job fails at 98%, re-running it must not produce duplicated transactions or inconsistent states.

##### 2. How It Works Under the Hood
1. **Physical Resource Allocation**: Operating system processes communicate via kernel-level file descriptors, shared memory segments, or TCP network sockets.
2. **Execution Optimization**: Engines analyze logical trees (Abstract Syntax Trees), prune unused partitions, push down predicate filters, and compile execution code into native machine instructions.
3. **Partition Management**: Data is partitioned according to consistent hashing algorithms, allowing parallel distributed executors to work independently on bounded chunks.

##### 3. Production Best Practices & What Breaks at 10 TB Scale
- **Idempotency Guarantee**: Always design tasks such that executing them multiple times with the same input yields the exact same final state.
- **Avoid Key Skew**: Uneven key distribution concentrates work onto a single worker node (straggler), turning a 100-node cluster into a single-threaded bottleneck.
- **Resource Limits & Monitoring**: Set explicit memory thresholds, monitor JVM heap usage, and alert on lag spikes before customer SLAs are breached.

---

#### 🏆 FAANG & Top MNC Placement Gotchas
- **Common Interview Trap**: Interviewers frequently probe boundary conditions, handling of `NULL` records, behavior during network partition splits, and memory consumption characteristics.
- **Model Answer Structure**: Start with the high-level trade-off (e.g. Latency vs Consistency, Throughput vs Memory), describe the internal mechanics, and conclude with real-world failure remediation."""
    }

ts_output_path = "/Users/pvsairamsaketh/Documents/akku/frontend/src/data/academics/detailedDailyNotes.ts"

with open(ts_output_path, "w", encoding="utf-8") as f:
    f.write("""// Auto-generated 100-Day Study Notes with Real-Life Analogies and Architectural Flowcharts
export interface DailyNoteItem {
  dayNumber: number;
  subject: string;
  title: string;
  analogy: string;
  flowchart: string;
  detailedMarkdown: string;
}

export const DETAILED_DAILY_NOTES: Record<number, DailyNoteItem> = """)
    json.dump(notes_dict, f, indent=2)
    f.write(";\n")

print(f"Successfully generated detailed notes for all {len(notes_dict)} days in {ts_output_path}!")
