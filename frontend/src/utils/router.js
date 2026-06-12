export function navigate(path) {
  window.location.hash = path
}

export function initRouter() {
  const render = async () => {
    const hash = window.location.hash.replace('#/', '') || 'login'
    const app  = document.getElementById('app')

    if (!app) return

    try {
      let page
      if (hash === 'login') {
        const m = await import('../pages/login.js')
        page = m.loginPage
      } else if (hash === 'register') {
        const m = await import('../pages/register.js')
        page = m.registerPage
      } else if (hash === 'dashboard') {
        const m = await import('../pages/dashboard.js')
        page = m.dashboardPage
      } else if (hash === 'tickets') {
        const m = await import('../pages/tickets.js')
        page = m.ticketsPage
      }

      if (page) app.innerHTML = page()
      else app.innerHTML = '<p class="text-center mt-5">404 — Página no encontrada</p>'
    } catch (err) {
      console.error('Error cargando página:', err)
      app.innerHTML = `<p class="text-center mt-5 text-danger">Error: ${err.message}</p>`
    }
  }

  window.addEventListener('hashchange', render)
  render()
}