import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/add-expense', label: 'Add Expense', icon: '➕' },
  { to: '/history', label: 'History', icon: '📜' },
  { to: '/budgets', label: 'Budgets', icon: '🎯' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleNavClick() {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex bg-app-bg">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-app-surface border-b border-app-text/10 flex items-center justify-between px-4 z-30 transition-colors">
        <h1 className="font-display text-xl text-primary">SpendWise</h1>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-primary/10 transition-all"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-app-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on desktop */}
      <aside
        className={`
  fixed md:sticky top-0 left-0 h-screen w-64 bg-app-surface border-r border-app-text/10
  flex flex-col p-5 z-50 transition-transform duration-300 md:transition-colors
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
`}
      >
        <div className="flex items-center justify-between mb-1 md:block">
          <h1 className="font-display text-2xl text-primary">SpendWise</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-primary/10 transition-all"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-app-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-app-text/60 font-body mb-8">
          Hi, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm font-medium transition-all
                 ${isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-app-text hover:bg-primary/10'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          className="mb-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium text-app-text
                     hover:bg-primary/10 transition-all text-left"
        >
          {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl text-sm font-body font-medium text-danger
                     hover:bg-danger/10 transition-all text-left"
        >
          🚪 Log out
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}