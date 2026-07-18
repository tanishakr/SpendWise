import { useState, useEffect } from 'react'
import { getBudgets, upsertBudget, deleteBudget } from '../api/budgets'

const CATEGORIES = ['Overall', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getProgressColor(percentUsed) {
  if (percentUsed >= 90) return 'bg-danger'
  if (percentUsed >= 70) return 'bg-warning'
  return 'bg-success'
}

function getProgressTextColor(percentUsed) {
  if (percentUsed >= 90) return 'text-danger'
  if (percentUsed >= 70) return 'text-warning'
  return 'text-success'
}

export default function Budgets() {
  const [month, setMonth] = useState(getCurrentMonth())
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [category, setCategory] = useState('Overall')
  const [limit, setLimit] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadBudgets()
  }, [month])

  async function loadBudgets() {
    setLoading(true)
    setError('')
    try {
      const data = await getBudgets(month)
      setBudgets(data)
    } catch (err) {
      setError(err.message || 'Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!limit) return

    setSaving(true)
    setError('')
    try {
      await upsertBudget({ category, monthlyLimit: Number(limit), month })
      setLimit('')
      await loadBudgets()
    } catch (err) {
      setError(err.message || 'Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this budget?')) return
    setDeletingId(id)
    try {
      await deleteBudget(id)
      setBudgets((prev) => prev.filter((b) => b._id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete budget')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-primary">Budgets</h1>
          <p className="text-app-text/60 font-body mt-1">Set limits, keep spending in check.</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-surface text-app-text
                     focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
        />
      </div>

      {/* Add/update budget form */}
      <div className="bg-app-surface rounded-3xl shadow-sm p-6 transition-colors">
        <p className="font-display text-lg text-app-text mb-4">Set a Budget</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                       focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Monthly limit (₹)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                       focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white font-body font-medium px-6 py-2.5 rounded-xl
                       transition-transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </form>
        <p className="text-app-text/50 text-xs font-body mt-2">
          Setting a budget for a category that already has one updates it for this month.
        </p>
      </div>

      {error && (
        <p className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Budget progress list */}
      {loading ? (
        <p className="text-app-text/60 font-body animate-pulse">Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <div className="bg-app-surface rounded-3xl p-10 text-center transition-colors">
          <p className="text-app-text/50 font-body">No budgets set for this month yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {budgets.map((b) => {
            const percent = Math.min(b.percentUsed, 100)
            const isOver = b.percentUsed >= 100

            return (
              <div key={b._id} className="bg-app-surface rounded-2xl p-5 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body font-medium text-app-text">{b.category}</p>
                  <div className="flex items-center gap-3">
                    <span className={`font-body text-sm font-medium ${getProgressTextColor(b.percentUsed)}`}>
                      ₹{b.spent.toLocaleString('en-IN')} / ₹{b.monthlyLimit.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleDelete(b._id)}
                      disabled={deletingId === b._id}
                      className="text-app-text/40 hover:text-danger transition-all disabled:opacity-40"
                      aria-label="Delete budget"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="w-full h-3 bg-app-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(b.percentUsed)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-app-text/50 text-xs font-body">
                    {Math.round(b.percentUsed)}% used
                  </span>
                  {isOver && (
                    <span className="text-danger text-xs font-medium font-body">
                      Over budget by ₹{(b.spent - b.monthlyLimit).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}