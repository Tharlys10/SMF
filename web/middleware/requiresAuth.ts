import { Middleware } from '@nuxt/types'

export const RequiresAuth: Middleware = (context) => {
  const logged = context.store.getters.tokenData

  if (!logged) {
    context.redirect('/login')
  }
  
  const isLoggedIn = context.store.getters.isLoggedIn

  if (!isLoggedIn) {
    context.redirect('/login')
  }
}
