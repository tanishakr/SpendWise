import { useState, useEffect } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from 'recharts'
import { getTransactions } from '../api/transactions'
import { getInsights } from '../api/insights'

const CATEGORY_COLORS = {
  Food: '#CA6702',
  Transport: '#0A9396',
  Shopping: '#94D2BD',
  Bills: '#005F73',
  Entertainment: '#EE9B00',
  Health: '#BB3E03',
  Other: '#E9D8A6',
}

function groupByCategory(transactions) {
  const totals = {}
  for (const t of transactions) {
    totals[t.category] = (totals[t.category] || 0) + t.amount
  }
  return Object.entries(totals).map(([category, value]) => ({ name: category, value }))
}

function groupByDate(transactions) {
  const totals = {}
  for (const t of transactions) {
    const day = new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    totals[day] = (totals[day] || 0) + t.amount
  }
  return Object.entries(totals).map(([date, amount]) => ({ date, amount }))
}

function groupByMonth(transactions) {
  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}`

  const totals = { thisMonth: 0, lastMonth: 0 }

  for (const t of transactions) {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (key === thisMonthKey) totals.thisMonth += t.amount
    if (key === lastMonthKey) totals.lastMonth += t.amount
  }

  return [
    { name: lastMonthDate.toLocaleDateString('en-IN', { month: 'short' }), amount: totals.lastMonth },
    { name: now.toLocaleDateString('en-IN', { month: 'short' }), amount: totals.thisMonth },
  ]
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [txData, insightData] = await Promise.all([
          getTransactions(),
          getInsights(),
        ])
        setTransactions(txData)
        setInsight(insightData.insight)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-app-surface rounded-lg mb-2" />
          <div className="h-4 w-64 bg-app-surface rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-app-surface rounded-3xl p-6 h-28" />
          ))}
        </div>
        <div className="bg-app-surface rounded-3xl h-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-app-surface rounded-3xl h-80" />
          <div className="bg-app-surface rounded-3xl h-80" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-danger/10 text-danger rounded-2xl p-6 font-body">
        {error}
      </div>
    )
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const anomalyCount = transactions.filter((t) => t.isAnomaly).length
  const categoryData = groupByCategory(transactions)
  const trendData = groupByDate(transactions)
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]
  const monthComparisonData = groupByMonth(transactions)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-primary">Dashboard</h1>
        <p className="text-app-text/60 font-body mt-1">Here's how your money moved.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
          <p className="text-sm text-app-text/60 font-body">Total Spent</p>
          <p className="font-display text-3xl text-primary mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
          <p className="text-sm text-app-text/60 font-body">Top Category</p>
          <p className="font-display text-3xl text-success mt-1">{topCategory ? topCategory.name : '—'}</p>
        </div>
        <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
          <p className="text-sm text-app-text/60 font-body">Flagged Anomalies</p>
          <p className="font-display text-3xl text-danger mt-1">{anomalyCount}</p>
        </div>
      </div>

      {/* AI Insights card */}
      {insight && (
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 transition-colors">
          <p className="font-display text-lg text-primary mb-2">✨ Your AI Insight</p>
          <p className="text-app-text font-body leading-relaxed">{insight}</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
          <p className="font-display text-lg text-app-text mb-4">Spending by Category</p>
          {categoryData.length === 0 ? (
            <p className="text-app-text/50 font-body text-sm">No transactions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#CA6702'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{ borderRadius: 12, border: 'none' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
          <p className="font-display text-lg text-app-text mb-4">Spending Trend</p>
          {trendData.length === 0 ? (
            <p className="text-app-text/50 font-body text-sm">No transactions yet.</p>
          ) : (
            <div className="text-app-text/50">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.25} />
                  <XAxis dataKey="date" fontSize={12} stroke="currentColor" tick={{ fill: 'currentColor' }} />
                  <YAxis fontSize={12} stroke="currentColor" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    contentStyle={{ borderRadius: 12, border: 'none' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#CA6702"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Month comparison */}
      <div className="bg-app-surface rounded-3xl p-6 shadow-sm transition-colors">
        <p className="font-display text-lg text-app-text mb-4">This Month vs Last Month</p>
        {monthComparisonData.every((m) => m.amount === 0) ? (
          <p className="text-app-text/50 font-body text-sm">Not enough data yet for a comparison.</p>
        ) : (
          <div className="text-app-text/50">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" fontSize={13} stroke="currentColor" tick={{ fill: 'currentColor' }} />
                <YAxis fontSize={12} stroke="currentColor" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{ borderRadius: 12, border: 'none' }}
                />
                <Bar dataKey="amount" fill="#CA6702" radius={[8, 8, 0, 0]} maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}