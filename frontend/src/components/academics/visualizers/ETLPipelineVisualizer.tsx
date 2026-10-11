import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Cpu, 
  HardDrive,
  Info,
  Sparkles
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

interface RawRecord {
  order_id: string;
  customer_id: string | null;
  amount: number;
  currency: string;
  status: string;
}

export const ETLPipelineVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [activeStage, setActiveStage] = useState<number>(0);
  const stages = [
    { id: 'extract', label: '1. Extract (Source Raw Data)', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'validate', label: '2. Validate (Data Quality Rules)', icon: <Filter className="w-4 h-4" /> },
    { id: 'transform', label: '3. Transform (Business Logic & Schema)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'load', label: '4. Load (Star Schema Analytics Mart)', icon: <Database className="w-4 h-4" /> }
  ];

  const rawRecords: RawRecord[] = [
    { order_id: 'ORD-901', customer_id: 'CUST-10', amount: 150.00, currency: 'USD', status: 'COMPLETED' },
    { order_id: 'ORD-902', customer_id: null, amount: 80.00, currency: 'USD', status: 'PENDING' }, // INVALID (null customer)
    { order_id: 'ORD-903', customer_id: 'CUST-42', amount: -25.00, currency: 'EUR', status: 'FAILED' },  // INVALID (negative amount)
    { order_id: 'ORD-904', customer_id: 'CUST-55', amount: 320.00, currency: 'EUR', status: 'COMPLETED' },
    { order_id: 'ORD-905', customer_id: 'CUST-78', amount: 210.00, currency: 'USD', status: 'COMPLETED' }
  ];

  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Interactive Data Engineering ETL / ELT Pipeline Simulator</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Trace live records from raw OLTP ingest through data quality validation, currency standardization, and Kimball Star Schema loading.
          </p>
        </div>

        <button
          onClick={() => setActiveStage(0)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer ${
            isDark ? 'bg-[#161f30] text-stone-300 border-stone-700' : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Pipeline</span>
        </button>
      </div>

      {/* Stage Navigation Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {stages.map((stg, idx) => {
          const isCurrent = activeStage === idx;
          const isPassed = activeStage > idx;
          return (
            <button
              key={stg.id}
              onClick={() => setActiveStage(idx)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/40 shadow-md font-bold'
                  : isPassed
                  ? isDark ? 'bg-[#111927] border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : isDark ? 'bg-[#0f1420] border-stone-800 text-stone-500' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${isCurrent ? 'bg-white/20' : ''}`}>
                {stg.icon}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] block truncate">{stg.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* PIPELINE STAGE CONTENT */}
      <div className={`p-5 rounded-xl border flex flex-col gap-4 ${
        isDark ? 'bg-[#070a10] border-stone-800' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* STAGE 0: EXTRACT */}
        {activeStage === 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-400 font-mono">Input: Webstore OLTP Database CDC / REST API (5 Raw JSON Records)</span>
              <span className="opacity-75">Schema: order_id, customer_id, amount, currency, status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className={isDark ? 'bg-[#121824] text-stone-300' : 'bg-slate-200 text-slate-700'}>
                    <th className="p-2 rounded-l">order_id</th>
                    <th className="p-2">customer_id</th>
                    <th className="p-2">amount</th>
                    <th className="p-2">currency</th>
                    <th className="p-2 rounded-r">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {rawRecords.map((r, i) => (
                    <tr key={i} className={isDark ? 'hover:bg-stone-800/20' : 'hover:bg-slate-100'}>
                      <td className="p-2 font-bold text-sky-400">{r.order_id}</td>
                      <td className={`p-2 ${!r.customer_id ? 'text-rose-400 font-bold bg-rose-950/20' : ''}`}>
                        {r.customer_id || 'NULL'}
                      </td>
                      <td className={`p-2 ${r.amount < 0 ? 'text-rose-400 font-bold bg-rose-950/20' : ''}`}>
                        {r.amount}
                      </td>
                      <td className="p-2">{r.currency}</td>
                      <td className="p-2">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`p-3 rounded-lg border text-xs ${
              isDark ? 'bg-[#101624] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
            }`}>
              <Info className="w-4 h-4 text-sky-400 inline mr-1.5" />
              Ingested raw records into staging buffer. Notice dirty data: Record 2 has a NULL customer_id, and Record 3 has a negative amount (-25.00 EUR).
            </div>
          </div>
        )}

        {/* STAGE 1: VALIDATE */}
        {activeStage === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Data Quality Assertion Engine: Great Expectations / dbt Test Assertions</span>
              <span>2 Violations Detected</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                <span>Rule: expect_column_values_to_not_be_null('customer_id')</span>
                <span className="text-rose-400 font-bold">ORD-902 FAILED (customer_id is null)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                <span>Rule: expect_column_values_to_be_between('amount', min_value=0.01)</span>
                <span className="text-rose-400 font-bold">ORD-903 FAILED (amount = -25.00)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                <span>Rule: expect_column_values_to_be_in_set('status', ['COMPLETED', 'PENDING'])</span>
                <span className="text-emerald-400 font-bold">PASSED</span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-xs text-rose-300 bg-rose-950/20 border-rose-900/50`}>
              <AlertTriangle className="w-4 h-4 inline mr-1.5 text-rose-400" />
              Corrupt records ORD-902 and ORD-903 are automatically diverted to a <strong>Dead Letter Queue (DLQ)</strong> for investigation without crashing the pipeline! 3 valid records advance to Transform.
            </div>
          </div>
        )}

        {/* STAGE 2: TRANSFORM */}
        {activeStage === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 font-mono">
              <span>Transformation Logic: Currency Standardization (EUR ➔ USD @ 1.08) & Date Keys</span>
              <span>3 Valid Records Standardized</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className={isDark ? 'bg-[#121824] text-stone-300' : 'bg-slate-200 text-slate-700'}>
                    <th className="p-2 rounded-l">order_id</th>
                    <th className="p-2">customer_id</th>
                    <th className="p-2">orig_amount</th>
                    <th className="p-2 text-emerald-400">amount_usd</th>
                    <th className="p-2 rounded-r text-sky-400">tax_amount (8%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  <tr className={isDark ? 'hover:bg-stone-800/20' : 'hover:bg-slate-100'}>
                    <td className="p-2 font-bold text-sky-400">ORD-901</td>
                    <td className="p-2">CUST-10</td>
                    <td className="p-2">$150.00 USD</td>
                    <td className="p-2 font-bold text-emerald-400">$150.00</td>
                    <td className="p-2 text-sky-400">$12.00</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-stone-800/20' : 'hover:bg-slate-100'}>
                    <td className="p-2 font-bold text-sky-400">ORD-904</td>
                    <td className="p-2">CUST-55</td>
                    <td className="p-2">€320.00 EUR</td>
                    <td className="p-2 font-bold text-emerald-400">$345.60</td>
                    <td className="p-2 text-sky-400">$27.65</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-stone-800/20' : 'hover:bg-slate-100'}>
                    <td className="p-2 font-bold text-sky-400">ORD-905</td>
                    <td className="p-2">CUST-78</td>
                    <td className="p-2">$210.00 USD</td>
                    <td className="p-2 font-bold text-emerald-400">$210.00</td>
                    <td className="p-2 text-sky-400">$16.80</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`p-3 rounded-lg border text-xs ${
              isDark ? 'bg-[#101624] border-stone-800 text-stone-300' : 'bg-white border-slate-300 text-slate-800'
            }`}>
              <Info className="w-4 h-4 text-indigo-400 inline mr-1.5" />
              Normalized exchange rates applied. Standardized amounts into a consistent base currency (USD) and derived sales tax for reporting.
            </div>
          </div>
        )}

        {/* STAGE 3: LOAD */}
        {activeStage === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono">
              <span>Loaded into Kimball Star Schema: Snowflake / Databricks `fact_orders` Table</span>
              <span>3 Rows Inserted (Idempotent Merge)</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0d1520] border border-emerald-800/60 font-mono text-xs space-y-2">
              <div className="text-stone-300 font-bold flex items-center justify-between">
                <span>Target Table: dw.fact_orders</span>
                <span className="text-emerald-400 text-[10px]">MERGE COMPLETE ✓</span>
              </div>
              <div className="text-stone-400 text-[11px] leading-relaxed">
                Total Revenue Ingested: <strong className="text-emerald-300 font-bold">$705.60 USD</strong> across 3 clean transactions.<br/>
                All surrogate keys joined against <code className="text-sky-300">dim_customer</code> and <code className="text-sky-300">dim_date</code>.
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-xs text-emerald-300 bg-emerald-950/20 border-emerald-900/50`}>
              <CheckCircle2 className="w-4 h-4 inline mr-1.5 text-emerald-400" />
              Pipeline Finished Successfully! Data is now queryable by business intelligence dashboards (PowerBI, Tableau) with 100% data integrity.
            </div>
          </div>
        )}

        {/* Stepper Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
          <button
            onClick={() => setActiveStage(s => Math.max(0, s - 1))}
            disabled={activeStage === 0}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 ${
              isDark ? 'bg-[#161f30] hover:bg-[#202b42] text-stone-300 border-stone-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="font-mono opacity-75">
            Stage {activeStage + 1} of 4: {stages[activeStage].label.split('(')[0]}
          </span>

          <button
            onClick={() => setActiveStage(s => Math.min(3, s + 1))}
            disabled={activeStage === 3}
            className={`px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 shadow-sm`}
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
