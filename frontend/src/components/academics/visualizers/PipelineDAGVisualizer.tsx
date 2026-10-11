import React, { useState } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  RefreshCw,
  Info,
  Sparkles
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export type TaskStatus = 'queued' | 'running' | 'success' | 'failed' | 'upstream_failed' | 'retrying';

interface DAGTask {
  id: string;
  label: string;
  upstream: string[];
  status: TaskStatus;
  retryCount: number;
}

export const PipelineDAGVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [tasks, setTasks] = useState<DAGTask[]>([
    { id: 'extract', label: '1. extract_s3_orders', upstream: [], status: 'success', retryCount: 0 },
    { id: 'validate', label: '2. validate_schema_dbt', upstream: ['extract'], status: 'success', retryCount: 0 },
    { id: 'dim_customer', label: '3. transform_dim_customer', upstream: ['validate'], status: 'success', retryCount: 0 },
    { id: 'fact_sales', label: '4. build_fact_sales', upstream: ['validate', 'dim_customer'], status: 'success', retryCount: 0 },
    { id: 'alert', label: '5. dq_alert_slack', upstream: ['fact_sales'], status: 'success', retryCount: 0 }
  ]);

  const handleSimulateFailure = () => {
    setSimulateFailure(true);
    setTasks([
      { id: 'extract', label: '1. extract_s3_orders', upstream: [], status: 'success', retryCount: 0 },
      { id: 'validate', label: '2. validate_schema_dbt', upstream: ['extract'], status: 'failed', retryCount: 1 },
      { id: 'dim_customer', label: '3. transform_dim_customer', upstream: ['validate'], status: 'upstream_failed', retryCount: 0 },
      { id: 'fact_sales', label: '4. build_fact_sales', upstream: ['validate', 'dim_customer'], status: 'upstream_failed', retryCount: 0 },
      { id: 'alert', label: '5. dq_alert_slack', upstream: ['fact_sales'], status: 'upstream_failed', retryCount: 0 }
    ]);
  };

  const handleTriggerRetry = () => {
    // Retry step 1: task goes to retrying
    setTasks(prev => prev.map(t => t.id === 'validate' ? { ...t, status: 'retrying', retryCount: 2 } : t));

    // After 1 second, recover to success
    setTimeout(() => {
      setSimulateFailure(false);
      setTasks([
        { id: 'extract', label: '1. extract_s3_orders', upstream: [], status: 'success', retryCount: 0 },
        { id: 'validate', label: '2. validate_schema_dbt', upstream: ['extract'], status: 'success', retryCount: 2 },
        { id: 'dim_customer', label: '3. transform_dim_customer', upstream: ['validate'], status: 'success', retryCount: 0 },
        { id: 'fact_sales', label: '4. build_fact_sales', upstream: ['validate', 'dim_customer'], status: 'success', retryCount: 0 },
        { id: 'alert', label: '5. dq_alert_slack', upstream: ['fact_sales'], status: 'success', retryCount: 0 }
      ]);
    }, 1200);
  };

  const handleReset = () => {
    setSimulateFailure(false);
    setTasks([
      { id: 'extract', label: '1. extract_s3_orders', upstream: [], status: 'success', retryCount: 0 },
      { id: 'validate', label: '2. validate_schema_dbt', upstream: ['extract'], status: 'success', retryCount: 0 },
      { id: 'dim_customer', label: '3. transform_dim_customer', upstream: ['validate'], status: 'success', retryCount: 0 },
      { id: 'fact_sales', label: '4. build_fact_sales', upstream: ['validate', 'dim_customer'], status: 'success', retryCount: 0 },
      { id: 'alert', label: '5. dq_alert_slack', upstream: ['fact_sales'], status: 'success', retryCount: 0 }
    ]);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Apache Airflow: Interactive DAG Orchestration & Failure Recovery Engine</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            DAG ID: <code className="font-mono text-purple-400 font-bold">daily_ecommerce_etl_v2</code>. Test pipeline dependencies, backoff retries, and upstream failure propagation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!simulateFailure ? (
            <button
              onClick={handleSimulateFailure}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Task Failure</span>
            </button>
          ) : (
            <button
              onClick={handleTriggerRetry}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Execute Retry #2 & Recover</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              isDark ? 'bg-[#161f30] text-stone-300 border-stone-700' : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DAG Flowchart Graph */}
      <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-4 ${
        isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full">
          {tasks.map((t, idx) => {
            let statusColor = '';
            let statusLabel = '';
            if (t.status === 'success') {
              statusColor = 'bg-emerald-600 text-white border-emerald-400';
              statusLabel = 'SUCCESS';
            } else if (t.status === 'failed') {
              statusColor = 'bg-rose-600 text-white border-rose-400 animate-pulse';
              statusLabel = `FAILED (Retry ${t.retryCount})`;
            } else if (t.status === 'upstream_failed') {
              statusColor = 'bg-stone-800 text-stone-500 border-stone-700 opacity-60';
              statusLabel = 'UPSTREAM_FAILED';
            } else if (t.status === 'retrying') {
              statusColor = 'bg-amber-600 text-white border-amber-400 animate-bounce';
              statusLabel = 'RETRYING...';
            }

            return (
              <React.Fragment key={t.id}>
                <div className={`p-3 rounded-xl border font-mono text-xs flex flex-col gap-1 shadow-md min-w-[150px] transition-all ${statusColor}`}>
                  <span className="font-bold truncate">{t.label}</span>
                  <div className="flex items-center justify-between text-[9px] opacity-90 border-t border-white/20 pt-1">
                    <span>state:</span>
                    <span className="font-extrabold">{statusLabel}</span>
                  </div>
                </div>
                {idx < tasks.length - 1 && (
                  <span className="text-stone-500 font-bold font-mono text-sm hidden sm:inline">➔</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono pt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span>Success</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-stone-600"></span>
            <span>Upstream Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
            <span>Retrying</span>
          </div>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-lg border text-xs ${
        isDark ? 'bg-[#101624] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
      }`}>
        <Info className="w-4 h-4 text-purple-400 inline mr-1.5" />
        <strong>Idempotency & Retry Guarantee:</strong> When an upstream task like <code className="text-amber-300">validate_schema_dbt</code> fails, Airflow immediately stops downstream dependent tasks (<code className="text-stone-400">build_fact_sales</code>) from running on bad data. Retries with exponential backoff prevent downstream corruption!
      </div>
    </div>
  );
};
