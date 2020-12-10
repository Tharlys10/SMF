<template>
  <div>
    <v-row class="ma-1">
      <v-col class="ma-0 pa-0" cols="3" xs="3">
        <div
          class="title-card title-card-left"
        >
          <v-tooltip bottom color="#E26724">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark 
                icon
                v-bind="attrs"
                v-on="on"
                @click="openModalNewConversa = true"
              >
                <v-icon>mdi-message-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>Nova conversa</span>
          </v-tooltip>
          <span>CONVERSAS</span>

        </div>
        <div class="card-conversas">
          <v-list>
            <v-list-item  
              :class="idConversa === item.conversa_id ? 'grey lighten-1' : null"
              @click="
                conversas[index].total_nao_lidas = 0,
                key++,
                idConversa = item.conversa_id, 
                idDestinatario = item.conversa_id_usuario_primario === $store.getters.tokenData.id ? item.conversa_id_usuario_secundario : item.conversa_id_usuario_primario, 
                userConversa = item.usuario_s_nome, 
                assuntoConversa = item.conversa_assunto" 
              v-for="(item, index) in conversas" 
              :key="item.conversa_id"
            >
              <v-list-item-avatar>
                <v-avatar color="#080912">
                  <v-icon dark>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
                <!-- <img src="https://randomuser.me/api/portraits/women/81.jpg"> -->
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.conversa_assunto }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span>
                    {{ item.usuario_s_nome }}
                  </span>
                  <br />
                  <v-chip
                    small
                    class="my-1"
                    :color="item.categoria_cor"
                    text-color="white"
                  >
                    {{ item.categoria }}
                  </v-chip>
                </v-list-item-subtitle>
                
              </v-list-item-content>
              <v-list-item-action v-if="item.total_nao_lidas > 0">
                <div class="não-lidas">
                  
                  {{ item.total_nao_lidas }}
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-col class="ma-0 pa-0" cols="9" xs="9">
        <div v-if="idConversa">
          <div
            class="title-card title-card-right pa-4"
          >
            {{ userConversa }} <span style="font-size: 10px;">({{ assuntoConversa }})</span>
          </div>
          <div class="card-conversas" id="messages">
            <MessageViewer
              :key="key"
              :idConversa="idConversa"
              :idDestinatario="idDestinatario"
              v-on:commit-recharge="getMinhasConversas()"
            />
          </div>
        </div>
        <div v-else>
          <div
            class="title-card title-card-right pa-4"
          >
            <span>Selecione uma conversa para vizualiza o conteúdo</span>
          </div>
          <div class="card-conversas">
            <DefaultMessageViewer/>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="openModalNewConversa"
      v-if="openModalNewConversa"
      persistent
      max-width="600px"
    >
      <NewConversa 
        v-if="openModalNewConversa" 
        v-on:commit-close="openModalNewConversa = false; getMinhasConversas()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { LoginDto } from '~/@types'
import { RequiresAuth, RequiredAccess } from '~/middleware'

@Component({
  meta: {
    auth: {
      requiredAccess: false,
      requiresAuth: true
    },
  },
  middleware: [RequiresAuth, RequiredAccess]
})
export default class HomePage extends Vue {
  openModalNewConversa: boolean = false;
  conversas: Array<any> = []

  idConversa: string | null = null
  idDestinatario: string | null = null
  userConversa: string | null = null
  assuntoConversa: string | null = null

  key: number = 0

  created(){
    this.getMinhasConversas()
  }

  scrollMessage(){
    var objDiv: any = window.document.getElementById("messages");
    
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  getMinhasConversas(){
    this.$store.dispatch('conversa/getConversaCurrent')
      .then(res => {
        this.conversas = res.data;
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar buscar as conversa',
          text: err.response.data.message
        });
      })
  }
}
</script>

<style>
  .card-conversas {
    height: 75vh;
    overflow-y: auto;
  }

  /* width */
  .card-conversas::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  .card-conversas::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; 
    border-radius: 10px;
  }

  /* Handle */
  .card-conversas::-webkit-scrollbar-thumb {
    background: #EFB810; 
    border-radius: 10px;
  }

  /* Handle on hover */
  .card-conversas::-webkit-scrollbar-thumb:hover {
    background: #D9AD26; 
  }

  .title-card{
    color: #FFF; 
    background-color: #080912; 
    padding: 10px;
  }

  .title-card-left{
    border-top-left-radius: 7px;
    /* border-bottom-left-radius: 7px; */
  }

  .title-card-right{
    border-top-right-radius: 7px;
    /* border-bottom-right-radius: 7px; */
  }

  .não-lidas{
    width: 25px;
    color: #FFF;
    display: flex;
    background-color: #228B22;
    justify-content: center;
    border-radius: 50%;
    font-weight: bold;
  }
</style>
