import { apiRequest } from './client'

export function loginUser(email, password) {
  return apiRequest('/auth/login', { method: 'POST', body: { email, password } })
}

export function signupUser(name, email, password) {
  return apiRequest('/auth/signup', { method: 'POST', body: { name, email, password } })
}