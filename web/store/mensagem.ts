import { ActionTree } from 'vuex'
import { RootState } from '@/store/index.ts'
import { CreateMensagemDto, CreateMensagemEConversaDto } from '@/@types'


export const actions: ActionTree<any, RootState> = {
  async getMensagemByID({ rootState }, id: string) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/mensagem/${id}`,
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
  
  async getMensagensByIDConversa({ rootState }, id: string) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/mensagem/conversa/${id}`,
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

  async createMensagemEConverso({ rootState }, payload: CreateMensagemEConversaDto) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: `/mensagem/conversa`,
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
}
