import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">$</span>
          </div>
          <span className="text-xl font-bold">AarohanCredit</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {['Home', 'About', 'Feature', 'Page'].map((item) => (
            <a key={item} href="#" className="flex items-center gap-1 hover:text-[#00ff88] transition-colors">
              {item}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          ))}
          <a href="#" className="flex items-center gap-1 hover:text-[#00ff88] transition-colors">
            Cart (0)
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 hover:text-[#00ff88] transition-colors">Log in</button>
          <button className="px-6 py-2 bg-[#00ff88] text-black font-semibold rounded-md hover:bg-[#00e677] transition-colors">
            GET STARTED
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        {/* Glowing Dollar Bills Graphic */}
        <div className="relative mb-8 w-full max-w-2xl h-64 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Animated glowing dollar bills */}
            {[0, 1, 2, 3, 4].map((index) => {
              const rotation = -15 + index * 7;
              const scale = 0.8 + index * 0.1;
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${10 + (index % 2) * 20}%`,
                    filter: 'drop-shadow(0 0 20px #00ff88) drop-shadow(0 0 40px #00ff88)',
                    animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                  }}
                >
                  <div
                    style={{
                      transform: 'translateY(0)',
                      animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                <div className="w-24 h-48 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute top-2 left-2 text-black font-bold text-xs">100</div>
                  <div className="absolute bottom-2 right-2 text-black font-bold text-xs">100</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold text-2xl">
                    $
                  </div>
                </div>
              </div>
            </div>
            );
            })}
          </div>
        </div>

        {/* Trust Bar */}
        <div className="flex items-center gap-4 mb-12 px-6 py-3 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/30">
          <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
          <span className="text-sm text-gray-300">
            Trusted by thousands of businesses worldwide | Secure. Reliable. Compliant.
          </span>
          <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center leading-tight">
          <span className="text-gray-200">
            Effortless Payments & Payroll
          </span>
          <br />
          <span className="text-gray-200">
            Fast, Smart, and Seamless.
          </span>
        </h1>

        {/* CTA Button */}
        <button className="px-8 py-4 bg-[#00ff88] text-black font-bold text-lg rounded-md hover:bg-[#00e677] transition-all transform hover:scale-105 shadow-lg shadow-[#00ff88]/50">
          GET STARTED
        </button>
      </main>

    </div>
  );
};

export default LandingPage;

