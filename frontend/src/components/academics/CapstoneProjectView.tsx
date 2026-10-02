import React, { useState } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Layers, 
  Database, 
  GitBranch, 
  FileCode, 
  Terminal, 
  Award
} from 'lucide-react';

interface CapstoneProjectViewProps {
  completedMilestones?: Record<string, boolean>;
  onToggleMilestone?: (milestoneId: string) => void;
}

const CAPSTONE_MILESTONES = [
  {
    id: 'm1',
    num: 1,
    title: 'Business Requirements & Data Flow Definition',
    phase: 'Architecture',
    objective: 'Map high-throughput e-commerce events (pageviews, add-to-cart, orders, payments) and define business KPIs.',
    deliverable: 'Architecture specification document and event schema JSON contracts.',
    verification: 'Schema contracts validated with Pydantic for customer, cart, and payment events.'
  },
  {
    id: 'm2',
    num: 2,
    title: 'High-Level Data Architecture & Tech Stack Selection',
    phase: 'Architecture',
    objective: 'Design lambda/kappa architecture: Kafka for streaming, MinIO/S3 for lake, Spark for batch/stream, PostgreSQL/Snowflake for warehouse, Airflow for orchestration.',
    deliverable: 'System architecture diagram and component trade-off matrix.',
    verification: 'Architecture reviewed against latency and storage cost parameters.'
  },
  {
    id: 'm3',
    num: 3,
    title: 'Synthetic Real-Time Event Generator',
    phase: 'Ingestion',
    objective: 'Build a Python simulator generating realistic multi-threaded e-commerce traffic with skewed item popularity and seasonal sales peaks.',
    deliverable: '`generator/event_producer.py` supporting configurable events/sec.',
    verification: 'Run generator: produces 1,000 JSON events/sec with zero drops.'
  },
  {
    id: 'm4',
    num: 4,
    title: 'Apache Kafka Multi-Partition Ingestion Layer',
    phase: 'Ingestion',
    objective: 'Create Kafka topics (`raw-ecommerce-events`, `order-events`) with partition strategy keyed by `customer_id` for order preservation.',
    deliverable: 'Kafka broker setup scripts and Confluent-Kafka Python producer.',
    verification: 'Producer publishes events to 4 partitions and verifies consumer offset commits.'
  },
  {
    id: 'm5',
    num: 5,
    title: 'Schema Validation & Dead Letter Queue (DLQ)',
    phase: 'Ingestion',
    objective: 'Validate incoming payload against Avro/JSON schema; route malformed or corrupted records to a DLQ topic without stopping ingestion.',
    deliverable: 'Schema validation interceptor and DLQ consumer monitor.',
    verification: 'Inject dirty JSON (missing IDs, negative prices); assert records route to `dlq-topic`.'
  },
  {
    id: 'm6',
    num: 6,
    title: 'Raw Data Lake Storage (Bronze Layer)',
    phase: 'Storage',
    objective: 'Persist raw events to object storage (MinIO / S3) partitioned by `/year=YYYY/month=MM/day=DD/` in compressed Parquet format.',
    deliverable: 'S3 Bronze ingestion sink script with snappy compression.',
    verification: 'Inspect Parquet file schemas and partition directory structure on S3.'
  },
  {
    id: 'm7',
    num: 7,
    title: 'PySpark Silver Batch Transformation Pipeline',
    phase: 'Transformations',
    objective: 'Clean raw records, cast data types, deduplicate by `event_id`, handle null values, and mask sensitive PII (emails, IPs).',
    deliverable: '`jobs/spark_clean_silver.py` with broadcast join lookups.',
    verification: 'Assert zero duplicates and 100% clean data types in Silver dataset.'
  },
  {
    id: 'm8',
    num: 8,
    title: 'Dimensional Modeling: Kimball Star Schema Design',
    phase: 'Data Warehouse',
    objective: 'Design Gold layer analytical model: `fact_sales`, `dim_customer` (SCD Type 2), `dim_product`, and `dim_date`.',
    deliverable: 'DDL script `schema/gold_warehouse.sql` with surrogate keys and foreign key constraints.',
    verification: 'All tables instantiated and verified in PostgreSQL / SQLite sandbox.'
  },
  {
    id: 'm9',
    num: 9,
    title: 'PySpark Gold Dimension & Fact Loading',
    phase: 'Transformations',
    objective: 'Implement PySpark ETL job that populates dimensions, updates surrogate keys, and populates `fact_sales` with additive facts.',
    deliverable: '`jobs/spark_load_gold.py` using window functions for surrogate key assignment.',
    verification: 'Compare record counts and verify referential integrity across fact and dim tables.'
  },
  {
    id: 'm10',
    num: 10,
    title: 'Automated Data Quality Checks with Great Expectations',
    phase: 'Data Quality',
    objective: 'Implement data assertion suite: `expect_column_values_to_not_be_null`, `expect_table_row_count_to_be_between`, `expect_column_values_to_be_unique`.',
    deliverable: '`quality/assertions.py` integrated into pipeline execution.',
    verification: 'Quality suite passes with 100% assertions green on clean data batch.'
  },
  {
    id: 'm11',
    num: 11,
    title: 'Apache Spark Structured Streaming Real-Time Aggregator',
    phase: 'Streaming',
    objective: 'Consume Kafka topic `order-events`, maintain 10-minute tumbling windows with watermarks for late data, compute real-time GMV.',
    deliverable: '`streaming/spark_streaming_gmv.py` writing to Redis / in-memory cache.',
    verification: 'Simulate delayed events; assert watermark handles out-of-order records accurately.'
  },
  {
    id: 'm12',
    num: 12,
    title: 'Apache Airflow End-to-End Orchestration DAG',
    phase: 'Orchestration',
    objective: 'Orchestrate pipeline: `SensorTask >> IngestBronze >> CleanSilver >> LoadGold >> RunDataQuality >> AlertSlack`.',
    deliverable: '`dags/ecommerce_pipeline_dag.py` with retries and exponential backoff.',
    verification: 'Trigger DAG in Airflow UI; assert all task states turn green.'
  },
  {
    id: 'm13',
    num: 13,
    title: 'Pipeline Failure Recovery & Alerting',
    phase: 'Orchestration',
    objective: 'Simulate upstream failures (database timeout, missing files); verify Airflow retries, DLQ routing, and email/webhook alerts.',
    deliverable: 'On-failure callbacks in Airflow and incident recovery runbook.',
    verification: 'Force a task failure; assert webhook alert triggers with error log snippet.'
  },
  {
    id: 'm14',
    num: 14,
    title: 'Analytical SQL Reporting Views',
    phase: 'Analytics',
    objective: 'Write analytical SQL queries: Customer Retention Cohort, Top-N Products by Revenue, Cart Abandonment Rate, and Daily GMV Growth.',
    deliverable: '`sql/placement_analytics_queries.sql` with window functions and CTEs.',
    verification: 'Execute queries on analytical sandbox; verify output matches business logic.'
  },
  {
    id: 'm15',
    num: 15,
    title: 'Interactive Business Dashboard in Tableau',
    phase: 'Visualization',
    objective: 'Connect Tableau to Gold warehouse; create Executive KPI summary, Sales Trend line, Regional Heatmap, and Product Category breakdown.',
    deliverable: 'Tableau workbook `.twbx` or interactive dashboard screenshot and presentation.',
    verification: 'Verify dashboard filters update metrics interactively across all charts.'
  },
  {
    id: 'm16',
    num: 16,
    title: 'Performance Tuning & Spark Shuffle Optimization',
    phase: 'Optimization',
    objective: 'Tune PySpark jobs: optimize `spark.sql.shuffle.partitions`, apply broadcast joins for small lookup tables, and inspect `explain()` physical plans.',
    deliverable: 'Benchmarking report comparing execution runtime before vs after optimization.',
    verification: 'Measure 40%+ reduction in pipeline execution latency and shuffle spill.'
  },
  {
    id: 'm17',
    num: 17,
    title: 'Containerization with Docker Compose',
    phase: 'DevOps',
    objective: 'Create `docker-compose.yml` spinning up Kafka, Zookeeper, MinIO, PostgreSQL, and Airflow for one-command local reproduction.',
    deliverable: '`docker-compose.yml` with healthchecks and persistent volume mounts.',
    verification: 'Run `docker compose up -d`; all 5 services reach healthy status.'
  },
  {
    id: 'm18',
    num: 18,
    title: 'GitHub Repository Documentation & Architecture README',
    phase: 'Portfolio',
    objective: 'Prepare a recruiter-ready GitHub repository with clear setup guide, architecture diagrams, data flow gif, and sample outputs.',
    deliverable: 'Portfolio-grade `README.md` with badges and clean project tree.',
    verification: 'Repository ready to showcase on LinkedIn and resume.'
  },
  {
    id: 'm19',
    num: 19,
    title: 'Resume Project Bullets & Placement Talking Points',
    phase: 'Placement Prep',
    objective: 'Distill project into 4 powerful STAR-method resume bullet points highlighting metrics (e.g. 1M events/day, 45% latency reduction).',
    deliverable: 'Tailored resume section for M.Tech Data Engineering placement profile.',
    verification: 'Bullets reviewed against FAANG / Tier-1 DE job descriptions.'
  },
  {
    id: 'm20',
    num: 20,
    title: 'Technical Interview Defense & System Design Walkthrough',
    phase: 'Placement Prep',
    objective: 'Practice explaining architecture trade-offs, handling backpressure, schema evolution, and exactly-once delivery in mock interviews.',
    deliverable: '15 placement defense Q&A scripts prepared for technical interviews.',
    verification: 'Deliver a smooth 5-minute system design presentation explaining the platform.'
  }
];

export const CapstoneProjectView: React.FC<CapstoneProjectViewProps> = ({
  completedMilestones = {},
  onToggleMilestone
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string>('All');

  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPct = Math.round((completedCount / CAPSTONE_MILESTONES.length) * 100);

  const phases = ['All', 'Architecture', 'Ingestion', 'Storage', 'Transformations', 'Data Warehouse', 'Data Quality', 'Streaming', 'Orchestration', 'Analytics', 'Optimization', 'DevOps', 'Portfolio', 'Placement Prep'];

  const filtered = expandedPhase === 'All'
    ? CAPSTONE_MILESTONES
    : CAPSTONE_MILESTONES.filter(m => m.phase === expandedPhase);

  return (
    <div className="flex flex-col gap-6 text-stone-200">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-sky-950/50 border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-stone-100">
              Capstone: Real-Time E-Commerce Data Engineering Platform
            </h3>
          </div>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            The centerpiece of Akku's placement resume. Build an end-to-end production data platform processing streaming event feeds, Kimball dimensional warehousing in PySpark, and Airflow orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-800 text-center">
            <div className="text-[10px] text-stone-400 uppercase">Milestones Done</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {completedCount} / {CAPSTONE_MILESTONES.length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#161b22] border border-stone-800 text-center">
            <div className="text-[10px] text-stone-400 uppercase">Progress</div>
            <div className="text-xl font-bold font-mono text-sky-400">{progressPct}%</div>
          </div>
        </div>
      </div>

      {/* Architecture Highlights Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#0d1117] border border-stone-800 flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-stone-200">Streaming Layer</div>
            <div className="text-[10px] text-stone-400">Apache Kafka (4 Partitions)</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-stone-800 flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <div className="font-semibold text-stone-200">Processing Engine</div>
            <div className="text-[10px] text-stone-400">PySpark Batch & Streaming</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-stone-800 flex items-center gap-2.5">
          <Database className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="font-semibold text-stone-200">Storage & Warehouse</div>
            <div className="text-[10px] text-stone-400">S3 / MinIO + Star Schema</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0d1117] border border-stone-800 flex items-center gap-2.5">
          <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="font-semibold text-stone-200">Orchestration</div>
            <div className="text-[10px] text-stone-400">Apache Airflow DAGs</div>
          </div>
        </div>
      </div>

      {/* Resume Talking Points Card */}
      <div className="p-4 rounded-xl bg-[#0d1117] border border-stone-800 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
          <Award className="w-4 h-4" />
          <span>Resume STAR Bullet Points (Ready for Akku's Placement Resume):</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-stone-300 font-sans leading-relaxed">
          <li>
            <strong>Architecture & Scale:</strong> Designed an end-to-end real-time e-commerce data platform processing 100K+ daily events using Python, Apache Kafka, and PySpark Structured Streaming.
          </li>
          <li>
            <strong>Dimensional Modeling:</strong> Architected a Kimball star schema warehouse (Fact Sales + Dim Customer/Product/Date) in PostgreSQL/Parquet, reducing analytical query response latency by 55%.
          </li>
          <li>
            <strong>Workflow Orchestration & Quality:</strong> Orchestrated automated batch pipelines via Apache Airflow with automated schema assertions (Great Expectations), idempotency, and automated Slack DLQ alerting.
          </li>
        </ul>
      </div>

      {/* Milestones List Header with Phase Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h4 className="font-semibold text-sm text-stone-100">
            20 Actionable Capstone Milestones
          </h4>
        </div>

        <select
          value={expandedPhase}
          onChange={(e) => setExpandedPhase(e.target.value)}
          className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {phases.map(p => (
            <option key={p} value={p}>{p === 'All' ? 'All Phases (20)' : p}</option>
          ))}
        </select>
      </div>

      {/* Milestones List */}
      <div className="flex flex-col gap-3">
        {filtered.map(m => {
          const isDone = completedMilestones[m.id] === true;
          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all flex flex-col gap-2.5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                  : 'bg-[#0d1117] border-stone-800 text-stone-200 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleMilestone && onToggleMilestone(m.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Milestone #{m.num}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        {m.phase}
                      </span>
                    </div>

                    <h5 className={`font-semibold text-sm sm:text-base font-sans ${isDone ? 'line-through opacity-80' : ''}`}>
                      {m.title}
                    </h5>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="pl-8 text-xs text-stone-300 font-sans space-y-1.5 leading-relaxed">
                <div>
                  <span className="font-semibold text-stone-400">Objective: </span>
                  {m.objective}
                </div>
                <div className="bg-[#161b22] p-2 rounded-lg border border-stone-800/80 font-mono text-[11px] text-emerald-300">
                  <span className="text-stone-400 font-sans font-semibold">Deliverable: </span>
                  {m.deliverable}
                </div>
                <div className="text-[11px] text-stone-400">
                  <span className="font-semibold text-stone-300">Validation: </span>
                  {m.verification}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
