import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateMensagemDto } from '@/@types'


export const actions: ActionTree<any, RootState> = {
  async create({ rootState }, payload: CreateMensagemDto) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/mensagem`,
        method: 'POST',
        data: payload,
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

  async getConversaCurrent({ rootState }, params ) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/conversa/usuario/current`,
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
