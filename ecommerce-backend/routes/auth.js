import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });
    
    // Simulate token
    const token = `fake-jwt-token-${user.id}`;
    
    res.status(201).json({ 
      user: { id: user.id, name: user.name, email: user.email }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = `fake-jwt-token-${user.id}`;
    
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User (simulation)
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
    const id = authHeader.replace('Bearer fake-jwt-token-', '');
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
