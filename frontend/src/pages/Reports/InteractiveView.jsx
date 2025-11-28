import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  FileText, 
  PieChart, 
  Shield,
  Building,
  Wallet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart, 
  Bar
} from 'recharts';

const INFLOW_TREND_DATA = [
  { month: 'May', inflow: 120000, outflow: 100000 },
  { month: 'Jun', inflow: 135000, outflow: 110000 },
  { month: 'Jul', inflow: 128000, outflow: 115000 },
  { month: 'Aug', inflow: 160000, outflow: 120000 },
  { month: 'Sep', inflow: 190000, outflow: 140000 },
  { month: 'Oct', inflow: 210000, outflow: 150000 },
];

const GST_TURNOVER_DATA = [
  { month: 'May', turnover: 1.2 },
  { month: 'Jun', turnover: 1.3 },
  { month: 'Jul', turnover: 1.25 },
  { month: 'Aug', turnover: 1.6 },
  { month: 'Sep', turnover: 1.9 },
  { month: 'Oct', turnover: 2.1 },
];

const ParameterCard = ({ title, value, subtext, status, icon: Icon }) => {
  const getStatusColor = (s) => {
    switch(s) {
      case 'good': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'danger': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 shadow-sm transition-hover hover:border-indigo-500/30">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <div className={`p-1.5 rounded-lg ${getStatusColor(status)}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</h3>
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center space-x-2 mb-6 mt-8 pb-2 border-b border-gray-200 dark:border-gray-800">
    <Icon className="text-indigo-500" size={20} />
    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
  </div>
);

const ReportInteractive = ({ data }) => {
  const { meta, scores } = data;
  
  return (
    <div className="pb-10 animate-fade-in">
      
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-[#1a1b23] to-[#252630] rounded-2xl p-8 border border-gray-800 relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={150} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">VERIFIED BY AA FRAMEWORK</span>
              <span className="text-gray-500 text-sm flex items-center"><Calendar size={12} className="mr-1"/> Generated: {meta.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Credit Assessment</h1>
            <p className="text-gray-400">ID: {meta.id} • {meta.msmeName}</p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
             <p className="text-sm text-gray-400 mb-1">Composite Health Score</p>
             <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{scores.behavioral}<span className="text-2xl text-gray-500 font-normal">/900</span></div>
          </div>
        </div>
      </div>

      {/* SECTION 1: BANKING */}
      <SectionHeader title="1. Banking & Liquidity Analysis" icon={Building} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
           <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center"><TrendingUp size={16} className="mr-2 text-indigo-500" /> Monthly Inflow vs Outflow</h4>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INFLOW_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" tick={{fontSize: 12}} stroke="#6b7280" />
                  <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12}} stroke="#6b7280" />
                  <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff'}} />
                  <Area type="monotone" dataKey="inflow" stroke="#10b981" fill="url(#colorIn)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outflow" stroke="#f43f5e" fill="url(#colorOut)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="space-y-4">
           <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
              <h5 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2">AI Observation</h5>
              <p className="text-sm text-indigo-700 dark:text-indigo-200 leading-relaxed">"Inflows have grown <strong>18% MoM</strong> leading up to Diwali season. This aligns with expected retail seasonality. Liquidity is sufficient to service a loan of ₹10L."</p>
           </div>
           <ParameterCard title="Inflow/Outflow Ratio" value="1.24" subtext="Healthy surplus margin" status="good" icon={PieChart} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard title="Avg Monthly Balance" value="₹ 1.25 L" subtext="+12% vs last quarter" status="good" icon={Wallet} />
        <ParameterCard title="Daily Stability" value="High" subtext="Low volatility detected" status="good" icon={Activity} />
        <ParameterCard title="Cashflow Volatility" value="14%" subtext="Standard Deviation" status="good" icon={TrendingUp} />
        <ParameterCard title="Vendor Concentration" value="22%" subtext="Max dependency on 1 client" status="good" icon={PieChart} />
      </div>

      {/* SECTION 2: GST */}
      <SectionHeader title="2. Business Behaviour (GST)" icon={FileText} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           <ParameterCard title="GST Filing Status" value="On-Time" subtext="Consistently filed by 20th" status="good" icon={Calendar} />
           <ParameterCard title="Avg Monthly Turnover" value="₹ 16.5 L" subtext="Validated via GSTR-3B" status="good" icon={TrendingUp} />
           <ParameterCard title="B2B vs B2C Ratio" value="60 : 40" subtext="Stable B2B contracts" status="good" icon={PieChart} />
           <ParameterCard title="Input/Output Ratio" value="0.85" subtext="Healthy value add" status="good" icon={Activity} />
        </div>
         <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
           <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">GST Seasonality</h4>
           <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GST_TURNOVER_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false}/>
                  <XAxis dataKey="month" hide />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="turnover" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
         </div>
      </div>
    </div>
  );
};

export default ReportInteractive;