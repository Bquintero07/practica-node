import { requireAuth } from '../utils/authGuard.js'
import { renderNavbar } from '../components/navbar.js'
import { getTickets, createTicket, updateTicket, deleteTicket } from '../services/ticketService.js'

const STATUS_BADGE = { ABIERTO: 'danger', EN_PROCESO: 'warning', CERRADO: 'success' }
const PRIORITY_BADGE = { BAJA: 'secondary', MEDIA: 'info', ALTA: 'danger' }

export function ticketsPage() {
    if (!requireAuth()) return ""

    setTimeout(async () => {
        await loadTickets()
        document.getElementById('btn-new-ticket')
            ?.addEventListener('click', () => openModal())
        document.getElementById('ticket-form')
            ?.addEventListener('submit', handleSubmit)
    }, 0)

    const nav = renderNavbar()
    document.body.prepend(nav)

    return `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Tickets</h2>
        <button id="btn-new-ticket" class="btn btn-primary"
          data-bs-toggle="modal" data-bs-target="#ticketModal">
          + Nuevo Ticket</button>
      </div>
      <table class="table table-hover">
        <thead class="table-dark">
          <tr><th>Título</th><th>Estado</th><th>Prioridad</th><th>Acciones</th></tr>
        </thead>
        <tbody id="tickets-body"></tbody>
      </table>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="ticketModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title">Nuevo Ticket</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="ticket-form">
              <input type="hidden" id="ticket-id" />
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input type="text" id="ticket-title" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea id="ticket-desc" class="form-control" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Prioridad</label>
                <select id="ticket-priority" class="form-select">
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA" selected>Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
              <div class="mb-3" id="status-field" style="display:none">
                <label class="form-label">Estado</label>
                <select id="ticket-status" class="form-select">
                  <option value="ABIERTO">Abierto</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="CERRADO">Cerrado</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="ticket-form" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `
}

async function loadTickets() {
    const tickets = await getTickets()
    const tbody = document.getElementById('tickets-body')
    if (!tbody) return
    tbody.innerHTML = tickets.map(t => `
    <tr>
      <td>${t.title}</td>
      <td><span class="badge bg-${STATUS_BADGE[t.status]}">${t.status}</span></td>
      <td><span class="badge bg-${PRIORITY_BADGE[t.priority]}">${t.priority}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-secondary me-1"
          onclick="editTicket(${JSON.stringify(t).replace(/"/g, "&quot;")})">Editar</button>
        <button class="btn btn-sm btn-outline-danger"
          onclick="confirmDelete('${t.id}')">Eliminar</button>
      </td>ces/ticketService.js
    </tr>
  `).join("")
}

async function handleSubmit(e) {
    e.preventDefault()
    const id = document.getElementById('ticket-id').value
    const title = document.getElementById('ticket-title').value
    const description = document.getElementById('ticket-desc').value
    const priority = document.getElementById('ticket-priority').value
    const status = document.getElementById('ticket-status').value
    if (id) await updateTicket(id, { title, description, priority, status })
    else await createTicket({ title, description, priority })
    bootstrap.Modal.getInstance(document.getElementById('ticketModal')).hide()
    await loadTickets()
}

window.editTicket = (ticket) => {
    document.getElementById('modal-title').textContent = 'Editar Ticket'
    document.getElementById('ticket-id').value = ticket.id
    document.getElementById('ticket-title').value = ticket.title
    document.getElementById('ticket-desc').value = ticket.description
    document.getElementById('ticket-priority').value = ticket.priority
    document.getElementById('ticket-status').value = ticket.status
    document.getElementById('status-field').style.display = 'block'
    new bootstrap.Modal(document.getElementById('ticketModal')).show()
}

window.confirmDelete = async (id) => {
    if (confirm('¿Eliminar este ticket?')) {
        await deleteTicket(id)
        await loadTickets()
    }
}

function openModal() {
    document.getElementById('modal-title').textContent = 'Nuevo Ticket'
    document.getElementById('ticket-id').value = ''
    document.getElementById('ticket-title').value = ''
    document.getElementById('ticket-desc').value = ''
    document.getElementById('status-field').style.display = 'none'
}