import { Activity, FileText, Building2, TrendingDown, CheckCircle, Bell, Wallet } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import CreditScoreGauge from '../components/CreditScoreGauge';
import StatCard from '../components/StatCard';
import { cashFlowData, transactionData } from '../data/mockData';

const Home = ({ isDarkMode }) => {
    return (
      <div className="space-y-6">
        
        {/* SECTION 1: Top Level Stats & Credit Score (Immediate Visibility) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Credit Score - Prominent (Spans 4 columns) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Activity className="text-gray-300 dark:text-gray-600" size={100} strokeWidth={0.5} />
            </div>
            <div className="relative z-10 h-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-800 dark:text-white font-semibold">Financial Health</h3>
                <Activity size={18} className="text-indigo-500 dark:text-indigo-400"/>
              </div>
              <CreditScoreGauge score={780} isDarkMode={isDarkMode} />
            </div>
          </div>
  
          {/* Key Metrics (Spans 8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard 
              title="Total Revenue" 
              value="₹ 12.5 L" 
              trend="+12%" 
              isPositive={true} 
              icon={Wallet} 
            />
            <StatCard 
              title="Avg. Daily Balance" 
              value="₹ 2.1 L" 
              trend="+5%" 
              isPositive={true} 
              icon={Building2} 
            />
            <StatCard 
              title="Monthly Burn" 
              value="₹ 8.2 L" 
              trend="-2.4%" 
              isPositive={false} 
              icon={TrendingDown} 
            />
            
            {/* Quick Action Banner in grid */}
            <div className="sm:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-indigo-900/50 dark:to-purple-900/50 border border-blue-200 dark:border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-gray-800 dark:text-white font-medium text-sm">Loan Application Draft</h4>
                  <p className="text-blue-800 dark:text-indigo-200 text-xs">You have a pending application.</p>
                </div>
              </div>
              <button className="text-gray-800 dark:text-white text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                Resume
              </button>
            </div>
          </div>
        </div>
  
        {/* SECTION 2: Analytics & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cash Flow Analysis</h3>
              <select className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-none px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={isDarkMode ? 0.3 : 0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={isDarkMode ? 0.3 : 0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} opacity={0.5} vertical={false} />
                  <XAxis dataKey="month" stroke={isDarkMode ? "#6b7280" : "#9ca3af"} tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                  <YAxis stroke={isDarkMode ? "#6b7280" : "#9ca3af"} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                  />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" name="Expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/* Side Panel: Recommendations & Mix */}
          <div className="space-y-6">
            
            {/* Transaction Mix */}
            <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Transaction Volume</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData} layout="vertical" barSize={12}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} tickLine={false} axisLine={false} width={40} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderColor: isDarkMode ? '#374151' : '#e5e7eb', borderRadius: '6px', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {transactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
  
            {/* AI Guidance List */}
            <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">AI Guidance</h3>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/50">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200">High Approval Chance</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Your cash flow consistency score is 85%.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/50">
                  <Bell size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200">Missing GST Filing</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Upload Oct 2025 return to boost score.</p>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    );
  };

export default Home;

