import { apiRequest } from './client'

export function getInsights() {
  return apiRequest('/insights', { auth: true })
}