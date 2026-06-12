import { requireAuth } from '../utils/authGuard.js'
import { renderNavbar } from '../components/navbar.js'
import { getTickets } from '../services/ticketService.js'

export function dashboardPage() {
  if (!requireAuth()) return ""

  
  setTimeout(async () => {
    const tickets = await getTickets()
    const total     = tickets.length
    const abiertos  = tickets.filter(t => t.status === 'ABIERTO').length
    const enProceso = tickets.filter(t => t.status === 'EN_PROCESO').length
    const cerrados  = tickets.filter(t => t.status === 'CERRADO').length

    document.getElementById('stat-total').textContent     = total
    document.getElementById('stat-abiertos').textContent  = abiertos
    document.getElementById('stat-proceso').textContent   = enProceso
    document.getElementById('stat-cerrados').textContent  = cerrados
  }, 0)

  const nav = renderNavbar()
  document.body.prepend(nav)

  return `
    <div class="container">
      <h2 class="mb-4">Dashboard</h2>
      <div class="row g-3">
        <div class="col-md-3">
          <div class="card text-white bg-secondary">
            <div class="card-body"><h5>Total</h5>
            <h2 id="stat-total">—</h2></div></div></div>
        <div class="col-md-3">
          <div class="card text-white bg-danger">
            <div class="card-body"><h5>Abiertos</h5>
            <h2 id="stat-abiertos">—</h2></div></div></div>
        <div class="col-md-3">
          <div class="card text-white bg-warning">
            <div class="card-body"><h5>En Proceso</h5>
            <h2 id="stat-proceso">—</h2></div></div></div>
        <div class="col-md-3">
          <div class="card text-white bg-success">
            <div class="card-body"><h5>Cerrados</h5>
            <h2 id="stat-cerrados">—</h2></div></div></div>
      </div>
    </div>
  `
}