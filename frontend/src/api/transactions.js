import { apiRequest } from './client'

export function getTransactions() {
  return apiRequest('/transactions', { auth: true })
}

export function createTransaction(input) {
  return apiRequest('/transactions', {
    method: 'POST',
    body: input,
    auth: true,
  })
}

export function deleteTransaction(id) {
  return apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function updateTransaction(id, input) {
  return apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: input,
    auth: true,
  })
}