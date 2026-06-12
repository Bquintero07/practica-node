import { register } from '../services/authService.js'
import { navigate } from '../utils/router.js'

export function registerPage() {
  setTimeout(() => {
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const name     = document.getElementById('name').value
      const email    = document.getElementById('email').value
      const password = document.getElementById('password').value
      try {
        await register(name, email, password)
        navigate('/login')
      } catch (err) {
        const errEl = document.getElementById('register-error')
        errEl.textContent = err.message
        errEl.classList.remove('d-none')
      }
    })
  }, 0)

  return `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <h2 class="mb-4 text-center">AI Support Desk</h2>
          <div id="register-error" class="alert alert-danger d-none"></div>
          <form id="register-form">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="name" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" id="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" id="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Registrarse</button>
          </form>
          <p class="text-center mt-3">
            ¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `
}