import express from 'express';
import mongoose from 'mongoose';
import LoanApplication from '../model/loanApplication.js';
import Policy from '../model/policy.js';
import FinancialHealth from '../model/financialHealth.js';
import User from '../model/user.js';

const router = express.Router();

// Helper function to calculate financial health rating from financial health data
const calculateHealthRating = (financialHealth) => {
  if (!financialHealth) return 'Fair';
  
  const stabilityScore = financialHealth.cashflow_stability_score || 0;
  const netCashflow = financialHealth.net_cashflow || 0;
  const volatility = financialHealth.volatility_score || 0;
  
  // Calculate overall health based on multiple factors
  if (stabilityScore >= 0.8 && netCashflow > 0 && volatility < 0.3) {
    return 'Excellent';
  } else if (stabilityScore >= 0.6 && netCashflow >= 0 && volatility < 0.5) {
    return 'Good';
  } else if (stabilityScore >= 0.4 && volatility < 0.7) {
    return 'Fair';
  } else {
    return 'Poor';
  }
};

// Helper function to calculate policy fit
const calculatePolicyFit = (policy, financialHealth, msmeVintageMonths) => {
  const fitDetails = {
    credit_score_match: false,
    financial_health_match: false,
    vintage_match: false,
    amount_within_limit: false
  };

  let fitScore = 0;

  // Calculate credit score from financial health metrics
  // Using cashflow stability and net cashflow as proxies
  const stabilityScore = financialHealth?.cashflow_stability_score || 0;
  const netCashflow = financialHealth?.net_cashflow || 0;
  const creditScore = Math.min(900, Math.max(300, 300 + (stabilityScore * 400) + (netCashflow > 0 ? 100 : 0)));
  
  if (creditScore >= policy.minCreditScore) {
    fitDetails.credit_score_match = true;
    fitScore += 25;
  }

  // Check financial health
  const healthMapping = { 'Excellent': 4, 'Good': 3, 'Fair': 2, 'Poor': 1 };
  const policyHealthLevel = healthMapping[policy.minFinancialHealth] || 2;
  const msmeHealth = calculateHealthRating(financialHealth);
  const msmeHealthLevel = healthMapping[msmeHealth] || 2;
  if (msmeHealthLevel >= policyHealthLevel) {
    fitDetails.financial_health_match = true;
    fitScore += 25;
  }

  // Check vintage
  if (msmeVintageMonths >= policy.minVintageMonths) {
    fitDetails.vintage_match = true;
    fitScore += 25;
  }

  // Amount check (will be done when applying)
  fitDetails.amount_within_limit = true; // Default, will be checked on application
  fitScore += 25;

  return { fitScore, fitDetails, calculatedCreditScore: creditScore, calculatedHealth: msmeHealth };
};

// POST - Create new loan application
router.post('/', async (req, res) => {
  try {
    const { msme_id, lender_id, policy_id, requested_amount } = req.body;

    console.log('Creating application:', { msme_id, lender_id, policy_id, requested_amount });

    // Validate required fields
    if (!msme_id || !lender_id || !policy_id || !requested_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: msme_id, lender_id, policy_id, and requested_amount are required'
      });
    }

    // Get policy
    const policy = await Policy.findById(policy_id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    console.log('Policy found:', policy.name);

    // Get MSME user data first - only search by customId to avoid ObjectId casting errors
    const msmeUser = await User.findOne({ customId: msme_id });
    
    // If not found by customId, try _id only if it's a valid ObjectId
    let foundUser = msmeUser;
    if (!foundUser && mongoose.Types.ObjectId.isValid(msme_id)) {
      foundUser = await User.findById(msme_id);
    }
    
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'MSME user not found'
      });
    }

    // Verify the user is actually an MSME
    if (foundUser.role !== 'msme') {
      return res.status(400).json({
        success: false,
        message: 'Only MSME users can submit loan applications'
      });
    }

    // Use the actual customId from the user
    const actualMsmeId = foundUser.customId;

    // Get MSME financial health using the actual customId
    let financialHealth = await FinancialHealth.findOne({ msme_id: actualMsmeId })
      .sort({ generated_at: -1 });

    // If still no financial health, that's okay - we'll use defaults
    if (!financialHealth) {
      console.warn('No financial health data found for MSME:', actualMsmeId);
    }

    const msmeVintageMonths = (foundUser.business_vintage_years || 0) * 12;
    console.log('MSME user found:', foundUser.name, 'Vintage months:', msmeVintageMonths);

    // Calculate policy fit
    const { fitScore, fitDetails, calculatedCreditScore, calculatedHealth } = calculatePolicyFit(
      policy,
      financialHealth,
      msmeVintageMonths
    );

    // Check if amount is within limit
    fitDetails.amount_within_limit = requested_amount <= (policy.maxAmount * 100000); // Convert lakhs to rupees

    // Use calculated health and credit score
    const healthRating = calculatedHealth;
    const creditScore = calculatedCreditScore;

    // Use the actual MSME customId for the application (already set above)

    // Create application
    const application = new LoanApplication({
      msme_id: actualMsmeId,
      lender_id,
      policy_id,
      requested_amount,
      msme_credit_score: creditScore,
      msme_financial_health: healthRating,
      policy_fit_score: fitScore,
      fit_details: fitDetails,
      status: 'pending'
    });

    await application.save();
    console.log('Application created:', application.application_id);

    // Populate policy details
    await application.populate('policy_id');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET - Get applications for a lender
router.get('/lender/:lenderId', async (req, res) => {
  try {
    const { lenderId } = req.params;
    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { lender_id: lenderId };
    if (status) {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const applications = await LoanApplication.find(query)
      .populate('policy_id')
      .sort(sortOptions)
      .lean();

    // Populate MSME user information for each application
    const applicationsWithMsme = await Promise.all(
      applications.map(async (app) => {
        try {
          const msmeUser = await User.findOne({ customId: app.msme_id })
            .select('name email phone gstin msme_type sector business_vintage_years address')
            .lean();
          
          return {
            ...app,
            msme_info: msmeUser || {
              name: 'Unknown MSME',
              customId: app.msme_id
            }
          };
        } catch (err) {
          console.error('Error fetching MSME info for application:', app.application_id, err);
          return {
            ...app,
            msme_info: {
              name: 'Unknown MSME',
              customId: app.msme_id
            }
          };
        }
      })
    );

    res.json({
      success: true,
      applications: applicationsWithMsme
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// GET - Get applications for an MSME
router.get('/msme/:msmeId', async (req, res) => {
  try {
    const { msmeId } = req.params;
    const { status } = req.query;

    const query = { msme_id: msmeId };
    if (status) {
      query.status = status;
    }

    const applications = await LoanApplication.find(query)
      .populate('policy_id')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching MSME applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// GET - Get single application by ID
router.get('/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await LoanApplication.findOne({ application_id: applicationId })
      .populate('policy_id');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
});

// PUT - Update application status (accept/reject/pending)
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, lender_notes, approved_amount } = req.body;

    if (!['pending', 'reviewing', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = {
      status,
      lender_notes: lender_notes || ''
    };

    if (status === 'approved') {
      updateData.approved_amount = approved_amount || 0;
      updateData.approved_at = new Date();
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date();
    }

    const application = await LoanApplication.findOneAndUpdate(
      { application_id: applicationId },
      updateData,
      { new: true }
    ).populate('policy_id');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
});

// GET - Get MSME details for lender view
router.get('/:applicationId/msme-details', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await LoanApplication.findOne({ application_id: applicationId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Get MSME user details
    const msmeUser = await User.findOne({ customId: application.msme_id })
      .select('-passwordHash');

    // Get financial health
    const financialHealth = await FinancialHealth.findOne({ msme_id: application.msme_id })
      .sort({ generated_at: -1 });

    res.json({
      success: true,
      msme_details: {
        user: msmeUser,
        financial_health: financialHealth,
        application: application
      }
    });
  } catch (error) {
    console.error('Error fetching MSME details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching MSME details',
      error: error.message
    });
  }
});

// GET - Get lender statistics (total money lent, etc.)
router.get('/lender/:lenderId/stats', async (req, res) => {
  try {
    const { lenderId } = req.params;

    const stats = await LoanApplication.aggregate([
      { $match: { lender_id: lenderId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total_amount: { $sum: '$requested_amount' }
        }
      }
    ]);

    const approvedStats = await LoanApplication.aggregate([
      { $match: { lender_id: lenderId, status: 'approved' } },
      {
        $group: {
          _id: null,
          total_approved: { $sum: 1 },
          total_money_lent: { $sum: '$approved_amount' }
        }
      }
    ]);

    const result = {
      by_status: {},
      total_applications: 0,
      total_approved: 0,
      total_money_lent: 0
    };

    stats.forEach(stat => {
      result.by_status[stat._id] = {
        count: stat.count,
        total_amount: stat.total_amount
      };
      result.total_applications += stat.count;
    });

    if (approvedStats.length > 0) {
      result.total_approved = approvedStats[0].total_approved;
      result.total_money_lent = approvedStats[0].total_money_lent;
    }

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Error fetching lender stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lender statistics',
      error: error.message
    });
  }
});

export default router;

