import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateMensagemDto } from '@/@types'


export const actions: ActionTree<any, RootState> = {
  async getCategorias({ rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/categorias`,
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

  async getConversaCurrent({ rootState } ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/conversa/usuario/current`,
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
}
