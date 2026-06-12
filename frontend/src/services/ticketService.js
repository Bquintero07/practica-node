import { getToken } from './authService.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
}

// --- FASE 2: reemplazar con fetch reales cuando P4 tenga el backend ---
export async function getTickets() {
    const res = await fetch(`${API}/tickets`, { headers: authHeaders() })
    return res.json()
}

export async function createTicket(data) {
    const res = await fetch(`${API}/tickets`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
    })
    return res.json()
}

export async function updateTicket(id, data) {
    const res = await fetch(`${API}/tickets/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
    })
    return res.json()
}

export async function deleteTicket(id) {
    await fetch(`${API}/tickets/${id}`, { method: 'DELETE', headers: authHeaders() })
}

