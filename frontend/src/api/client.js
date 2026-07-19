const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, auth = false } = options
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}