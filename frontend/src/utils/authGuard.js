import { isAuthenticated } from '../services/authService.js'
import { navigate } from './router.js'

export function requireAuth() {
  if (!isAuthenticated()) {
    navigate('/login')
    return false
  }
  return true
}