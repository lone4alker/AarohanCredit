import express from 'express';
import Policy from '../model/policy.js';
import User from '../model/user.js';

const router = express.Router();

// GET all active policies (for MSME search) - MUST come before /lender/:lenderId
router.get('/active', async (req, res) => {
  try {
    console.log('Fetching active policies for MSMEs...');
    
    // Get all policies where isActive is true OR undefined/null (for backward compatibility)
    const policies = await Policy.find({ 
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
        { isActive: null }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${policies.length} active policies`);
    
    // Log policy details for debugging
    if (policies.length > 0) {
      console.log('Sample policy:', {
        _id: policies[0]._id,
        name: policies[0].name,
        lender_id: policies[0].lender_id,
        isActive: policies[0].isActive
      });
    }

    // Populate lender information manually since lender_id is a string
    const policiesWithLender = await Promise.all(
      policies.map(async (policy) => {
        if (policy.lender_id) {
          try {
            const lender = await User.findOne({ 
              $or: [
                { customId: policy.lender_id },
                { _id: policy.lender_id }
              ]
            }).select('name lender_profile customId').lean();
            
            return { 
              ...policy, 
              lender_id: lender ? {
                ...lender,
                original_lender_id: policy.lender_id // Keep the original string ID
              } : { 
                name: 'Unknown Lender',
                customId: policy.lender_id,
                original_lender_id: policy.lender_id,
                lender_profile: {}
              } 
            };
          } catch (err) {
            console.error('Error fetching lender for policy:', policy._id, err);
            return {
              ...policy,
              lender_id: {
                name: 'Unknown Lender',
                customId: policy.lender_id,
                lender_profile: {}
              }
            };
          }
        }
        return policy;
      })
    );

    console.log(`Returning ${policiesWithLender.length} policies with lender info`);

    res.json({
      success: true,
      policies: policiesWithLender
    });
  } catch (error) {
    console.error('Error fetching active policies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active policies',
      error: error.message
    });
  }
});

// GET all policies for a lender
router.get('/lender/:lenderId', async (req, res) => {
  try {
    const { lenderId } = req.params;
    const { activeOnly } = req.query;

    console.log('Fetching policies for lender:', lenderId);

    const query = { lender_id: lenderId };
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    const policies = await Policy.find(query).sort({ createdAt: -1 });

    console.log(`Found ${policies.length} policies for lender ${lenderId}`);

    res.json({
      success: true,
      policies: policies || []
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policies',
      error: error.message
    });
  }
});

// GET single policy by ID
router.get('/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;
    const policy = await Policy.findById(policyId);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      policy
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policy',
      error: error.message
    });
  }
});

// POST - Create new policy
router.post('/', async (req, res) => {
  try {
    const policyData = req.body;
    
    // Ensure isActive is true by default if not specified
    if (policyData.isActive === undefined || policyData.isActive === null) {
      policyData.isActive = true;
    }
    
    console.log('Creating new policy:', {
      name: policyData.name,
      lender_id: policyData.lender_id,
      isActive: policyData.isActive,
      maxAmount: policyData.maxAmount
    });
    
    const newPolicy = new Policy(policyData);
    await newPolicy.save();

    console.log('Policy created successfully:', {
      _id: newPolicy._id,
      name: newPolicy.name,
      lender_id: newPolicy.lender_id,
      isActive: newPolicy.isActive
    });

    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      policy: newPolicy
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating policy',
      error: error.message
    });
  }
});

// PUT - Update policy
router.put('/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;
    const updateData = req.body;

    const updatedPolicy = await Policy.findByIdAndUpdate(
      policyId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Policy updated successfully',
      policy: updatedPolicy
    });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating policy',
      error: error.message
    });
  }
});

// DELETE - Delete policy (soft delete by setting isActive to false)
router.delete('/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;

    const deletedPolicy = await Policy.findByIdAndUpdate(
      policyId,
      { isActive: false },
      { new: true }
    );

    if (!deletedPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Policy deleted successfully',
      policy: deletedPolicy
    });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting policy',
      error: error.message
    });
  }
});

export default router;

