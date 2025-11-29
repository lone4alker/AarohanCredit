import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, Search, TrendingUp, Plane, Bus, Train, Fuel, Dumbbell, CreditCard, Zap, Shield, BarChart3, ChevronDown, Check, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

// Testimonials Column Component
const TestimonialsColumn = ({ testimonials, className = '', duration = 15 }) => {
  return (
    <div className={className}>
      <div 
        className="flex flex-col gap-6 pb-6 animate-scroll-up"
        style={{
          animationDuration: `${duration}s`
        }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map(({ text, name, username, avatar }) => (
                <div 
                  key={`${username}-${index}`}
                  className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20"
                >
                  <div className="text-white/90 text-sm leading-relaxed mb-5">{text}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00FF75] to-[#0DF86A] rounded-full flex items-center justify-center text-[#0a0d12] font-bold text-sm shadow-[0_0_10px_#00ff75]/30">
                      {avatar}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-white">{name}</div>
                      <div className="leading-5 tracking-tight text-white/60 text-xs">{username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        ]}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      text: "As a CFO always on the lookout for innovative financial tools, ProfitWise instantly grabbed my attention with its seamless payroll automation.",
      name: "Jamie Rivera",
      username: "@jamiefinancepro",
      avatar: "JR"
    },
    {
      text: "Our team's productivity has skyrocketed since we started using ProfitWise. The instant payout feature has transformed how we manage contractor payments.",
      name: "Josh Smith",
      username: "@jjsmithcfo",
      avatar: "JS"
    },
    {
      text: "This platform has completely transformed how we handle payroll and financial operations. The real-time analytics are incredibly insightful.",
      name: "Morgan Lee",
      username: "@morganleefinance",
      avatar: "ML"
    },
    {
      text: "I was amazed at how quickly we were able to integrate ProfitWise into our existing workflow. The API documentation is excellent.",
      name: "Casey Jordan",
      username: "@caseyjpayroll",
      avatar: "CJ"
    },
    {
      text: "Managing payroll for hundreds of employees has never been easier. ProfitWise helps us keep track of all payments, ensuring nothing slips through the cracks.",
      name: "Taylor Kim",
      username: "@taylorkimfinance",
      avatar: "TK"
    },
    {
      text: "The customizability and integration capabilities of ProfitWise are top-notch. It seamlessly connects with all our existing tools.",
      name: "Riley Smith",
      username: "@rileysmithcfo",
      avatar: "RS"
    },
    {
      text: "Adopting ProfitWise for our team has streamlined our payment processing and improved financial transparency across the board.",
      name: "Jordan Patels",
      username: "@jpatelsfinance",
      avatar: "JP"
    },
    {
      text: "With ProfitWise, we can easily process payments, track expenses, and manage payroll all in one place. The fraud detection is a game-changer.",
      name: "Sam Dawson",
      username: "@dawsonfintech",
      avatar: "SD"
    },
    {
      text: "Its user-friendly interface and robust features support our diverse financial needs. The instant payouts feature is absolutely brilliant.",
      name: "Casey Harper",
      username: "@casey09finance",
      avatar: "CH"
    }
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const features = [
    {
      icon: Zap,
      title: 'Instant Payouts',
      description: 'Send payments instantly to your team, contractors, and vendors. No waiting, no delays.'
    },
    {
      icon: TrendingUp,
      title: 'Smart Payroll',
      description: 'Automated payroll processing with tax calculations, compliance checks, and direct deposits.'
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'Advanced AI-powered fraud detection to protect your business from suspicious transactions.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with real-time insights into your financial operations and trends.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: [
        'Up to 50 employees',
        'Basic payroll processing',
        'Email support',
        'Standard reports',
        'Mobile app access'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/month',
      features: [
        'Unlimited employees',
        'Advanced payroll automation',
        'Priority support',
        'Real-time analytics',
        'Fraud detection',
        'API access',
        'Custom integrations'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom SLA',
        'On-premise deployment',
        'Advanced security',
        'Training & onboarding',
        '24/7 phone support'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,117,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,117,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 transition-all duration-300 backdrop-blur-xl rounded-2xl 
        ${scrolled
          ? 'bg-[#0a0d12]/90 border border-[#00FF75]/20 shadow-[0_8px_24px_rgba(0,255,117,0.15)]'
          : 'bg-[#0a0d12]/60 border border-[#00FF75]/10 shadow-[0_4px_16px_rgba(0,255,117,0.08)]'}
        `}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF75] to-[#0DF86A] flex items-center justify-center shadow-[0_0_20px_#00ff75]">
                <span className="text-[#0a0d12] font-bold text-xl">$</span>
              </div>
              <span className="text-xl font-bold text-white">ProfitWise</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 text-white">
              {['Home', 'About', 'Features', 'Pricing', 'Contact'].map((item) => (
                <button key={item} className="flex items-center space-x-1 hover:text-[#00FF75] transition-colors group">
                  <span>{item}</span>
                  <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            {/* Right Side Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 text-white hover:text-[#00FF75] transition-colors rounded-xl">
                Log in
              </button>
              <button className="px-6 py-2.5 bg-[#00FF75] text-[#0a0d12] font-semibold rounded-xl hover:bg-[#0DF86A] transition-all shadow-[0_0_20px_#00ff75] hover:shadow-[0_0_30px_#00ff75]">
                GET STARTED
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (dropdown below floating bar) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto w-[94%] max-w-6xl bg-[#0a0d12]/95 backdrop-blur-xl border border-[#00FF75]/10 rounded-2xl shadow-[0_8px_24px_rgba(0,255,117,0.12)]">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'About', 'Features', 'Pricing', 'Contact'].map((item) => (
                <button key={item} className="block w-full text-left py-2 text-white hover:text-[#00FF75] transition-colors">
                  {item}
                </button>
              ))}
              <div className="pt-4 space-y-2 border-t border-[#00FF75]/10">
                <button className="block w-full text-left py-2 text-white hover:text-[#00FF75] transition-colors">
                  Log in
                </button>
                <button className="block w-full py-2.5 bg-[#00FF75] text-[#0a0d12] font-semibold rounded-xl text-center">
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glowing arc and money graphics background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large glowing arc */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px]">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FF75" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#00FF75" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00FF75" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path 
                d="M 0,200 Q 200,50 400,100 T 800,150" 
                fill="none" 
                stroke="url(#arcGradient)" 
                strokeWidth="3"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>
          </div>

          {/* Floating money bill illustrations */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <svg width="60" height="30" viewBox="0 0 100 50" className="text-[#00FF75] drop-shadow-[0_0_10px_#00ff75]">
                <rect x="5" y="5" width="90" height="40" rx="2" fill="currentColor" opacity="0.3" />
                <text x="50" y="30" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="bold">$100</text>
              </svg>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#0a0d12]/80 border border-[#00FF75]/30 rounded-full px-6 py-2.5 mb-8 backdrop-blur-sm shadow-[0_0_15px_#00ff75]/20">
            <span className="text-sm text-white/90">Trusted by thousands of businesses worldwide | Secure. Reliable. Compliant.</span>
            <div className="w-2 h-2 rounded-full bg-[#00FF75] shadow-[0_0_10px_#00ff75] animate-pulse"></div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white/90">Effortless </span>
            <span className="text-[#00FF75] bg-gradient-to-r from-[#00FF75] to-[#0DF86A] bg-clip-text text-transparent drop-shadow-[0_0_20px_#00ff75]">
              Payments & Payroll
            </span>
            <br />
            <span className="text-white/90">Fast, Smart, and Seamless.</span>
          </h1>

          {/* Glowing gradient behind headline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00FF75]/10 blur-3xl rounded-full -z-10"></div>

          {/* CTA Button */}
          <button className="px-8 py-4 bg-[#00FF75] text-[#0a0d12] font-semibold text-lg rounded-2xl hover:bg-[#0DF86A] transition-all shadow-[0_0_30px_#00ff75] hover:shadow-[0_0_40px_#00ff75] mb-20 transform hover:scale-105">
            GET STARTED
          </button>
        </div>
      </section>

      
      {/* Dashboard Preview Card */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#00FF75]/30 bg-gradient-to-br from-[#0a0d12] to-[#151920] backdrop-blur-sm">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0a0d12]/80 border-b border-[#00FF75]/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF75] to-[#0DF86A] flex items-center justify-center shadow-[0_0_10px_#00ff75]">
                    <span className="text-[#0a0d12] font-bold text-sm">$</span>
                  </div>
                  <span className="text-[#00FF75] font-bold">ProfitWise</span>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-[#151920] rounded-lg px-3 py-1.5 border border-[#00FF75]/20">
                  <Search className="w-4 h-4 text-white/60" />
                  <input 
                    type="text" 
                    placeholder="Q Search" 
                    className="bg-transparent text-white text-sm outline-none w-32 placeholder-white/40" 
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-white text-sm hidden md:block">EN</div>
                <Bell className="w-5 h-5 text-white/80" />
                <div className="w-8 h-8 bg-gradient-to-br from-[#00FF75] to-[#0DF86A] rounded-full border-2 border-[#0a0d12]"></div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Sidebar */}
              <div className="w-full lg:w-64 bg-[#0a0d12]/50 border-r border-[#00FF75]/20 p-6">
                <div className="space-y-2">
                  {/* Active Dashboard Item */}
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-[#00FF75]/20 text-[#00FF75] rounded-xl border border-[#00FF75]/30 shadow-[0_0_15px_#00ff75]/30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                    <span className="font-medium">Dashboard</span>
                  </button>
                  
                  {/* Other Menu Items */}
                  {[
                    { icon: 'messages', label: 'Messages', badge: 1 },
                    { icon: 'community', label: 'Community' },
                    { icon: 'payments', label: 'Payments' },
                    { icon: 'statistics', label: 'Statistics' },
                    { icon: 'referrals', label: 'Referrals' },
                    { icon: 'account', label: 'Account' },
                    { icon: 'settings', label: 'Settings' }
                  ].map((item, idx) => (
                    <button 
                      key={idx}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {item.icon === 'messages' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        )}
                        {item.icon === 'community' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                          </svg>
                        )}
                        {item.icon === 'payments' && <CreditCard className="w-5 h-5" />}
                        {item.icon === 'statistics' && <TrendingUp className="w-5 h-5" />}
                        {item.icon === 'referrals' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        )}
                        {item.icon === 'account' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                          </svg>
                        )}
                        {item.icon === 'settings' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 lg:p-8">
                <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>

                {/* Upcoming Payments */}
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-4">Upcoming payments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Freelance Card */}
                    <div className="bg-[#151920]/80 rounded-2xl p-5 border border-[#00FF75]/10">
                      <div className="w-12 h-12 bg-[#00FF75]/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_#00ff75]/30">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00FF75]">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                        </svg>
                      </div>
                      <div className="text-white/60 text-sm mb-1">Freelance</div>
                      <div className="text-white/40 text-xs mb-3">Unregular payment</div>
                      <div className="text-white text-2xl font-bold">$1,500</div>
                    </div>

                    {/* Salary Card */}
                    <div className="bg-[#151920]/80 rounded-2xl p-5 border border-[#00FF75]/10">
                      <div className="w-12 h-12 bg-[#00FF75]/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_#00ff75]/30">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00FF75]">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                        </svg>
                      </div>
                      <div className="text-white/60 text-sm mb-1">Salary</div>
                      <div className="text-white/40 text-xs mb-3">Regular payment</div>
                      <div className="text-white text-2xl font-bold">$4,000</div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="mb-8 bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Recent transactions</h3>
                    <select className="bg-[#0a0d12] text-white/60 text-sm rounded-lg px-3 py-1.5 border border-[#00FF75]/20 outline-none">
                      <option>Sort by</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Train, name: 'Taxi Trips', date: '21 Aug 2022, 16:41', amount: '$56.50' },
                      { icon: Bus, name: 'Public Transport', date: '17 Aug 2022, 17:59', amount: '$2.50' },
                      { icon: Plane, name: 'Plane Tickets', date: '28 Jul 2022, 21:40', amount: '$70' },
                      { icon: Fuel, name: 'Gas Station', date: '23 Jul 2022, 09:26', amount: '$30.75' },
                      { icon: Dumbbell, name: 'Gym', date: '20 Jul 2022, 18:15', amount: '$100.00' }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                            <transaction.icon className="w-5 h-5 text-white/60" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{transaction.name}</div>
                            <div className="text-white/40 text-xs">{transaction.date}</div>
                          </div>
                        </div>
                        <div className="text-white font-medium">{transaction.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spent This Day & Available Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Spent This Day */}
                  <div className="lg:col-span-2 bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-semibold">Spent this day</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-[#00FF75] text-2xl font-bold">$259.75</span>
                        <select className="bg-[#0a0d12] text-white/60 text-sm rounded-lg px-3 py-1.5 border border-[#00FF75]/20 outline-none">
                          <option>Week</option>
                        </select>
                      </div>
                    </div>
                    {/* Spending Graph */}
                    <div className="h-48 relative">
                      <svg viewBox="0 0 400 150" className="w-full h-full">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00FF75" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#00FF75" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <line key={i} x1={i * 66.67} y1="0" x2={i * 66.67} y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                        ))}
                        {/* Chart line */}
                        <path 
                          d="M 0,120 Q 50,100 80,80 T 160,60 T 240,70 T 320,50 T 400,40" 
                          fill="none" 
                          stroke="#00FF75" 
                          strokeWidth="3"
                          className="drop-shadow-[0_0_10px_#00ff75]"
                        />
                        {/* Gradient fill */}
                        <path 
                          d="M 0,120 Q 50,100 80,80 T 160,60 T 240,70 T 320,50 T 400,40 L 400,150 L 0,150 Z" 
                          fill="url(#chartGradient)"
                        />
                        {/* Tooltip circle */}
                        <circle cx="269" cy="75" r="4" fill="#00FF75" className="drop-shadow-[0_0_8px_#00ff75]"/>
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/30 px-2">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>
                    </div>
                  </div>

                  {/* Available Cards */}
                  <div className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-sm">Available cards</h3>
                      <button className="text-[#00FF75] text-xs hover:text-[#0DF86A]">View all</button>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#0a0d12]/50 rounded-xl p-4 border border-[#00FF75]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium text-lg">98,500</div>
                            <div className="text-white/40 text-xs">USD</div>
                          </div>
                          <div className="text-white/60 text-xs">...4141</div>
                        </div>
                      </div>
                      <div className="bg-[#0a0d12]/50 rounded-xl p-4 border border-[#00FF75]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium text-lg">76,280</div>
                            <div className="text-white/40 text-xs">EUR</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-white/60 text-xs">...8345</div>
                            <div className="text-xs font-bold text-white/80">VISA</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for <span className="text-[#00FF75]">Modern Finance</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Everything you need to manage payments, payroll, and financial operations in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#151920]/50 rounded-2xl p-6 border border-[#00FF75]/10 hover:border-[#00FF75]/30 transition-all hover:shadow-[0_0_20px_#00ff75]/20 group"
              >
                <div className="w-12 h-12 bg-[#00FF75]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00FF75]/30 transition-colors shadow-[0_0_15px_#00ff75]/20">
                  <feature.icon className="w-6 h-6 text-[#00FF75]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Scrolling Columns */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 relative z-10 bg-[#0a0d12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-5">
              <span className="px-4 py-1.5 bg-[#00FF75]/10 border border-[#00FF75]/30 rounded-full text-[#00FF75] text-sm font-medium">
                Testimonials
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What our users say
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From intuitive design to powerful features, ProfitWise has become an essential tool for businesses around the world.
            </p>
          </div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] max-h-[740px] overflow-hidden">
            {/* First Column */}
            <div className="w-full max-w-[320px]">
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
            </div>
            
            {/* Second Column - Hidden on mobile */}
            <div className="hidden md:block w-full max-w-[320px]">
              <TestimonialsColumn testimonials={secondColumn} duration={19} />
            </div>
            
            {/* Third Column - Hidden on mobile/tablet */}
            <div className="hidden lg:block w-full max-w-[320px]">
              <TestimonialsColumn testimonials={thirdColumn} duration={17} />
            </div>
          </div>
        </div>
      </section>



      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, <span className="text-[#00FF75]">Transparent</span> Pricing
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 border transition-all ${
                  plan.highlighted
                    ? 'bg-[#151920]/80 border-[#00FF75] shadow-[0_0_30px_#00ff75]/30 scale-105'
                    : 'bg-[#151920]/50 border-[#00FF75]/20 hover:border-[#00FF75]/40'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00FF75] text-[#0a0d12] px-4 py-1 rounded-full text-sm font-semibold shadow-[0_0_15px_#00ff75]">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-white/60 ml-2">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-[#00FF75] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-[#00FF75] text-[#0a0d12] hover:bg-[#0DF86A] shadow-[0_0_20px_#00ff75]'
                      : 'bg-[#151920] border border-[#00FF75]/30 text-[#00FF75] hover:bg-[#00FF75]/10'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-[#00FF75]/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF75] to-[#0DF86A] flex items-center justify-center shadow-[0_0_15px_#00ff75]">
                  <span className="text-[#0a0d12] font-bold text-xl">$</span>
                </div>
                <span className="text-xl font-bold text-white">ProfitWise</span>
              </div>
              <p className="text-white/60 text-sm mb-4 max-w-md">
                The all-in-one platform for effortless payments, payroll, and financial management. 
                Trusted by thousands of businesses worldwide.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Linkedin, Facebook, Instagram].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 bg-[#151920] border border-[#00FF75]/20 rounded-lg flex items-center justify-center text-white/60 hover:text-[#00FF75] hover:border-[#00FF75]/40 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Pricing', 'Blog', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-[#00FF75] transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Documentation', 'API Reference', 'Status', 'Security'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-[#00FF75] transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#00FF75]/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm mb-4 md:mb-0">
              © 2024 ProfitWise. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#00FF75] transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-[#00FF75] transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-[#00FF75] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes scroll-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-scroll-up {
          animation: scroll-up linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;