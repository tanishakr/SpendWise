import express from 'express';
import Transaction from '../models/Transaction.js';
import protect from '../middlewares/authMiddleware.js';
import { categorizeExpense } from '../config/gemini.js';

const router = express.Router();

// CREATE a transaction
router.post('/', protect, async (req, res) => {
  try {
    const { amount, note, date } = req.body;

    const category = await categorizeExpense(note);

    // Check for anomaly: compare against average spending in this category
    const pastTransactions = await Transaction.find({
      user: req.userId,
      category,
    });

    let isAnomaly = false;

    if (pastTransactions.length >= 3) {
      const total = pastTransactions.reduce((sum, t) => sum + t.amount, 0);
      const average = total / pastTransactions.length;

      if (amount > average * 3) {
        isAnomaly = true;
      }
    }

    const transaction = await Transaction.create({
      user: req.userId,
      amount,
      note,
      category,
      date,
      isAnomaly,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all transactions for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE a transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { amount, note, category, date } = req.body;
    if (amount !== undefined) transaction.amount = amount;
    if (note !== undefined) transaction.note = note;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;

    const updated = await transaction.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;