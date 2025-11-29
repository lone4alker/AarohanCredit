import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Sparkles, Shield, TrendingUp, CheckCircle, XCircle, AlertCircle, FileText, Send } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const formatCurrency = (val = 0) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const SearchLoans = () => {
  const [query, setQuery] = useState('');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [financialSnapshot, setFinancialSnapshot] = useState(null);
  const [msmeUser, setMsmeUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showFitModal, setShowFitModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [applying, setApplying] = useState(false);
  
  const msme = JSON.parse(localStorage.getItem('user') || '{}');
  const msmeId = msme.customId || msme.id || msme.msme_id || 'M101';

  useEffect(() => {
    fetchData();
  }, [msmeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch policies
      console.log('Fetching active policies from:', `${API_BASE}/api/policies/active`);
      const policiesRes = await fetch(`${API_BASE}/api/policies/active`);
      
      if (!policiesRes.ok) {
        const errorText = await policiesRes.text();
        console.error('Error fetching policies:', policiesRes.status, errorText);
        throw new Error(`Failed to fetch policies: ${policiesRes.status}`);
      }
      
      const policiesData = await policiesRes.json();
      console.log('Policies API response:', policiesData);
      
      if (policiesData.success) {
        const policiesList = policiesData.policies || [];
        console.log(`Loaded ${policiesList.length} policies:`, policiesList.map(p => ({
          name: p.name,
          lender: p.lender_id?.name || p.lender_id,
          isActive: p.isActive
        })));
        setPolicies(policiesList);
      } else {
        console.error('API returned error:', policiesData.message);
        setPolicies([]);
      }

      // Fetch financial health
      const healthRes = await fetch(`${API_BASE}/api/financial-health/${msmeId}`);
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setFinancialSnapshot(healthData.financial_health || healthData);
      } else {
        console.warn('Could not fetch financial health for:', msmeId);
      }

      // Fetch MSME user data
      const userRes = await fetch(`${API_BASE}/api/auth/user/${msmeId}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setMsmeUser(userData.user);
      } else {
        console.warn('Could not fetch user data for:', msmeId);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthRating = (financialHealth) => {
    if (!financialHealth) return 'Fair';
    const stabilityScore = financialHealth.cashflow_stability_score || 0;
    const netCashflow = financialHealth.net_cashflow || 0;
    const volatility = financialHealth.volatility_score || 0;
    if (stabilityScore >= 0.8 && netCashflow > 0 && volatility < 0.3) return 'Excellent';
    if (stabilityScore >= 0.6 && netCashflow >= 0 && volatility < 0.5) return 'Good';
    if (stabilityScore >= 0.4 && volatility < 0.7) return 'Fair';
    return 'Poor';
  };

  const calculatePolicyFit = (policy) => {
    if (!financialSnapshot || !msmeUser) return { fitScore: 0, details: {} };

    const details = {
      credit_score_match: false,
      financial_health_match: false,
      vintage_match: false,
      amount_within_limit: false
    };

    let fitScore = 0;
    const stabilityScore = financialSnapshot.cashflow_stability_score || 0;
    const netCashflow = financialSnapshot.net_cashflow || 0;
    const creditScore = Math.min(900, Math.max(300, 300 + (stabilityScore * 400) + (netCashflow > 0 ? 100 : 0)));
    
    const healthMapping = { 'Excellent': 4, 'Good': 3, 'Fair': 2, 'Poor': 1 };
    const msmeHealth = calculateHealthRating(financialSnapshot);
    const msmeHealthLevel = healthMapping[msmeHealth] || 2;
    const policyHealthLevel = healthMapping[policy.minFinancialHealth] || 2;
    const msmeVintageMonths = (msmeUser.business_vintage_years || 0) * 12;

    if (creditScore >= policy.minCreditScore) {
      details.credit_score_match = true;
      fitScore += 25;
    }
    if (msmeHealthLevel >= policyHealthLevel) {
      details.financial_health_match = true;
      fitScore += 25;
    }
    if (msmeVintageMonths >= policy.minVintageMonths) {
      details.vintage_match = true;
      fitScore += 25;
    }
    details.amount_within_limit = true; // Will be checked on application
    fitScore += 25;

    return { fitScore, details };
  };

  const handleViewFit = (policy) => {
    setSelectedPolicy(policy);
    setShowFitModal(true);
  };

  const handleApply = async () => {
    if (!selectedPolicy || !requestedAmount) return;
    
    const amount = parseFloat(requestedAmount) * 100000; // Convert lakhs to rupees
    if (amount > selectedPolicy.maxAmount * 100000) {
      alert('Requested amount exceeds policy maximum');
      return;
    }

    setApplying(true);
    try {
      // Extract lender_id - it could be a string or an object
      let lenderId;
      if (typeof selectedPolicy.lender_id === 'string') {
        lenderId = selectedPolicy.lender_id;
      } else if (selectedPolicy.lender_id?.original_lender_id) {
        // Use the original lender_id string stored in the policy
        lenderId = selectedPolicy.lender_id.original_lender_id;
      } else if (selectedPolicy.lender_id?.customId) {
        lenderId = selectedPolicy.lender_id.customId;
      } else if (selectedPolicy.lender_id?._id) {
        lenderId = selectedPolicy.lender_id._id;
      } else {
        console.error('Could not extract lender_id from policy:', selectedPolicy);
        alert('Error: Could not determine lender. Please try again.');
        return;
      }

      console.log('Submitting application:', {
        msme_id: msmeId,
        lender_id: lenderId,
        policy_id: selectedPolicy._id,
        requested_amount: amount
      });

      const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msme_id: msmeId,
          lender_id: lenderId,
          policy_id: selectedPolicy._id,
          requested_amount: amount
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert('Application submitted successfully!');
        setShowApplyModal(false);
        setShowFitModal(false);
        setSelectedPolicy(null);
        setRequestedAmount('');
      } else {
        alert('Failed to submit application: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application: ' + (error.message || 'Please try again.'));
    } finally {
      setApplying(false);
    }
  };

  const filteredPolicies = useMemo(() => {
    // If no search query, show all policies
    if (!query || query.trim() === '') {
      console.log(`Showing all ${policies.length} policies (no search filter)`);
      return policies;
    }
    
    // Filter by search query
    const filtered = policies.filter((policy) => {
      const policyName = policy.name?.toLowerCase() || '';
      const lenderName = policy.lender_id?.name?.toLowerCase() || 
                        policy.lender_id?.institution?.toLowerCase() || '';
      const searchTerm = query.toLowerCase();
      
      return policyName.includes(searchTerm) || lenderName.includes(searchTerm);
    });
    
    console.log(`Filtered ${policies.length} policies to ${filtered.length} based on query: "${query}"`);
    return filtered;
  }, [query, policies]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-white/60">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">Search for lending policies matched to your financial health.</p>
          {policies.length > 0 && (
            <p className="text-white/40 text-xs mt-1">
              Showing {filteredPolicies.length} of {policies.length} available policies
            </p>
          )}
        </div>
      </div>

      {financialSnapshot && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Net Cashflow</span>
              <TrendingUp className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {formatCurrency(Math.abs(financialSnapshot.net_cashflow || 0))}
            </p>
          </div>
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Cashflow Stability</span>
              <Shield className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {Math.round((financialSnapshot.cashflow_stability_score || 0) * 100)}%
            </p>
          </div>
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Average Balance</span>
              <Sparkles className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">{formatCurrency(financialSnapshot.average_balance || 0)}</p>
          </div>
        </div>
      )}

      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5 flex items-center gap-3">
        <Search className="w-5 h-5 text-white/60" />
        <input
          type="text"
          placeholder="Search lenders by name, focus area, or risk band..."
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => {
          const { fitScore, details } = calculatePolicyFit(policy);
          const lenderName = policy.lender_id?.name || policy.lender_id?.institution || 'Lender';
          
          return (
            <div
              key={policy._id}
              className="bg-[#151920]/70 border border-[#00FF75]/15 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00FF75]/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{policy.name}</h3>
                    <p className="text-white/50 text-sm">{lenderName}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${
                    fitScore >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    fitScore >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {fitScore}% Fit
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Requirements: Min Credit Score {policy.minCreditScore}, 
                  Min Health: {policy.minFinancialHealth}, 
                  Min Vintage: {policy.minVintageMonths} months
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white text-lg font-semibold">{policy.interestRate}%</p>
                  <p className="text-xs text-white/50">Rate</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white text-lg font-semibold">₹{policy.maxAmount}L</p>
                  <p className="text-xs text-white/50">Max</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-white text-lg font-semibold">{fitScore}%</p>
                  <p className="text-xs text-white/50">Fit</p>
                </div>
              </div>
              <button 
                onClick={() => handleViewFit(policy)}
                className="mt-6 w-full py-3 rounded-xl bg-[#00FF75] text-[#0a0d12] font-semibold hover:bg-[#0DF86A] transition"
              >
                View Policy Fit
              </button>
            </div>
          );
        })}
      </div>

      {filteredPolicies.length === 0 && !loading && (
        <div className="text-center py-10 border border-dashed border-white/20 rounded-2xl text-white/60">
          <Filter className="w-8 h-8 mx-auto mb-3" />
          {policies.length === 0 ? (
            <>
              <p className="text-lg font-semibold text-white mb-2">No active policies available</p>
              <p className="text-sm text-gray-400">Lenders haven't created any policies yet. Check back later!</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-white mb-2">No policies match your search</p>
              <p className="text-sm text-gray-400">Try different keywords or clear your search.</p>
            </>
          )}
        </div>
      )}

      {/* Policy Fit Modal */}
      {showFitModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111217] rounded-xl shadow-2xl w-full max-w-2xl border border-[#00FF75]/50">
            <div className="p-6 border-b border-[#00FF75]/30">
              <h3 className="text-2xl font-bold text-white">Policy Fit Analysis</h3>
              <p className="text-gray-400 text-sm mt-1">{selectedPolicy.name}</p>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const { fitScore, details } = calculatePolicyFit(selectedPolicy);
                return (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-[#00FF75] mb-2">{fitScore}%</div>
                      <p className="text-gray-400">Overall Fit Score</p>
                    </div>
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-3 rounded-lg ${details.credit_score_match ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        <span className="text-white">Credit Score Match</span>
                        {details.credit_score_match ? (
                          <CheckCircle className="text-emerald-400" size={20} />
                        ) : (
                          <XCircle className="text-rose-400" size={20} />
                        )}
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${details.financial_health_match ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        <span className="text-white">Financial Health Match</span>
                        {details.financial_health_match ? (
                          <CheckCircle className="text-emerald-400" size={20} />
                        ) : (
                          <XCircle className="text-rose-400" size={20} />
                        )}
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-lg ${details.vintage_match ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        <span className="text-white">Business Vintage Match</span>
                        {details.vintage_match ? (
                          <CheckCircle className="text-emerald-400" size={20} />
                        ) : (
                          <XCircle className="text-rose-400" size={20} />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          setShowFitModal(false);
                          setShowApplyModal(true);
                        }}
                        className="flex-1 py-3 rounded-xl bg-[#00FF75] text-[#0a0d12] font-semibold hover:bg-[#0DF86A] transition"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => setShowFitModal(false)}
                        className="px-6 py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111217] rounded-xl shadow-2xl w-full max-w-md border border-[#00FF75]/50">
            <div className="p-6 border-b border-[#00FF75]/30">
              <h3 className="text-2xl font-bold text-white">Apply for Loan</h3>
              <p className="text-gray-400 text-sm mt-1">{selectedPolicy.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requested Amount (in Lakh ₹)
                </label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  max={selectedPolicy.maxAmount}
                  min="1"
                  className="w-full px-4 py-2.5 bg-[#0f1116] border border-gray-700 rounded-lg focus:ring-[#00FF75] focus:border-[#00FF75] text-white"
                  placeholder={`Max: ${selectedPolicy.maxAmount} Lakh`}
                />
              </div>
              <div className="text-sm text-gray-400">
                <p>Max Amount: ₹{selectedPolicy.maxAmount} Lakh</p>
                <p>Interest Rate: {selectedPolicy.interestRate}%</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApply}
                  disabled={applying || !requestedAmount}
                  className="flex-1 py-3 rounded-xl bg-[#00FF75] text-[#0a0d12] font-semibold hover:bg-[#0DF86A] transition disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setRequestedAmount('');
                  }}
                  className="px-6 py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchLoans;

