import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateUsuarioDto, UpdateUsuarioDto } from '~/@types'


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
