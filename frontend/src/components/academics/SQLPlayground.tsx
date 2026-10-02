import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RotateCcw, 
  Clock, 
  Table as TableIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  History, 
  FileCode2, 
  ArrowRight
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { api } from '../../services/api';
import type { SQLTableSchema } from '../../types/academics';

interface SQLPlaygroundProps {
  initialQuery?: string;
  expectedSQL?: string;
  exerciseTitle?: string;
  onSuccess?: () => void;
  height?: string;
}

const PRESET_QUERIES = [
  {
    name: '1. Star Schema Sales Analysis',
    desc: 'Joins fact_sales with customer & product dimensions',
    sql: `SELECT 
    d.year,
    d.month_name,
    p.category,
    COUNT(f.sales_id) as total_transactions,
    ROUND(SUM(f.total_amount), 2) as total_revenue,
    ROUND(AVG(f.total_amount), 2) as avg_order_val
FROM fact_sales f
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.year, d.month_name, p.category
ORDER BY d.year DESC, total_revenue DESC;`
  },
  {
    name: '2. Running Total by Month (Window Function)',
    desc: 'Calculates cumulative revenue over time',
    sql: `SELECT 
    order_date,
    total_amount,
    SUM(total_amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total_revenue
FROM orders
WHERE status = 'Completed'
ORDER BY order_date;`
  },
  {
    name: '3. Top Spender per City (DENSE_RANK)',
    desc: 'Analytical placement interview classic',
    sql: `WITH ranked_spenders AS (
    SELECT 
        c.city,
        c.name as customer_name,
        SUM(o.total_amount) as total_spent,
        DENSE_RANK() OVER (
            PARTITION BY c.city 
            ORDER BY SUM(o.total_amount) DESC
        ) as city_rank
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.status = 'Completed'
    GROUP BY c.customer_id, c.city, c.name
)
SELECT city, customer_name, total_spent, city_rank
FROM ranked_spenders
WHERE city_rank = 1
ORDER BY total_spent DESC;`
  },
  {
    name: '4. Employee Salary vs Department Average',
    desc: 'Window function comparison for DE interviews',
    sql: `SELECT 
    e.first_name || ' ' || e.last_name as full_name,
    d.dept_name,
    e.salary,
    ROUND(AVG(e.salary) OVER (PARTITION BY e.dept_id), 2) as dept_avg_salary,
    ROUND(e.salary - AVG(e.salary) OVER (PARTITION BY e.dept_id), 2) as diff_from_avg
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
ORDER BY d.dept_name, e.salary DESC;`
  },
  {
    name: '5. Website Funnel Conversions',
    desc: 'Aggregates clickstream events by type',
    sql: `SELECT 
    event_type,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT customer_id) as unique_customers
FROM website_events
GROUP BY event_type
ORDER BY total_events DESC;`
  }
];

export const SQLPlayground: React.FC<SQLPlaygroundProps> = ({
  initialQuery = 'SELECT * FROM fact_sales LIMIT 10;',
  expectedSQL,
  exerciseTitle,
  onSuccess,
  height = '360px'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [tables, setTables] = useState<SQLTableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<SQLTableSchema | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'schema' | 'history'>('editor');
  const [history, setHistory] = useState<any[]>([]);

  // Load database schema on mount
  useEffect(() => {
    loadSchema();
  }, []);

  // Update query when initialQuery prop changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setValidationResult(null);
      setErrorMessage(null);
    }
  }, [initialQuery]);

  const loadSchema = async () => {
    try {
      const data = await api.academics.getSQLSchema();
      if (data && data.tables) {
        setTables(data.tables);
        if (data.tables.length > 0 && !selectedTable) {
          setSelectedTable(data.tables[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load SQL schema:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const items = await api.academics.getSQLHistory();
      if (Array.isArray(items)) {
        setHistory(items);
      }
    } catch (err) {
      console.error('Failed to load query history:', err);
    }
  };

  const handleExecute = async () => {
    if (!query.trim()) return;
    setIsRunning(true);
    setErrorMessage(null);
    setValidationResult(null);

    try {
      const res = await api.academics.executeSQL(query, expectedSQL);
      if (res.error) {
        setErrorMessage(res.error);
        setQueryResult(null);
      } else {
        setQueryResult(res);
        if (expectedSQL) {
          setValidationResult({
            isMatch: res.is_match,
            summary: res.comparison_summary
          });
          if (res.is_match && onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing SQL query.');
      setQueryResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset the SQL sandbox to its initial state? All modified data will be refreshed.')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.academics.resetSQLDatabase();
      await loadSchema();
      setErrorMessage(null);
      alert('SQL Sandbox database restored to original analytical state.');
    } catch (err) {
      alert('Failed to reset database.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full text-stone-200">
      {/* Exercise / Goal Header if in practice mode */}
      {exerciseTitle && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-sky-950/40 border border-sky-800/40 rounded-xl text-sky-200 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold">{exerciseTitle}</span>
          </div>
          {expectedSQL && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-900/60 border border-sky-700/60 text-sky-300">
              Interactive Test Mode
            </span>
          )}
        </div>
      )}

      {/* Top Toolbar Tabs */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-900/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>SQL Query Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'schema'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-900/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schema & Tables ({tables.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              loadHistory();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-900/40'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Query History</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset query dropdown */}
          <select
            onChange={(e) => {
              const selected = PRESET_QUERIES.find(p => p.name === e.target.value);
              if (selected) {
                setQuery(selected.sql);
                setValidationResult(null);
                setErrorMessage(null);
              }
            }}
            defaultValue=""
            className="text-xs bg-[#161b22] border border-stone-700 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 cursor-pointer hidden md:block"
          >
            <option value="" disabled>Load Preset Interview Query...</option>
            {PRESET_QUERIES.map(q => (
              <option key={q.name} value={q.name}>{q.name}</option>
            ))}
          </select>

          <button
            onClick={handleResetDatabase}
            disabled={isResetting}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
            title="Restore original database records"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Area based on Tab */}
      {activeTab === 'editor' && (
        <div className="flex flex-col gap-3">
          {/* SQL Code Editor */}
          <CodeEditor
            value={query}
            onChange={setQuery}
            language="sql"
            onRun={handleExecute}
            isRunning={isRunning}
            minHeight={height}
            runButtonText="Execute SQL"
          />

          {/* Validation Feedback (if in exercise mode) */}
          {validationResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
              validationResult.isMatch
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              {validationResult.isMatch ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {validationResult.isMatch ? 'Exercise Passed! Zero-Defect Query 🎉' : 'Query Output Mismatch'}
                </div>
                <div className="mt-0.5 opacity-90">{validationResult.summary}</div>
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="whitespace-pre-wrap">{errorMessage}</div>
            </div>
          )}

          {/* Results Grid Table */}
          {queryResult && (
            <div className="flex flex-col rounded-xl border border-stone-800 bg-[#0d1117] overflow-hidden">
              {/* Results status bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-stone-800 text-xs text-stone-400">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Query Success
                  </span>
                  <span>{queryResult.row_count} {queryResult.row_count === 1 ? 'row' : 'rows'} returned</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{queryResult.execution_time_ms} ms</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="max-h-72 overflow-auto scrollbar-thin">
                {queryResult.columns && queryResult.columns.length > 0 ? (
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="sticky top-0 bg-[#1c2128] text-stone-300 border-b border-stone-700 select-none shadow-xs">
                      <tr>
                        <th className="py-2 px-3 text-stone-500 w-10 text-center font-normal">#</th>
                        {queryResult.columns.map((col: string) => (
                          <th key={col} className="py-2 px-3 font-semibold text-sky-300 border-r border-stone-800/80">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {queryResult.rows.map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-sky-950/20 transition-colors">
                          <td className="py-1.5 px-3 text-stone-600 text-center select-none text-[11px]">{rIdx + 1}</td>
                          {row.map((val: any, cIdx: number) => (
                            <td key={cIdx} className="py-1.5 px-3 border-r border-stone-800/40 text-stone-200 whitespace-nowrap">
                              {val === null ? (
                                <span className="text-amber-500/80 italic font-sans text-[11px]">NULL</span>
                              ) : typeof val === 'number' ? (
                                <span className="text-emerald-400">{val}</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-stone-500 text-xs">
                    Query executed successfully. (0 rows returned)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schema Explorer Tab */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-stone-800 bg-[#0d1117] p-3 text-xs">
          {/* Left Table List */}
          <div className="flex flex-col gap-1 border-r border-stone-800 pr-2 max-h-96 overflow-y-auto">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold px-2 mb-1">
              Available Tables ({tables.length})
            </span>
            {tables.map(tbl => (
              <button
                key={tbl.table_name}
                onClick={() => setSelectedTable(tbl)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  selectedTable?.table_name === tbl.table_name
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TableIcon className="w-3.5 h-3.5 opacity-80" />
                  <span className="font-mono">{tbl.table_name}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">{tbl.row_count} r</span>
              </button>
            ))}
          </div>

          {/* Right Selected Table Detail & Sample Preview */}
          <div className="md:col-span-2 flex flex-col gap-3 pl-1 max-h-96 overflow-y-auto">
            {selectedTable ? (
              <>
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    <span className="font-mono font-bold text-stone-100 text-sm">{selectedTable.table_name}</span>
                    <span className="text-stone-400 text-xs">({selectedTable.row_count} total rows)</span>
                  </div>
                  <button
                    onClick={() => {
                      setQuery(`SELECT * FROM ${selectedTable.table_name} LIMIT 10;`);
                      setActiveTab('editor');
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs transition-colors"
                  >
                    <span>Query this table</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Columns Definition */}
                <div>
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                    Columns Schema ({selectedTable.columns.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px]">
                    {selectedTable.columns.map(col => (
                      <div key={col.name} className="p-2 rounded bg-[#161b22] border border-stone-800/80 flex items-center justify-between">
                        <span className="text-stone-200">{col.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-400">{col.type}</span>
                          {col.pk && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-sans">PK</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Rows Preview */}
                {selectedTable.sample_rows && selectedTable.sample_rows.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                      Sample Data (First 3 rows)
                    </div>
                    <div className="overflow-x-auto rounded border border-stone-800">
                      <table className="w-full text-left text-[11px] font-mono border-collapse">
                        <thead className="bg-[#1c2128] text-stone-300">
                          <tr>
                            {selectedTable.columns.map(col => (
                              <th key={col.name} className="p-1.5 border-b border-stone-700">{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTable.sample_rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-stone-800/50">
                              {selectedTable.columns.map(col => (
                                <td key={col.name} className="p-1.5 text-stone-300 truncate max-w-[120px]">
                                  {String(row[col.name] ?? 'NULL')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-stone-500 text-center py-12">Select a table on the left to view its schema.</div>
            )}
          </div>
        </div>
      )}

      {/* Query History Tab */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-stone-800 bg-[#0d1117] p-3 text-xs max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-stone-300">Recent Query History</span>
            <span className="text-[11px] text-stone-500">{history.length} recent executions</span>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-stone-500">No SQL queries executed yet. Run a query in the editor!</div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-2.5 rounded-lg bg-[#161b22] border border-stone-800 hover:border-sky-500/50 transition-all flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="text-emerald-400 font-mono">
                      {item.execution_time_ms ? `${item.execution_time_ms} ms` : 'Success'}
                    </span>
                    <span>{item.created_at ? new Date(item.created_at).toLocaleTimeString() : ''}</span>
                  </div>
                  <pre className="font-mono text-stone-200 text-xs overflow-x-auto whitespace-pre-wrap line-clamp-2">
                    {item.query}
                  </pre>
                  <button
                    onClick={() => {
                      setQuery(item.query);
                      setActiveTab('editor');
                    }}
                    className="self-end text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>Load into editor</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
