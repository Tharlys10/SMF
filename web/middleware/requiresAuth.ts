import { Middleware } from '@nuxt/types'

export const RequiresAuth: Middleware = (context) => {
  const logged = context.store.getters.tokenData

  if (!logged) {
    context.redirect(context.store.state.url || '/login')
  }
  
  const isLoggedIn = context.store.getters.isLoggedIn

  if (!isLoggedIn) {
    context.redirect(context.store.state.url || '/login')
  }
}
