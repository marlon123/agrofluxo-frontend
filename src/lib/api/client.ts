import type { ProblemDetails } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(public status: number, public problem: ProblemDetails) {
    super(problem.detail || problem.title || `Erro HTTP ${status}`)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  if (response.status === 204) return undefined as T
  const raw = await response.text()
  let body: T | ProblemDetails = {} as T
  if (raw) { try { body = JSON.parse(raw) as T | ProblemDetails } catch { body = { detail: raw } } }
  if (!response.ok) throw new ApiError(response.status, body as ProblemDetails)
  return body as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.problem.detail || error.problem.title || 'A API recusou a operação.'
  if (error instanceof TypeError) return 'Não foi possível conectar ao backend. Verifique se a API está em execução.'
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

export function getFieldErrors(error: unknown) {
  if (!(error instanceof ApiError)) return {}
  return Object.fromEntries((error.problem.violations || []).filter((violation) => violation.field).map((violation) => [violation.field, violation.message]))
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)) })
  const result = query.toString()
  return result ? `?${result}` : ''
}
