import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTransaction } from '../api/transactions'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = {
  Food: 'bg-[#CA6702]',
  Transport: 'bg-[#0A9396]',
  Shopping: 'bg-[#94D2BD]',
  Bills: 'bg-[#005F73]',
  Entertainment: 'bg-[#EE9B00]',
  Health: 'bg-[#BB3E03]',
  Other: 'bg-[#E9D8A6]',
}

export default function AddExpense() {
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastAdded, setLastAdded] = useState(null)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!note.trim() || !amount) {
      setError('Please fill in both the note and amount.')
      return
    }

    setLoading(true)
    try {
      const transaction = await createTransaction({
        amount: Number(amount),
        note: note.trim(),
        date,
      })
      setLastAdded(transaction)
      toast.success(`Added to ${transaction.category} — ₹${transaction.amount}`)
      setNote('')
      setAmount('')
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-primary">Add Expense</h1>
        <p className="text-app-text/60 font-body mt-1">
          Type it like you'd text a friend — Hinglish is totally fine.
        </p>
      </div>

      {/* Chat-style input card */}
      <div className="bg-app-surface rounded-3xl shadow-sm p-6 transition-colors">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            {/* Chat bubble input */}
            <div className="flex-1">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="chai aur nashta 200 rupaye"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl rounded-bl-md bg-app-bg text-app-text border border-app-text/15
                           focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none font-body"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-app-text mb-1" htmlFor="amount">
                Amount (₹)
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="200"
                className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                           focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-app-text mb-1" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                           focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 transition-opacity">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-body font-medium py-3 rounded-xl
                       transition-transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Sending...' : '➤ Send'}
          </button>
        </form>
      </div>

      {/* "Reply" bubble showing the AI's categorization */}
      {lastAdded && (
        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="max-w-xs bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md p-4">
            <p className="text-app-text font-body text-sm">{lastAdded.note}</p>
            <div className="flex items-center justify-between mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${
                  CATEGORY_COLORS[lastAdded.category] || 'bg-primary'
                }`}
              >
                {lastAdded.category}
              </span>
              <span className="font-display text-primary font-semibold">
                ₹{lastAdded.amount.toLocaleString('en-IN')}
              </span>
            </div>
            {lastAdded.isAnomaly && (
              <p className="text-danger text-xs font-body mt-2 flex items-center gap-1">
                ⚠️ This looks unusually high for this category
              </p>
            )}
          </div>
        </div>
      )}

      {lastAdded && (
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary font-body text-sm font-medium hover:underline self-start"
        >
          ← View updated dashboard
        </button>
      )}
    </div>
  )
}