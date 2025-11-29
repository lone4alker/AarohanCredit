import express from 'express';
import { signup, login } from '../controller/authController.js';
import User from '../model/user.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// GET user by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ 
      $or: [
        { customId: userId },
        { _id: userId }
      ]
    }).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

export default router;
