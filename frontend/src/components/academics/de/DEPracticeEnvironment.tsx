import React, { useState, useEffect, useMemo, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Terminal,
  Lightbulb,
  BookOpen,
  Zap,
  History,
  Code2,
  Database,
  Table as TableIcon,
  Maximize2,
  Minimize2,
  Check,
  Copy,
  Sparkles
} from 'lucide-react';
import { api } from '../../../services/api';
import type { BankQuestion } from '../../../data/academics/interviewQuestionsBank';

export interface DEPracticeQuestion {
  id: string;
  type?: 'coding' | 'mcq' | 'scenario' | 'conceptual';
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Beginner' | 'Intermediate' | 'Advanced' | string;
  company?: string;
  category?: string;
  topic?: string;
  title: string;
  question: string;
  hint?: string;
  solution: string;
  explanation?: string;
  tags?: string[];
  starterCode?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  commonTraps?: string;
}

interface DEPracticeEnvironmentProps {
  question: DEPracticeQuestion | BankQuestion;
  onSolved?: (questionId: string) => void;
  onSaveToNotes?: (question: any) => void;
  onAddMistake?: (questionId: string, mistakeDetails: any) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (questionId: string) => void;
}

// Built-in Analytical Sandbox Tables for Explorer
const SANDBOX_TABLES: Record<string, { columns: { name: string; type: string }[]; sample: any[] }> = {
  employees: {
    columns: [
      { name: 'emp_id', type: 'INTEGER' },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'dept_id', type: 'INTEGER' },
      { name: 'salary', type: 'REAL' },
      { name: 'hire_date', type: 'TEXT' },
      { name: 'manager_id', type: 'INTEGER' },
    ],
    sample: [
      { emp_id: 101, first_name: 'Akshatha', last_name: 'Rao', dept_id: 10, salary: 1450000, hire_date: '2022-06-15', manager_id: null },
      { emp_id: 102, first_name: 'Saketh', last_name: 'Varma', dept_id: 10, salary: 1500000, hire_date: '2022-05-04', manager_id: 101 },
      { emp_id: 103, first_name: 'Priya', last_name: 'Nair', dept_id: 10, salary: 1150000, hire_date: '2023-01-10', manager_id: 101 },
      { emp_id: 104, first_name: 'Vikram', last_name: 'Sharma', dept_id: 20, salary: 950000, hire_date: '2022-09-01', manager_id: null },
      { emp_id: 105, first_name: 'Ananya', last_name: 'Deshmukh', dept_id: 20, salary: 980000, hire_date: '2023-03-20', manager_id: 104 },
    ],
  },
  departments: {
    columns: [
      { name: 'dept_id', type: 'INTEGER' },
      { name: 'dept_name', type: 'TEXT' },
      { name: 'location', type: 'TEXT' },
      { name: 'budget', type: 'REAL' },
    ],
    sample: [
      { dept_id: 10, dept_name: 'Data Engineering', location: 'Bengaluru', budget: 8500000 },
      { dept_id: 20, dept_name: 'Analytics & BI', location: 'Chennai', budget: 4200000 },
      { dept_id: 30, dept_name: 'Platform & Cloud', location: 'Hyderabad', budget: 6500000 },
      { dept_id: 40, dept_name: 'Machine Learning', location: 'Pune', budget: 7200000 },
    ],
  },
  orders: {
    columns: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'order_date', type: 'TEXT' },
      { name: 'total_amount', type: 'REAL' },
      { name: 'status', type: 'TEXT' },
      { name: 'payment_method', type: 'TEXT' },
    ],
    sample: [
      { order_id: 1001, customer_id: 1, order_date: '2024-01-15', total_amount: 1499.0, status: 'Completed', payment_method: 'UPI' },
      { order_id: 1002, customer_id: 2, order_date: '2024-01-18', total_amount: 4999.0, status: 'Completed', payment_method: 'Credit Card' },
      { order_id: 1003, customer_id: 1, order_date: '2024-02-02', total_amount: 850.0, status: 'Pending', payment_method: 'Debit Card' },
      { order_id: 1004, customer_id: 3, order_date: '2024-02-10', total_amount: 12200.0, status: 'Completed', payment_method: 'Net Banking' },
    ],
  },
  customers: {
    columns: [
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'loyalty_tier', type: 'TEXT' },
    ],
    sample: [
      { customer_id: 1, name: 'Aarav Patel', email: 'aarav@example.com', city: 'Bengaluru', loyalty_tier: 'Gold' },
      { customer_id: 2, name: 'Diya Sen', email: 'diya@example.com', city: 'Mumbai', loyalty_tier: 'Platinum' },
      { customer_id: 3, name: 'Rohan Mehra', email: 'rohan@example.com', city: 'Delhi', loyalty_tier: 'Silver' },
    ],
  },
  fact_sales: {
    columns: [
      { name: 'sales_id', type: 'INTEGER' },
      { name: 'customer_key', type: 'INTEGER' },
      { name: 'product_key', type: 'INTEGER' },
      { name: 'date_key', type: 'INTEGER' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'total_amount', type: 'REAL' },
      { name: 'profit', type: 'REAL' },
    ],
    sample: [
      { sales_id: 501, customer_key: 1, product_key: 201, date_key: 20240115, quantity: 2, total_amount: 3000.0, profit: 800.0 },
      { sales_id: 502, customer_key: 2, product_key: 205, date_key: 20240118, quantity: 1, total_amount: 4999.0, profit: 1200.0 },
    ],
  },
};

type DEEnvironment = 'sql' | 'pyspark' | 'python' | 'bash' | 'schema' | 'interview';

function detectEnvironment(q: DEPracticeQuestion): DEEnvironment {
  const cat = (q.category || '').toLowerCase();
  const top = (q.topic || '').toLowerCase();
  const tags = (q.tags || []).map(t => t.toLowerCase());
  const title = (q.title || '').toLowerCase();

  if (cat.includes('sql') || top.includes('window function') || top.includes('join') || top.includes('cte') || tags.includes('sql')) {
    return 'sql';
  }
  if (cat.includes('spark') || cat.includes('pyspark') || top.includes('spark') || top.includes('rdd') || tags.includes('pyspark') || tags.includes('spark')) {
    return 'pyspark';
  }
  if (cat.includes('linux') || cat.includes('bash') || top.includes('bash') || top.includes('shell') || tags.includes('bash') || tags.includes('linux')) {
    return 'bash';
  }
  if (cat.includes('modeling') || cat.includes('warehouse') || top.includes('schema') || top.includes('star schema') || top.includes('scd')) {
    return 'schema';
  }
  if (cat.includes('distributed') || cat.includes('system design') || cat.includes('architecture') || cat.includes('kafka') && !title.includes('code')) {
    return 'interview';
  }
  return 'python';
}

function generateDefaultStarter(q: DEPracticeQuestion, env: DEEnvironment): string {
  if (q.starterCode && q.starterCode.trim().length > 10) {
    return q.starterCode;
  }
  if (env === 'sql') {
    return `-- Placement SQL Assessment: ${q.title}
-- Company: ${q.company || 'FAANG'} | Category: ${q.category || 'Advanced SQL'}
-- Write your SQL query below:

SELECT 
    -- Write columns and window/aggregate functions here
FROM employees;
`;
  }
  if (env === 'pyspark') {
    return `# PySpark Data Engineering Assessment: ${q.title}
from pyspark.sql import SparkSession
from pyspark.sql import functions as F, Window as W

def solve_pipeline(df):
    """
    Transforms input DataFrame according to placement requirements.
    Return the transformed DataFrame.
    """
    # Write PySpark transformation steps:
    result_df = df
    return result_df
`;
  }
  if (env === 'bash') {
    return `#!/bin/bash
# Data Engineering Shell Pipeline: ${q.title}
# Process inputs, wrangle data with awk, sed, grep, or sort

cat /data/events.log | awk '{print $1, $4}' | sort | uniq -c
`;
  }
  if (env === 'schema') {
    return `-- Data Modeling & Warehouse DDL: ${q.title}
-- Design appropriate Fact/Dimension tables with primary and foreign keys

CREATE TABLE dim_customer (
    customer_key INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    city TEXT,
    effective_date DATE,
    is_current BOOLEAN DEFAULT 1
);

CREATE TABLE fact_transactions (
    transaction_id INTEGER PRIMARY KEY,
    customer_key INTEGER REFERENCES dim_customer(customer_key),
    amount DECIMAL(10, 2),
    transaction_time TIMESTAMP
);
`;
  }
  if (env === 'interview') {
    return `# Architectural Analysis & Engineering Design
# 1. High-Level Architecture & Components:
# 

# 2. Ingestion & Storage Strategy:
# 

# 3. Partitioning, Shuffling & Scaling Considerations:
# 

# 4. Failure Recovery, Idempotency & Exactly-Once Semantics:
# 
`;
  }
  return `# Python Data Engineering Assessment: ${q.title}
import pandas as pd
import numpy as np

def solve(data):
    """
    Implement the optimal data transformation or algorithm.
    """
    # TODO: Write your solution here
    pass
`;
}

export const DEPracticeEnvironment: React.FC<DEPracticeEnvironmentProps> = ({
  question,
  onSolved,
  onSaveToNotes,
  onAddMistake,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const env = useMemo(() => detectEnvironment(question), [question]);

  // Storage key per question
  const storageKey = `akku_de_code_${question.id}_${env}`;
  const attemptsKey = `akku_de_attempts_${question.id}`;
  const solvedKey = `akku_de_solved_${question.id}`;
  const viewedKey = `akku_de_viewed_${question.id}`;

  // Current working code
  const [code, setCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && saved.trim()) return saved;
    } catch {}
    return generateDefaultStarter(question, env);
  });

  // Attempt history
  const [attempts, setAttempts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(attemptsKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Solved status
  const [isSolved, setIsSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(solvedKey) === 'true';
    } catch {
      return false;
    }
  });

  // Solution revealed status
  const [solutionRevealed, setSolutionRevealed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(viewedKey) === 'true';
    } catch {
      return false;
    }
  });

  // Active UI states
  const [activeTab, setActiveTab] = useState<'problem' | 'schema' | 'history'>('problem');
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>('employees');
  const [customInput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Progressive hints (0 to 4)
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);

  // Socratic Stuck Assistant
  const [stuckOpen, setStuckOpen] = useState<boolean>(false);
  const [stuckOption, setStuckOption] = useState<number | null>(null);

  // Show answer confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Elapsed solving timer
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSecs(s => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Sync code auto-save
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    try {
      localStorage.setItem(storageKey, val);
    } catch {}
  };

  // Reset code
  const handleResetCode = () => {
    const fresh = generateDefaultStarter(question, env);
    setCode(fresh);
    try {
      localStorage.setItem(storageKey, fresh);
    } catch {}
    setShowResetModal(false);
  };

  // Progressive Hints generator
  const hints = useMemo(() => {
    const rawHint = question.hint || '';
    const cleanHint = rawHint.replace(/^💡\s*/, '').trim();
    return [
      `1. Requirements Invariant: Focus on the input constraints. Check how ties, null values, or empty sets should be handled.`,
      `2. Target Technique: Consider whether a window function (DENSE_RANK/ROW_NUMBER), a CTE, or an aggregate with GROUP BY fits best.`,
      `3. Structural Guidance: ${cleanHint || 'Break down the problem into a preparation phase (CTE/filter) and an extraction phase.'}`,
      `4. Directional Clue: Remember to partition by department/group and order by the target metric. Avoid non-deterministic ordering.`
    ];
  }, [question.hint]);

  // Format timer
  const formattedTime = useMemo(() => {
    const m = Math.floor(elapsedSecs / 60);
    const s = elapsedSecs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  }, [elapsedSecs]);

  // Execute Code / Query
  const handleExecute = async (mode: 'run' | 'submit') => {
    if (!code || !code.trim()) return;
    setIsRunning(true);

    const startTime = Date.now();
    try {
      if (env === 'sql') {
        // SQL Execution via backend SQLEngine
        const res = await api.academics.executeSQL(code, mode === 'submit' ? question.solution : undefined);
        const duration = Date.now() - startTime;

        const isSuccess = res.success !== false && !res.error;
        const resultPayload = {
          success: isSuccess,
          status: isSuccess ? (mode === 'submit' ? 'Accepted' : 'Query Executed') : 'Query Error',
          mode,
          durationMs: res.execution_time_ms || duration,
          columns: res.columns || (res.rows && res.rows[0] ? Object.keys(res.rows[0]) : []),
          rows: res.rows || [],
          rowCount: res.row_count ?? (res.rows ? res.rows.length : 0),
          error: res.error,
          passed: res.passed ?? isSuccess,
          feedback: isSuccess 
            ? (mode === 'submit' ? '✓ Accepted! Query evaluated against analytical dataset successfully.' : `Returned ${res.rows?.length || 0} rows in ${res.execution_time_ms || duration}ms.`)
            : (res.error || 'Syntax error in SQL statement.'),
        };

        setExecutionResult(resultPayload);

        // Record attempt
        const newAttempt = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          mode,
          status: resultPayload.status,
          success: isSuccess,
          durationMs: resultPayload.durationMs,
          rows: resultPayload.rowCount,
          codeSnippet: code.slice(0, 120),
        };
        const updatedAttempts = [newAttempt, ...attempts].slice(0, 15);
        setAttempts(updatedAttempts);
        try {
          localStorage.setItem(attemptsKey, JSON.stringify(updatedAttempts));
        } catch {}

        if (mode === 'submit' && isSuccess && (res.passed !== false)) {
          setIsSolved(true);
          try {
            localStorage.setItem(solvedKey, 'true');
          } catch {}
          if (onSolved) onSolved(question.id);
        }
      } else {
        // Python / PySpark / Bash execution via backend runner
        const res = await api.academics.runCode(code, customInput, undefined, 6.0);
        const duration = Date.now() - startTime;
        const isSuccess = res.success !== false && !res.error;

        const resultPayload = {
          success: isSuccess,
          status: isSuccess ? (mode === 'submit' ? 'Accepted' : 'Executed') : 'Execution Error',
          mode,
          durationMs: res.execution_time_ms || duration,
          stdout: res.stdout || '',
          stderr: res.stderr || '',
          error: res.error,
          passed: isSuccess,
          feedback: isSuccess ? 'All verification checks executed cleanly.' : (res.error || res.stderr),
        };

        setExecutionResult(resultPayload);

        const newAttempt = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          mode,
          status: resultPayload.status,
          success: isSuccess,
          durationMs: resultPayload.durationMs,
          codeSnippet: code.slice(0, 120),
        };
        const updatedAttempts = [newAttempt, ...attempts].slice(0, 15);
        setAttempts(updatedAttempts);
        try {
          localStorage.setItem(attemptsKey, JSON.stringify(updatedAttempts));
        } catch {}

        if (mode === 'submit' && isSuccess) {
          setIsSolved(true);
          try {
            localStorage.setItem(solvedKey, 'true');
          } catch {}
          if (onSolved) onSolved(question.id);
        }
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        status: 'Network / Sandbox Error',
        mode,
        error: err.message || 'Execution service temporarily unreachable. Check your query syntax.',
        feedback: 'Could not connect to sandbox runner. Verify database query.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Copy solution
  const handleCopySolution = () => {
    navigator.clipboard.writeText(question.solution);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Confirm reveal solution
  const handleConfirmReveal = () => {
    setSolutionRevealed(true);
    setShowConfirmModal(false);
    try {
      localStorage.setItem(viewedKey, 'true');
    } catch {}
  };

  return (
    <div className={`rounded-xl border border-stone-800 bg-[#0c1017] text-stone-200 overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#090d14] flex flex-col' : 'my-3'
    }`}>
      {/* Top Header Bar */}
      <div className="px-4 py-2.5 bg-[#121722] border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            {env === 'sql' ? (
              <Database className="w-4 h-4 text-sky-400" />
            ) : env === 'pyspark' ? (
              <Zap className="w-4 h-4 text-amber-400" />
            ) : env === 'bash' ? (
              <Terminal className="w-4 h-4 text-emerald-400" />
            ) : (
              <Code2 className="w-4 h-4 text-purple-400" />
            )}
            <span className="uppercase tracking-wider font-mono text-[11px]">
              {env === 'sql' ? 'SQL Analytical IDE' : env === 'pyspark' ? 'PySpark IDE' : env === 'bash' ? 'Bash Linux Lab' : env === 'schema' ? 'Data Modeling Lab' : 'Data Engineering IDE'}
            </span>
          </div>

          <span className="text-stone-600">•</span>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950/60 border border-sky-800/50 text-sky-300">
            {question.category || 'Data Engineering'}
          </span>

          {question.company && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 border border-amber-800/50 text-amber-300">
              {question.company}
            </span>
          )}

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            question.difficulty === 'Hard' ? 'bg-rose-950/50 text-rose-300 border-rose-800/50' :
            question.difficulty === 'Moderate' ? 'bg-amber-950/50 text-amber-300 border-amber-800/50' :
            'bg-emerald-950/50 text-emerald-300 border-emerald-800/50'
          }`}>
            {question.difficulty}
          </span>

          {/* Solved / Viewed Status */}
          {isSolved ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-700/50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
          ) : solutionRevealed ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-950/40 border border-sky-700/50 px-2 py-0.5 rounded-full">
              <Eye className="w-3 h-3" /> Solution Viewed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-full">
              🟡 In Progress
            </span>
          )}
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400 bg-[#161c28] px-2.5 py-1 rounded-md border border-stone-800">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>{formattedTime}</span>
          </div>

          {/* Bookmark */}
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(question.id)}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                  : 'bg-[#161c28] border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md bg-[#161c28] border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen IDE'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Split Grid (Problem on Left, IDE on Right) */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-800 ${
        isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[580px]'
      }`}>
        {/* Left Column: Problem Statement & Schema Explorer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#0d1118] overflow-y-auto max-h-[600px] lg:max-h-[700px] p-4 gap-3 text-xs leading-relaxed">
          {/* Left Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-stone-800/80 pb-2">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'problem' ? 'bg-sky-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Problem Description
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'schema' ? 'bg-sky-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Dataset & Schema</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history' ? 'bg-sky-600 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Attempts ({attempts.length})</span>
            </button>
          </div>

          {/* TAB 1: Problem Description */}
          {activeTab === 'problem' && (
            <div className="flex flex-col gap-3.5">
              <div>
                <h3 className="text-base font-bold text-stone-100 font-sans leading-snug">
                  {question.title}
                </h3>
                <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px] mt-1">
                  <span>Topic: {question.topic || 'Data Engineering'}</span>
                  <span>•</span>
                  <span>ID: {question.id}</span>
                </div>
              </div>

              {/* Problem Statement Card */}
              <div className="p-3.5 rounded-xl bg-[#141923] border border-stone-800 text-stone-300 whitespace-pre-wrap leading-relaxed">
                <span className="font-bold text-stone-100 block mb-1 text-xs uppercase tracking-wider text-sky-400">
                  Problem Statement:
                </span>
                {question.question}
              </div>

              {/* Understand the Question Socratic Helper */}
              <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/30 text-sky-200">
                <span className="font-bold text-sky-300 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  What is this question testing?
                </span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Focus on partition boundaries, deterministic order, and boundary cases. Test whether your logic handles ties, single rows, and multi-department partitions cleanly.
                </p>
              </div>

              {/* Progressive Hints Section */}
              <div className="rounded-xl border border-stone-800/80 bg-[#121622] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Progressive Hints ({unlockedHintLevel}/4)</span>
                  </span>
                  {unlockedHintLevel < 4 && (
                    <button
                      onClick={() => setUnlockedHintLevel(l => Math.min(4, l + 1))}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      Unlock Next Hint ({unlockedHintLevel + 1})
                    </button>
                  )}
                </div>

                {unlockedHintLevel === 0 ? (
                  <p className="text-[11px] text-stone-400">
                    Try solving the problem first. If you need directional clues without spoiling the solution, unlock a hint!
                  </p>
                ) : (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {hints.slice(0, unlockedHintLevel).map((h, i) => (
                      <div key={i} className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] leading-relaxed">
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* "I'm Stuck" Assistant */}
              <div className="border border-stone-800 rounded-xl bg-[#111520] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-200 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Need Guidance? (I'm Stuck)</span>
                  </span>
                  <button
                    onClick={() => setStuckOpen(!stuckOpen)}
                    className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                  >
                    {stuckOpen ? 'Close' : 'Choose a Challenge'}
                  </button>
                </div>

                {stuckOpen && (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-stone-800/80">
                    {[
                      { id: 1, text: "I don't know which concept or window function to use." },
                      { id: 2, text: "How should I structure the CTE / subquery?" },
                      { id: 3, text: "My query returns multiple rows for ties." },
                      { id: 4, text: "How do I optimize the partitioning performance?" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setStuckOption(stuckOption === opt.id ? null : opt.id)}
                        className={`text-left p-2 rounded text-[11px] transition-all cursor-pointer border ${
                          stuckOption === opt.id 
                            ? 'bg-sky-950/40 border-sky-600 text-sky-200' 
                            : 'bg-[#151a26] border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}

                    {stuckOption === 1 && (
                      <div className="p-2.5 rounded bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-200">
                        💡 <strong>Concept Insight:</strong> Use <code>DENSE_RANK()</code> when you want consecutive ranking with ties (1, 1, 2). Use <code>ROW_NUMBER()</code> if you need an absolute single unique row per partition.
                      </div>
                    )}
                    {stuckOption === 2 && (
                      <div className="p-2.5 rounded bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-200">
                        💡 <strong>CTE Structure:</strong> Define <code>WITH RankedData AS (SELECT ..., DENSE_RANK() OVER (...) as rnk FROM ...)</code> then do <code>SELECT ... FROM RankedData WHERE rnk = 2;</code>
                      </div>
                    )}
                    {stuckOption === 3 && (
                      <div className="p-2.5 rounded bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-200">
                        💡 <strong>Tie Handling:</strong> In SQL placement rounds, if two people have equal second-highest salary, returning both with DENSE_RANK is usually expected unless explicitly stated to break ties with hire_date.
                      </div>
                    )}
                    {stuckOption === 4 && (
                      <div className="p-2.5 rounded bg-sky-950/30 border border-sky-800/40 text-[11px] text-sky-200">
                        💡 <strong>Performance Tip:</strong> In production Spark or PostgreSQL, ensure the partition key (e.g. <code>department_id</code>) and order key are indexed or co-located to avoid full shuffle.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Dataset & Schema Explorer */}
          {activeTab === 'schema' && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Select Table to Inspect:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {Object.keys(SANDBOX_TABLES).map(tableName => (
                  <button
                    key={tableName}
                    onClick={() => setSelectedSchemaTable(tableName)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border ${
                      selectedSchemaTable === tableName
                        ? 'bg-sky-600 text-white border-sky-500 font-bold'
                        : 'bg-[#141a24] text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {tableName}
                  </button>
                ))}
              </div>

              {SANDBOX_TABLES[selectedSchemaTable] && (
                <div className="flex flex-col gap-3 mt-1">
                  {/* Columns Schema */}
                  <div className="rounded-xl border border-stone-800 bg-[#121622] p-3">
                    <span className="font-bold text-[11px] text-stone-300 uppercase tracking-wider block mb-2">
                      Table Columns & Data Types:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                      {SANDBOX_TABLES[selectedSchemaTable].columns.map(col => (
                        <div key={col.name} className="p-1.5 rounded bg-[#161c28] border border-stone-800 flex items-center justify-between">
                          <span className="text-stone-200 font-semibold">{col.name}</span>
                          <span className="text-sky-400 text-[10px]">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Rows Preview */}
                  <div className="rounded-xl border border-stone-800 bg-[#121622] p-3 overflow-x-auto">
                    <span className="font-bold text-[11px] text-stone-300 uppercase tracking-wider block mb-2">
                      Sample Data (First 5 Rows):
                    </span>
                    <table className="w-full text-[11px] font-mono text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-700 text-stone-400">
                          {SANDBOX_TABLES[selectedSchemaTable].columns.map(c => (
                            <th key={c.name} className="py-1 px-2">{c.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800 text-stone-300">
                        {SANDBOX_TABLES[selectedSchemaTable].sample.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-800/40">
                            {SANDBOX_TABLES[selectedSchemaTable].columns.map(c => (
                              <td key={c.name} className="py-1 px-2 whitespace-nowrap">
                                {String(row[c.name] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Attempts History */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs text-stone-300 uppercase tracking-wider mb-1">
                Your Attempt History ({attempts.length}):
              </span>
              {attempts.length === 0 ? (
                <div className="p-8 text-center text-stone-500 bg-[#121622] rounded-xl border border-stone-800">
                  No submissions or runs executed yet. Write code and click "Run Query" or "Submit Solution"!
                </div>
              ) : (
                attempts.map((att, idx) => (
                  <div key={att.id || idx} className="p-3 rounded-xl border border-stone-800 bg-[#131824] flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${att.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {att.status || (att.success ? 'Passed' : 'Failed')}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">{att.timestamp}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 font-mono text-stone-300">
                          {att.mode === 'submit' ? 'SUBMIT' : 'RUN'}
                        </span>
                      </div>
                      <pre className="mt-1.5 font-mono text-[11px] text-stone-400 truncate max-w-[280px]">
                        {att.codeSnippet}...
                      </pre>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0">
                      {att.durationMs}ms
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Results (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#090d14] overflow-hidden">
          {/* Editor Action Toolbar */}
          <div className="px-3 py-2 bg-[#0e131d] border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
              <span className="px-2 py-0.5 rounded bg-[#161c28] border border-stone-800 text-sky-300 font-semibold uppercase">
                {env === 'sql' ? 'PostgreSQL / SQLite' : env === 'pyspark' ? 'PySpark 3.5' : env === 'bash' ? 'Bash 5.0' : 'Python 3.11'}
              </span>
              <span>•</span>
              <button
                onClick={() => setFontSize(f => Math.max(11, f - 1))}
                className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(f => Math.min(18, f + 1))}
                className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                title="Reset editor to default starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              {/* Show Answer Button with Strict Confirmation */}
              {!solutionRevealed ? (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-xs border border-amber-800/50 transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Show Answer</span>
                </button>
              ) : (
                <button
                  onClick={() => setSolutionRevealed(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Hide Solution</span>
                </button>
              )}
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[300px] lg:min-h-[360px] relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={env === 'sql' ? 'sql' : env === 'bash' ? 'shell' : 'python'}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                padding: { top: 8, bottom: 8 },
              }}
            />
          </div>

          {/* Run & Submit Bar */}
          <div className="px-4 py-2.5 bg-[#0f1420] border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExecute('run')}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer shadow-sm border border-stone-700"
              >
                <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <span>{isRunning ? 'Executing...' : env === 'sql' ? 'Run Query' : 'Run Code'}</span>
              </button>

              <button
                onClick={() => handleExecute('submit')}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRunning ? 'Evaluating...' : 'Submit Solution'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">
                Ctrl/Cmd + Enter to run
              </span>
            </div>
          </div>

          {/* Execution Results / Output Panel */}
          <div className="border-t border-stone-800 bg-[#0b0e14] p-3 flex flex-col gap-2 min-h-[140px] max-h-[240px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800/60 pb-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>Execution Output:</span>
                </span>
                {executionResult && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    executionResult.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  }`}>
                    {executionResult.status} ({executionResult.durationMs}ms)
                  </span>
                )}
              </div>

              {/* Add to Mistakes Button when Wrong */}
              {executionResult && !executionResult.success && onAddMistake && (
                <button
                  onClick={() => onAddMistake(question.id, { error: executionResult.error, code })}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Log in Mistakes Notebook</span>
                </button>
              )}
            </div>

            {!executionResult ? (
              <div className="p-4 text-center text-stone-500 font-mono text-xs">
                Write your solution and click "Run Query" or "Submit Solution" to inspect results.
              </div>
            ) : executionResult.error ? (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs font-mono whitespace-pre-wrap">
                <span className="font-bold block text-rose-200 mb-1">Execution Error:</span>
                {executionResult.error}
              </div>
            ) : executionResult.rows && executionResult.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-700 text-stone-400">
                      {executionResult.columns.map((c: string) => (
                        <th key={c} className="py-1 px-2">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 text-stone-200">
                    {executionResult.rows.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-stone-800/30">
                        {executionResult.columns.map((c: string) => (
                          <td key={c} className="py-1 px-2 whitespace-nowrap">
                            {String(row[c] ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[10px] text-stone-400 mt-2 font-mono">
                  {executionResult.feedback}
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-stone-300 p-2 whitespace-pre-wrap">
                {executionResult.stdout || executionResult.feedback || 'Query executed successfully with 0 rows returned.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REVEALED OFFICIAL MODEL SOLUTION SECTION (Strictly protected by default) */}
      {solutionRevealed && (
        <div className="p-5 bg-[#090d14] border-t border-stone-800 flex flex-col gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-bold text-sm text-emerald-300 font-sans">
                  Official Senior Data Engineer Model Solution & Reasoning:
                </h4>
                <p className="text-stone-400 text-[11px]">
                  Review the optimal query logic, complexity trade-offs, and interviewer follow-up considerations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySolution}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141a26] border border-stone-800 hover:border-stone-700 text-stone-200 text-xs transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Solution'}</span>
              </button>

              {onSaveToNotes && (
                <button
                  onClick={() => onSaveToNotes(question)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-300 text-xs hover:bg-sky-900/40 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Save to Revision Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* Model Solution Code Block */}
          <pre className="p-4 rounded-xl bg-[#06080e] border border-stone-800 font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {question.solution}
          </pre>

          {/* Explanation & Why it works */}
          {question.explanation && (
            <div className="p-3.5 rounded-xl bg-[#121622] border border-stone-800 text-stone-300 leading-relaxed">
              <strong className="text-stone-100 block mb-1 font-semibold text-xs uppercase tracking-wider text-sky-400">
                Why This Solution Works & Placement Takeaways:
              </strong>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Complexity & Common Interviewer Traps */}
          {(question.timeComplexity || question.commonTraps) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {question.timeComplexity && (
                <div className="p-3 rounded-xl bg-[#121622] border border-stone-800">
                  <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block mb-1">
                    Algorithmic & IO Complexity
                  </span>
                  <div className="font-mono text-sky-300 text-[11px]">
                    • Time: {question.timeComplexity}
                  </div>
                  <div className="font-mono text-sky-300 text-[11px]">
                    • Space: {question.spaceComplexity || 'O(1) buffer'}
                  </div>
                </div>
              )}
              {question.commonTraps && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30">
                  <span className="font-semibold text-amber-400 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Common Interview Traps
                  </span>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    {question.commonTraps}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL: SHOW ANSWER */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-[#0f1420] border border-amber-800/60 p-5 shadow-2xl text-stone-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Reveal Complete Placement Solution?</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              You have not solved this practical challenge yet. The complete senior placement solution and breakdown will be displayed.
            </p>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200">
              💡 <strong>Placement Tip:</strong> Top MNC interviews test your ability to struggle through boundary conditions. We strongly recommend writing an attempt before revealing the answer!
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/80">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Keep Trying
              </button>
              <button
                onClick={handleConfirmReveal}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Reveal Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: RESET CODE */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-sm w-full rounded-2xl bg-[#0f1420] border border-stone-800 p-5 shadow-2xl text-stone-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Reset Your Code?</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              This will reset the editor to the clean starter template. Your attempt history will still be preserved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/80">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCode}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
