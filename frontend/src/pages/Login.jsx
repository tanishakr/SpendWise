import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser(email, password)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-md bg-app-surface rounded-3xl shadow-lg p-8 transition-colors">
        <h1 className="font-display text-3xl text-primary mb-2">Welcome back</h1>
        <p className="text-app-text/70 mb-6 font-body">
          Log in to keep track of your Kharcha.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                         focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-app-text mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                         focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 transition-opacity">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-white font-body font-medium py-2.5 rounded-xl
                       transition-transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-app-text/70 mt-6 text-center font-body">
          New here?{' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}