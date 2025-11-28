import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtext, trend, isPositive, icon: Icon, isDarkMode }) => (
    <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${isPositive ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'}`}>
          <Icon size={22} />
        </div>
        <div className={`flex items-center space-x-1 text-xs font-medium ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );

export default StatCard;
