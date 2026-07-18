import { apiRequest } from './client'

export function getBudgets(month) {
  return apiRequest(`/budgets/${month}`, { auth: true })
}

export function upsertBudget(input) {
  return apiRequest('/budgets', {
    method: 'POST',
    body: input,
    auth: true,
  })
}

export function deleteBudget(id) {
  return apiRequest(`/budgets/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}