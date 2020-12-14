import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateUsuarioDto, UpdateUsuarioDto, UpdateSenhaDto } from '~/@types'


export const actions: ActionTree<any, RootState> = {
  async create({ rootState }, payload: CreateUsuarioDto ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario`,
        data: payload,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async update({ rootState }, { payload, id}: { payload: UpdateUsuarioDto, id: string }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario/${id}`,
        data: payload,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async updateFoto({ rootState }, { payload, id }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario/${id}/foto`,
        data: payload,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async updateSenha({ rootState, commit }, { payload }: { payload: UpdateSenhaDto }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/auth/senha`,
        data: payload,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
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

  async getUserByID({ rootState }, id: string) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario/${id}`,
        data: id,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async getListUsers({ rootState }, params ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario/list`,
        method: 'GET',
        params,
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  async getUsuariosByName({ rootState }, params ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/usuario/list/conversa/new`,
        method: 'GET',
        params,
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
