import { useState, useEffect, useMemo } from 'react'
import { getTransactions, deleteTransaction, updateTransaction } from '../api/transactions'
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

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']
const EDITABLE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']

export default function History() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [deletingId, setDeletingId] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editNote, setEditNote] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDate, setEditDate] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)
    setError('')
    try {
      const data = await getTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return

    setDeletingId(id)
    try {
      await deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t._id !== id))
      toast.success('Expense deleted')
    } catch (err) {
      setError(err.message || 'Failed to delete transaction')
    } finally {
      setDeletingId(null)
    }
  }

  function startEdit(t) {
    setEditingId(t._id)
    setEditNote(t.note)
    setEditAmount(String(t.amount))
    setEditCategory(t.category)
    setEditDate(new Date(t.date).toISOString().split('T')[0])
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    if (!editNote.trim() || !editAmount) {
      toast.error('Note and amount cannot be empty')
      return
    }

    setSavingEdit(true)
    try {
      const updated = await updateTransaction(id, {
        note: editNote.trim(),
        amount: Number(editAmount),
        category: editCategory,
        date: editDate,
      })
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)))
      setEditingId(null)
      toast.success('Expense updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update transaction')
    } finally {
      setSavingEdit(false)
    }
  }

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.note.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [transactions, search, categoryFilter])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-primary">History</h1>
        <p className="text-app-text/60 font-body mt-1">All your expenses, searchable and filterable.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes... e.g. chai, auto, movie"
          className="flex-1 px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-surface text-app-text
                     focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-surface text-app-text
                     focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {loading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-app-surface rounded-2xl h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-app-surface rounded-3xl p-10 text-center transition-colors">
          <p className="text-app-text/50 font-body">
            {transactions.length === 0
              ? 'No expenses logged yet. Go add your first one!'
              : 'No transactions match your search/filter.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => {
            const isEditing = editingId === t._id

            if (isEditing) {
              return (
                <div key={t._id} className="bg-app-surface rounded-2xl p-4 sm:p-5 shadow-sm ring-2 ring-primary/40">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-app-text/20 bg-app-bg text-app-text
                                 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
                      placeholder="Note"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-app-text/20 bg-app-bg text-app-text
                                   focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
                        placeholder="Amount"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-app-text/20 bg-app-bg text-app-text
                                   focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
                      >
                        {EDITABLE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-app-text/20 bg-app-bg text-app-text
                                   focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg text-sm font-body font-medium text-app-text
                                   hover:bg-app-bg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(t._id)}
                        disabled={savingEdit}
                        className="px-4 py-2 rounded-lg text-sm font-body font-medium bg-primary text-white
                                   transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                      >
                        {savingEdit ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={t._id}
                className={`bg-app-surface rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:shadow-md
                           flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4
                           ${t.isAnomaly ? 'ring-2 ring-danger/40' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-app-text font-body font-medium truncate">{t.note}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                        CATEGORY_COLORS[t.category] || 'bg-primary'
                      }`}
                    >
                      {t.category}
                    </span>
                    <span className="text-app-text/50 text-xs font-body">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {t.isAnomaly && (
                      <span className="inline-flex items-center gap-1 text-danger text-xs font-medium">
                        ⚠️ Unusual
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <span className="font-display text-lg text-primary font-semibold">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => startEdit(t)}
                    className="text-app-text/50 hover:text-primary hover:bg-primary/10 rounded-lg p-2 transition-all"
                    aria-label="Edit expense"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    disabled={deletingId === t._id}
                    className="text-danger/70 hover:text-danger hover:bg-danger/10 rounded-lg p-2
                               transition-all disabled:opacity-40"
                    aria-label="Delete expense"
                  >
                    {deletingId === t._id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}