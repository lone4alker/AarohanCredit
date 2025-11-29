import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const Home = ({ isDarkMode = true, analysisComplete }) => {
  const [financialHealth, setFinancialHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch financial health data from API
    fetchFinancialHealthData();
  }, [analysisComplete]);

  const fetchFinancialHealthData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // FORCE DEMO ID: Always use MSME001 for this demo to show the analyzed data
      const msmeId = 'MSME001';

      // Try to fetch from backend API
      const response = await fetch(`http://localhost:5000/api/financial-health/${msmeId}`);

      if (response.ok) {
        const result = await response.json();
        // The API returns { success: true, financial_health: { ...document } }
        const doc = result.financial_health || result.data?.financial_health || result;

        // Flatten the nested financial_health object (from Python script structure) to top level
        // This ensures net_cashflow, total_inflow etc are accessible directly
        const flattenedData = {
          ...doc,
          ...(doc.financial_health || {})
        };

        setFinancialHealth(flattenedData);
      } else {
        // Fallback to mock data if API not available
        loadMockData();
      }
    } catch (error) {
      console.error('Error fetching financial health:', error);
      // Fallback to mock data
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data structure matching output_report.json financial_health section
    setFinancialHealth({
      total_inflow: 6346000.0,
      total_outflow: 4793425.0,
      net_cashflow: 1552575.0,
      average_balance: 627303.06,
      min_balance: 35000.0,
      max_balance: 1545170.0,
      volatility_score: 0.0605,
      seasonality_detected: true,
      stress_indicators: ["High balance volatility"],
      cashflow_stability_score: 0.9405,
      transaction_count: 108,
      period_start: "2025-01-03",
      period_end: "2025-12-28",
      categorized_transactions: {
        operational: 88,
        tax: 12,
        financing: 8
      },
      metadata: {
        pattern_analysis: {
          has_seasonality: true,
          volatility: 0.0605,
          regular_credits: true,
          regular_debits: true,
          monthly_breakdown: {
            "2025-01": { credits: 490000.0, debits: 325300.0, count: 9 },
            "2025-02": { credits: 547000.0, debits: 392900.0, count: 9 },
            "2025-03": { credits: 488000.0, debits: 389400.0, count: 9 },
            "2025-04": { credits: 531000.0, debits: 447200.0, count: 9 },
            "2025-05": { credits: 476000.0, debits: 371700.0, count: 9 },
            "2025-06": { credits: 551000.0, debits: 401550.0, count: 9 },
            "2025-07": { credits: 575000.0, debits: 423800.0, count: 9 },
            "2025-08": { credits: 521000.0, debits: 347390.0, count: 9 },
            "2025-09": { credits: 566000.0, debits: 414080.0, count: 9 },
            "2025-10": { credits: 502000.0, debits: 372950.0, count: 9 },
            "2025-11": { credits: 536000.0, debits: 398560.0, count: 9 },
            "2025-12": { credits: 563000.0, debits: 508595.0, count: 9 }
          }
        },
        balance_volatility: 422329.87,
        inflow_count: 36,
        outflow_count: 72
      }
    });
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FF75] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading financial health data...</p>
        </div>
      </div>
    );
  }

  if (!financialHealth) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#00FF75]/50 mx-auto mb-4" />
          <p className="text-white/60">No financial health data available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const monthlyBreakdown = financialHealth?.metadata?.pattern_analysis?.monthly_breakdown
    || financialHealth?.monthly_breakdown
    || {};

  const monthlyData = Object.entries(monthlyBreakdown).map(([month, data]) => {
    const credits = data.credits || 0;
    const debits = data.debits || 0;
    const net = credits - debits;
    return {
      month: month.substring(5), // Extract MM from YYYY-MM
      credits: credits,
      debits: debits,
      net: net,
      fullMonth: month
    };
  }).sort((a, b) => a.fullMonth.localeCompare(b.fullMonth));

  const transactionData = financialHealth.categorized_transactions
    ? [
      { name: 'Operational', value: financialHealth.categorized_transactions.operational || 0, color: '#00FF75' },
      { name: 'Tax', value: financialHealth.categorized_transactions.tax || 0, color: '#10b981' },
      { name: 'Financing', value: financialHealth.categorized_transactions.financing || 0, color: '#0DF86A' }
    ]
    : [];

  const stabilityScore = Math.round((financialHealth.cashflow_stability_score || 0) * 100);
  const volatilityScore = (financialHealth.volatility_score || 0) * 100;
  const creditScore = financialHealth.overall_creditworthiness ? Math.round(financialHealth.overall_creditworthiness) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financial Health Analysis</h1>
          <p className="text-white/60 text-sm">
            Period: {new Date(financialHealth.period_start || Date.now()).toLocaleDateString()} - {new Date(financialHealth.period_end || Date.now()).toLocaleDateString()}
          </p>
        </div>
        {creditScore && (
          <div className="bg-[#151920] border border-[#00FF75]/20 px-6 py-3 rounded-xl flex items-center space-x-4">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider">Credit Score</p>
              <p className="text-3xl font-bold text-[#00FF75]">{creditScore}/100</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${financialHealth.risk_level === 'low' ? 'bg-[#00FF75]/20 text-[#00FF75]' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {financialHealth.risk_level?.toUpperCase() || 'UNKNOWN'} RISK
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Cashflow */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium">Net Cashflow</span>
            <div className="w-10 h-10 bg-[#00FF75]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00FF75]" />
            </div>
          </div>
          <p className={`text-3xl font-bold mb-2 ${financialHealth.net_cashflow >= 0 ? 'text-[#00FF75]' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(financialHealth.net_cashflow || 0))}
          </p>
          <div className="flex items-center text-xs">
            {financialHealth.net_cashflow >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-[#00FF75] mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className={financialHealth.net_cashflow >= 0 ? 'text-[#00FF75]' : 'text-red-400'}>
              {financialHealth.net_cashflow >= 0 ? 'Positive' : 'Negative'} cash flow
            </span>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium">Total Inflow</span>
            <div className="w-10 h-10 bg-[#00FF75]/20 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-[#00FF75]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatCurrency(financialHealth.total_inflow || 0)}
          </p>
          <p className="text-white/40 text-xs">{formatNumber(financialHealth.total_inflow || 0)} transactions</p>
        </div>

        {/* Total Outflow */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium">Total Outflow</span>
            <div className="w-10 h-10 bg-[#00FF75]/20 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-[#00FF75]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatCurrency(financialHealth.total_outflow || 0)}
          </p>
          <p className="text-white/40 text-xs">{formatNumber(financialHealth.total_outflow || 0)} transactions</p>
        </div>

        {/* Average Balance */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium">Avg. Balance</span>
            <div className="w-10 h-10 bg-[#00FF75]/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#00FF75]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatCurrency(financialHealth.average_balance || 0)}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Min: {formatCurrency(financialHealth.min_balance || 0)}</span>
            <span className="text-white/40">Max: {formatCurrency(financialHealth.max_balance || 0)}</span>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      {financialHealth.explainability?.key_insights && (
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 text-[#00FF75] mr-2" />
            AI-Driven Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialHealth.explainability.key_insights.slice(0, 4).map((insight, index) => (
              <div key={index} className="bg-[#0a0d12]/50 p-4 rounded-xl border border-white/5 flex items-start">
                <div className="w-2 h-2 rounded-full bg-[#00FF75] mt-2 mr-3 flex-shrink-0" />
                <p className="text-white/80 text-sm leading-relaxed">{insight.split('/')[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cashflow Stability & Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Stability Score */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
          <h3 className="text-white font-semibold mb-4">Cashflow Stability</h3>
          <div className="relative w-full h-40 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#151920"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#00FF75"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${stabilityScore * 3.516} 395.84`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#00FF75]">{stabilityScore}%</span>
                <span className="text-xs text-white/60">Stability</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Volatility Score</span>
              <span className="text-white font-medium">{volatilityScore.toFixed(2)}%</span>
            </div>
            {financialHealth.seasonality_detected && (
              <div className="flex items-center text-sm text-[#00FF75]">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span>Seasonality detected</span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Categories */}
        <div className="lg:col-span-2 bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
          <h3 className="text-white font-semibold mb-4">Transaction Categories</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionData} layout="vertical" barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0d12',
                    border: '1px solid #00FF75/30',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [value, 'Transactions']}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}-${entry.name}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {transactionData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/60 text-xs">{item.name}</span>
                </div>
                <p className="text-xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Cashflow Chart */}
      <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Monthly Cashflow Analysis</h3>
          <div className="flex items-center space-x-4 text-xs text-white/60">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#00FF75] mr-2"></div>
              <span>Credits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
              <span>Debits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span>Net</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF75" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00FF75" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDebits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0d12',
                  border: '1px solid #00FF75/30',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => [formatCurrency(value), name]}
                labelStyle={{ color: '#fff' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="credits"
                name="Credits"
                stroke="#00FF75"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCredits)"
              />
              <Area
                type="monotone"
                dataKey="debits"
                name="Debits"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDebits)"
              />
              <Line
                type="monotone"
                dataKey="net"
                name="Net Cashflow"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stress Indicators & Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stress Indicators */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
          <h3 className="text-white font-semibold mb-4">Stress Indicators</h3>
          {financialHealth.stress_indicators && financialHealth.stress_indicators.length > 0 ? (
            <div className="space-y-3">
              {financialHealth.stress_indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 rounded-lg bg-[#0a0d12]/50 border border-red-400/20"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-white/80 text-sm">{indicator}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center p-3 rounded-lg bg-[#0a0d12]/50 border border-[#00FF75]/20">
              <CheckCircle2 className="w-5 h-5 text-[#00FF75] mr-3" />
              <p className="text-white/80 text-sm">No stress indicators detected</p>
            </div>
          )}
        </div>

        {/* Additional Metrics */}
        <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
          <h3 className="text-white font-semibold mb-4">Additional Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total Transactions</span>
              <span className="text-white font-semibold">{financialHealth.transaction_count || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Balance Range</span>
              <span className="text-white font-semibold">
                {formatCurrency(financialHealth.min_balance || 0)} - {formatCurrency(financialHealth.max_balance || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Volatility Score</span>
              <span className="text-white font-semibold">{(volatilityScore).toFixed(2)}%</span>
            </div>
            {financialHealth.seasonality_detected !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Seasonality</span>
                <span className={`font-semibold ${financialHealth.seasonality_detected ? 'text-[#00FF75]' : 'text-white/60'}`}>
                  {financialHealth.seasonality_detected ? 'Detected' : 'Not Detected'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


