import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateTipoDto, UpdateTipoDto } from '@/@types'


export const actions: ActionTree<any, RootState> = {
  async getTipos({ rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/tipo`,
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

  async create({ rootState }, payload: CreateTipoDto ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/tipo`,
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

  async update({ rootState }, { payload, id}: { payload: UpdateTipoDto, id: number }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/tipo/${id}`,
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
}
