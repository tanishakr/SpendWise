import express from 'express';
import Transaction from '../models/Transaction.js';
import protect from '../middlewares/authMiddleware.js';
import { generateInsights } from '../config/gemini.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(200).json({ insight: 'No transactions yet — add some expenses to see insights!' });
    }

    const insight = await generateInsights(transactions);
    res.status(200).json({ insight });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;