import { logout, getToken } from '../services/authService.js'

export function renderNavbar() {
  const payload = JSON.parse(atob(getToken().split('.')[1]))
  const name = payload.name || payload.email

  const nav = document.createElement("nav")
  nav.className = "navbar navbar-expand-lg navbar-dark bg-dark mb-4"
  nav.innerHTML = `
    <div class="container">
      <a class="navbar-brand" href="#/dashboard">Support Desk</a>
      <div class="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
        <a class="nav-link" href="#/dashboard">Dashboard</a>
        <a class="nav-link" href="#/tickets">Tickets</a>
        <span class="text-light">${name}</span>
        <button id="btn-logout" class="btn btn-outline-light btn-sm">Salir</button>
      </div>
    </div>
  `
  nav.querySelector('#btn-logout').addEventListener('click', logout)
  return nav
}