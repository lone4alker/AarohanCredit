const CreditScoreGauge = ({ score, isDarkMode }) => {
    // Simple rotation logic for gauge
    const rotation = ((score / 900) * 180) - 90;
    
    // Dynamic color based on score
    const getColor = (s) => {
      if (s >= 750) return '#10b981'; // Emerald
      if (s >= 650) return '#f59e0b'; // Amber
      return '#ef4444'; // Red
    };
    
    const scoreColor = getColor(score);
  
    return (
      <div className="relative h-full min-h-[160px] flex flex-col items-center justify-center">
         {/* Speedometer Arc */}
         <div className="relative w-48 h-24 overflow-hidden mt-4">
           {/* Background Arc */}
           <div className={`absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'} box-border`}></div>
           {/* Active Arc */}
           <div 
             className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-transparent border-t-current transition-transform duration-1000 ease-out box-border"
             style={{ 
               transform: `rotate(${rotation}deg)`,
               color: scoreColor
             }}
           ></div>
         </div>
  
         {/* Score Text */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-center">
           <div className="text-4xl font-bold mb-1" style={{ color: scoreColor }}>{score}</div>
           <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-widest`}>Credit Score</div>
         </div>
  
         <div className="mt-8 text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300'} border`}>
              Good Standing
            </span>
         </div>
      </div>
    );
  };

export default CreditScoreGauge;
