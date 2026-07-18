import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signupUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
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
      const data = await signupUser(name, email, password)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-md bg-app-surface rounded-3xl shadow-lg p-8 transition-colors">
        <h1 className="font-display text-3xl text-primary mb-2">Create your account</h1>
        <p className="text-app-text/70 mb-6 font-body">
          Start tracking your Kharcha in seconds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                         focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Your name"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-app-text/20 bg-app-bg text-app-text
                         focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="At least 6 characters"
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
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-app-text/70 mt-6 text-center font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}