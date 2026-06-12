import { login } from '../services/authService.js'
import { navigate } from '../utils/router.js'

export function loginPage() {
  // Renderizar HTML — el listener se adjunta después del render
  setTimeout(() => {
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email    = document.getElementById('email').value
      const password = document.getElementById('password').value
      try {
        await login(email, password)
        navigate('/dashboard')
      } catch (err) {
        document.getElementById('login-error').textContent = err.message
      }
    })
  }, 0)

  return `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <h2 class="mb-4 text-center">AI Support Desk</h2>
          <div id="login-error" class="alert alert-danger d-none"></div>
          <form id="login-form">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" id="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" id="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Ingresar</button>
          </form>
          <p class="text-center mt-3">
            ¿No tienes cuenta? <a href="#/register">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  `
}