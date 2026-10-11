import React, { useState } from 'react';
import { 
  Database
} from 'lucide-react';
import { useAcademicsTheme } from '../../../context/AcademicsThemeContext';

export const DataModelingVisualizer: React.FC = () => {
  const { isDark } = useAcademicsTheme();

  const [activeTab, setActiveTab] = useState<'star_schema' | 'scd'>('star_schema');
  const [selectedTable, setSelectedTable] = useState<'fact_sales' | 'dim_customer' | 'dim_product' | 'dim_date'>('fact_sales');

  // SCD Type 1 vs Type 2 simulation
  const [scdType, setScdType] = useState<'scd1' | 'scd2'>('scd2');
  const [scdCustomerAddress, setScdCustomerAddress] = useState<'Seattle, WA' | 'Austin, TX'>('Seattle, WA');

  const tables = {
    fact_sales: {
      name: 'fact_sales (Central Fact Table)',
      grain: 'One row per transaction line item in retail checkout',
      pk: 'sales_key (Surrogate Key)',
      fks: ['customer_key', 'product_key', 'date_key', 'store_key'],
      metrics: ['quantity (Additive)', 'total_amount (Additive)', 'discount_amount (Additive)'],
      sample: [
        { sales_id: 1001, customer_key: 42, product_key: 8, date_key: 20261011, amount: 249.99 },
        { sales_id: 1002, customer_key: 15, product_key: 12, date_key: 20261011, amount: 89.50 }
      ]
    },
    dim_customer: {
      name: 'dim_customer (Conformed Dimension)',
      grain: 'One row per unique customer (or version in SCD Type 2)',
      pk: 'customer_key (Surrogate Key)',
      fks: ['None'],
      metrics: ['customer_id (Natural Key)', 'name', 'city', 'tier', 'is_current'],
      sample: [
        { customer_key: 42, customer_id: 'C-901', name: 'Alice Chen', city: 'Seattle', tier: 'Gold' },
        { customer_key: 15, customer_id: 'C-412', name: 'Bob Smith', city: 'Austin', tier: 'Silver' }
      ]
    },
    dim_product: {
      name: 'dim_product (Conformed Dimension)',
      grain: 'One row per SKU merchandise item',
      pk: 'product_key (Surrogate Key)',
      fks: ['category_id'],
      metrics: ['sku_code', 'product_name', 'department', 'unit_cost'],
      sample: [
        { product_key: 8, sku: 'TECH-88', product: 'Wireless Noise-Canceling Headphones', price: 249.99 },
        { product_key: 12, sku: 'HOME-14', product: 'Stainless Steel Pour-Over Kettle', price: 89.50 }
      ]
    },
    dim_date: {
      name: 'dim_date (Role-Playing Dimension)',
      grain: 'One row per calendar day (Pre-computed date analytics)',
      pk: 'date_key (Integer YYYYMMDD)',
      fks: ['None'],
      metrics: ['full_date', 'day_of_week', 'fiscal_quarter', 'is_weekend'],
      sample: [
        { date_key: 20261011, full_date: '2026-10-11', day: 'Sunday', quarter: 'Q4', weekend: true },
        { date_key: 20261012, full_date: '2026-10-12', day: 'Monday', quarter: 'Q4', weekend: false }
      ]
    }
  };

  const curr = tables[selectedTable];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl ${
      isDark ? 'bg-[#0b0f17] border-stone-800 text-stone-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-800/80 mb-4 gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Interactive Kimball Dimensional Data Warehouse & SCD Simulator</span>
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-slate-600'}`}>
            Inspect Star Schema Fact vs Dimension hierarchies, grain definitions, and Slowly Changing Dimension (SCD) historical audit preservation.
          </p>
        </div>

        {/* Tab switch */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-[#121622] border-stone-800' : 'bg-slate-100 border-slate-300'
        }`}>
          <button
            onClick={() => setActiveTab('star_schema')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'star_schema'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kimball Star Schema
          </button>
          <button
            onClick={() => setActiveTab('scd')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'scd'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : isDark ? 'text-stone-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SCD Type 1 vs Type 2
          </button>
        </div>
      </div>

      {/* TAB 1: KIMBALL STAR SCHEMA */}
      {activeTab === 'star_schema' && (
        <div className="space-y-4">
          {/* Interactive Schema Map */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setSelectedTable('fact_sales')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTable === 'fact_sales'
                  ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md scale-[1.02]'
                  : isDark ? 'bg-[#121826] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">Central Fact</div>
              <div className="text-xs sm:text-sm font-bold mt-0.5">fact_sales</div>
            </button>

            <button
              onClick={() => setSelectedTable('dim_customer')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTable === 'dim_customer'
                  ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-md scale-[1.02]'
                  : isDark ? 'bg-[#121826] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">Dimension</div>
              <div className="text-xs sm:text-sm font-bold mt-0.5">dim_customer</div>
            </button>

            <button
              onClick={() => setSelectedTable('dim_product')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTable === 'dim_product'
                  ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-md scale-[1.02]'
                  : isDark ? 'bg-[#121826] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">Dimension</div>
              <div className="text-xs sm:text-sm font-bold mt-0.5">dim_product</div>
            </button>

            <button
              onClick={() => setSelectedTable('dim_date')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTable === 'dim_date'
                  ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-md scale-[1.02]'
                  : isDark ? 'bg-[#121826] border-stone-800 text-stone-300' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">Dimension</div>
              <div className="text-xs sm:text-sm font-bold mt-0.5">dim_date</div>
            </button>
          </div>

          {/* Table Details Inspector */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-[#0f1420] border-stone-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between border-b pb-2 mb-3 border-stone-800/80 gap-2">
              <h5 className="font-bold text-sm text-emerald-500">{curr.name}</h5>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                Grain: {curr.grain}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <strong className="block text-[11px] text-stone-400 uppercase font-mono">Primary Key (Surrogate):</strong>
                <span className="font-mono text-emerald-400 font-bold">{curr.pk}</span>
              </div>
              <div>
                <strong className="block text-[11px] text-stone-400 uppercase font-mono">Foreign Keys:</strong>
                <span className="font-mono text-sky-400">{curr.fks.join(', ')}</span>
              </div>
            </div>

            {/* Sample Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-stone-800 text-stone-400' : 'border-slate-300 text-slate-600'}`}>
                    {Object.keys(curr.sample[0]).map(key => (
                      <th key={key} className="py-1 px-2 font-semibold uppercase text-[10px]">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {curr.sample.map((row: any, i) => (
                    <tr key={i} className={`border-b ${isDark ? 'border-stone-800/50' : 'border-slate-200'}`}>
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="py-1.5 px-2">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCD TYPE 1 VS TYPE 2 */}
      {activeTab === 'scd' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-stone-800/80 bg-stone-900/20">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold">Simulate Customer Move:</span>
              <button
                onClick={() => setScdCustomerAddress(scdCustomerAddress === 'Seattle, WA' ? 'Austin, TX' : 'Seattle, WA')}
                className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Toggle Address: {scdCustomerAddress}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setScdType('scd1')}
                className={`px-3 py-1 rounded-lg border cursor-pointer font-bold ${
                  scdType === 'scd1'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                    : isDark ? 'bg-[#141b2b] text-stone-400 border-stone-700' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                SCD Type 1 (Overwrite)
              </button>
              <button
                onClick={() => setScdType('scd2')}
                className={`px-3 py-1 rounded-lg border cursor-pointer font-bold ${
                  scdType === 'scd2'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : isDark ? 'bg-[#141b2b] text-stone-400 border-stone-700' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                SCD Type 2 (Version Rows)
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            scdType === 'scd1'
              ? isDark ? 'bg-amber-950/20 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              : isDark ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {scdType === 'scd1' ? (
              <div>
                <strong>SCD Type 1 (In-Place Overwrite):</strong> When customer moves from Seattle to Austin, the existing row is updated in place. Historical sales from 2024 will now erroneously report as "Austin sales" in revenue analytics!
              </div>
            ) : (
              <div>
                <strong>SCD Type 2 (Historical Versioning):</strong> The existing Seattle row is marked <code className="font-mono">is_current = False, end_date = 2026-10-10</code>, and a brand new surrogate key row is created for Austin with <code className="font-mono">is_current = True, start_date = 2026-10-11</code>. Historical integrity is 100% preserved!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
