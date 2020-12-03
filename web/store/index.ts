import { MutationTree, GetterTree, ActionTree } from 'vuex'
import { Context } from '@nuxt/types'
import { LoginDto } from '@/@types'

export const state = () => ({
  token: '',
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  set_token: (state, token: string) => {
    state.token = token
  },
}

export const getters: GetterTree<RootState, RootState> = {
  token: (state) => {
    return state.token
  },
  tokenData: (state) => {
    if (!state.token) { return null }

    const raw = state.token.split('.', -1)[1]

    if (!raw) { return null }

    try {
      var atob = require('atob');

      const parsed = atob(raw)

      const data = JSON.parse(parsed)

      return data
    } catch (error) {
      return null
    }
  },
  isLoggedIn: state => {
    if (state.token.length === 0) { return false }
    
    try {
      var atob = require('atob');

      const raws = state.token.split('.', -1)
      const decoded = atob(raws[1])
      const parsed = JSON.parse(decoded)

      const n = Date.now()
      const e = Number(parsed.exp) / 1000      
      
      const exp = new Date(e)
      const now = new Date(n)
      
      if (now > exp) { return false }
    } catch (error) {
      return false
    }

    return true
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }, context: Context) {
    const token = context.app.$cookies.get('token')

    if (!token) {
      return
    }

    commit('set_token', token)
  },

  async sendLogin({ commit }, payload: LoginDto ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/auth`,
        data: payload,
        method: 'POST'
      }).then(res => {
        console.log(res.data);

        const token = res.data.token

        commit('set_token', token)
        
        this.app.$cookies.set('token-fom', token, {
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
        })

        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
