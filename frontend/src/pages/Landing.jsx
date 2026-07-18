import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-app-bg flex flex-col transition-colors">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-5">
        <h1 className="font-display text-2xl text-primary">SpendWise</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/10 transition-all text-app-text"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl font-body text-sm font-medium text-app-text hover:bg-primary/10 transition-all"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl font-body text-sm font-medium bg-primary text-white
                       transition-transform hover:scale-105 active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-4xl sm:text-5xl text-primary leading-tight">
              Track your Kharcha, the way you actually talk.
            </h2>
            <p className="text-app-text/70 font-body text-lg leading-relaxed">
              Type your expenses in Hinglish — "chai aur nashta 200 rupaye" — and let AI handle the
              categorizing, budgeting, and insights. No forms, no fuss.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="bg-primary text-white font-body font-medium px-6 py-3 rounded-xl text-center
                           transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="border border-app-text/20 text-app-text font-body font-medium px-6 py-3 rounded-xl text-center
                           hover:bg-app-surface transition-all"
              >
                I already have an account
              </Link>
            </div>
          </div>

          {/* Illustrative chat-bubble mockup */}
          <div className="bg-app-surface rounded-3xl shadow-lg p-6 flex flex-col gap-3 transition-colors">
            <div className="self-end max-w-xs bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md p-3">
              <p className="text-app-text font-body text-sm">chai aur samosa khaya</p>
            </div>
            <div className="self-end max-w-xs bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white bg-[#CA6702]">
                  Food
                </span>
                <span className="font-display text-primary font-semibold">₹80</span>
              </div>
            </div>
            <div className="self-end max-w-xs bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md p-3">
              <p className="text-app-text font-body text-sm">auto mein gaya office ke liye</p>
            </div>
            <div className="self-end max-w-xs bg-primary/10 border border-primary/20 rounded-2xl rounded-br-md p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white bg-[#0A9396]">
                  Transport
                </span>
                <span className="font-display text-primary font-semibold">₹60</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature strip */}
      <section className="border-t border-app-text/10 py-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl mb-2">🧠</p>
            <p className="font-display text-app-text text-lg">Smart categorization</p>
            <p className="text-app-text/60 font-body text-sm mt-1">AI reads your Hinglish notes and sorts them instantly.</p>
          </div>
          <div>
            <p className="text-3xl mb-2">🎯</p>
            <p className="font-display text-app-text text-lg">Budget tracking</p>
            <p className="text-app-text/60 font-body text-sm mt-1">Set limits per category and watch progress live.</p>
          </div>
          <div>
            <p className="text-3xl mb-2">✨</p>
            <p className="font-display text-app-text text-lg">Plain-language insights</p>
            <p className="text-app-text/60 font-body text-sm mt-1">Get a friendly summary of where your money went.</p>
          </div>
        </div>
      </section>
    </div>
  )
}