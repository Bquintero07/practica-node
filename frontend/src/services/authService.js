const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Credenciales incorrectas')
  const data = await res.json()
  localStorage.setItem('token', data.token)
  return data
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error('Error al registrarse')
  return res.json()
}

export function logout() {
  localStorage.removeItem('token')
  window.location.hash = '/login'
}

export const getToken = () => localStorage.getItem('token')
export const isAuthenticated = () => !!getToken()