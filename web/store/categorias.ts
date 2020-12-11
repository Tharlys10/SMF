import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { UpdateCategoriaDto, CreateUsuarioDto } from '@/@types'


export const actions: ActionTree<any, RootState> = {
  async getCategorias({ rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/categoria`,
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

  async create({ rootState }, payload: CreateUsuarioDto ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/categoria`,
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

  async update({ rootState }, { payload, id}: { payload: UpdateCategoriaDto, id: number }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/categoria/${id}`,
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
