import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// CREATE or UPDATE a budget (upsert — one budget per category per month)
router.post('/', protect, async (req, res) => {
  try {
    const { category, monthlyLimit, month } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, category, month },
      { monthlyLimit },
      { new: true, upsert: true }
    );

    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all budgets for a given month, with spending progress
router.get('/:month', protect, async (req, res) => {
  try {
    const { month } = req.params;

    const budgets = await Budget.find({ user: req.userId, month });

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const matchQuery = {
          user: req.userId,
          date: { $gte: startDate, $lt: endDate },
        };
        if (budget.category !== 'Overall') {
          matchQuery.category = budget.category;
        }

        const transactions = await Transaction.find(matchQuery);
        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget.toObject(),
          spent,
          remaining: budget.monthlyLimit - spent,
          percentUsed: Math.round((spent / budget.monthlyLimit) * 100),
        };
      })
    );

    res.status(200).json(budgetsWithProgress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE a budget
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;