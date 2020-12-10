import { Middleware } from '@nuxt/types'

export const RequiredAccess: Middleware = (context) => {
  const currentAccess = context.store.state.userAcessoMaster

  const metaArr = context.route.meta

  if (!metaArr) {
    return
  }

  if (metaArr.length <= 0) {
    return
  }

  const metaObj = metaArr[0]

  const auth = metaObj.auth

  if (!auth) {
    return
  }

  console.log(auth.requiredAccess);
  console.log(currentAccess);
  

  if (!currentAccess && auth.requiredAccess) {
    return context.redirect('/unauthorized')
  }
}
