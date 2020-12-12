<template>
  <div>
    <div class="messages">
      <div v-for="(item, index) in mensagens" :key="item.id">
        <div  v-if="!item.e_remetente" class="container-chat darker">
          <v-avatar id="avatar" color="#080912">
            <v-icon dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
          <p v-if="item.valor > 0"> Valor: 
            {{ Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency'
            }).format(item.valor)}}
          </p>
          <p>{{ item.texto }}</p>
          <v-btn 
            v-if="item.tem_anexo"
            class="mb-2"
            color="success"
            outlined 
            dark
            small
            @click="downloadAttachment(item.id, index)"
          >
            <v-icon left>{{ getIcon(item.data_anexo) }}</v-icon> Anexo <v-icon right>mdi-cloud-download-outline</v-icon>
          </v-btn>
          <br/>
          <span class="time-left">{{ formatDate(item.data_envio) }} <v-icon right>{{ getIcon(item.data_leitura) }}</v-icon></span>
        </div>

        <div v-else class="container-chat" >
          <v-avatar id="avatar" color="#080912">
            <v-icon dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
          <p v-if="item.valor > 0"> Valor: 
            {{ Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency'
            }).format(item.valor)}}
          </p>
          <p>{{ item.texto }}</p>
          <v-btn 
            v-if="item.tem_anexo"
            color="success"
            outlined 
            dark
            small
            @click="downloadAttachment(item.id, index)"
          >
            <v-icon left>{{ getIcon(item.data_anexo) }}</v-icon> Anexo <v-icon right>mdi-cloud-download-outline</v-icon>
          </v-btn>
          
          <span class="time-right">{{ formatDate(item.data_envio) }} <v-icon right>{{ getIcon(item.data_leitura) }}</v-icon></span>
        </div>
      </div>
      
    </div>
    <div class="input-message">
      <v-form>
        <v-textarea
          color="#000"
          outlined
          rows="2"
          label="Mensagem"
          type="text"
          v-model="texto"
        >
          <template v-slot:append>
            <Anexo :anexos="anexos" />
            <!-- <v-btn icon @click="$refs.inputFile.click()">
              <v-icon :color="anexo ? 'success' : 'secondary'" size="25">mdi-clippy</v-icon>
            </v-btn>
            <input
              ref="inputFile"
              type="file"
              style="display: none"
              @change="fileSelected"
            /> -->
            <!-- <v-btn icon @click="openModalInsertValue = true">
              <v-icon size="25" :color="valor > 0 ? 'success': 'secondary'">mdi-currency-usd-circle-outline</v-icon>
            </v-btn> -->
            <v-btn icon @click="sendMensagem">
              <v-icon size="25">mdi-send</v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </v-form>
    </div>

    <v-dialog 
      v-model="openModalInsertValue"
      v-if="openModalInsertValue"
      persistent
      max-width="600px"
    >
      <InsertValue
        v-if="openModalInsertValue" 
        :valor="valor"
        v-on:commit-close="openModalInsertValue = false"
        v-on:commit-value="setValue"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { fileToBase64 } from "../../utils"
import { CreateMensagemDto, AnexosCustom, CreateAnxNaMensagem } from "@/@types"
import { saveAs } from 'file-saver'

@Component
export default class MessageViewerComponent extends Vue {
  @Prop({type: String, required: true})
  idConversa!: string;

  @Prop({type: String, required: true})
  idDestinatario!: string;

  openModalInsertValue: boolean = false
  
  anexos: Array<AnexosCustom> = [];

  mensagens: Array<any> = []

  id_conversa: string = ''
  id_destinatario: string = ''
  texto: string = ''

  created(){
    this.getMensagensByIDConversa()
  }

  // setValue(v: any) {
  //   this.valor = Number(v)
  //   this.openModalInsertValue = false
  // }

  getMensagensByIDConversa(){
    this.$store.dispatch('mensagem/getMensagensByIDConversa', this.idConversa)
      .then(res => {
        this.mensagens = res.data;
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar buscar as mensagens',
          text: err.response.data.message
        });
      })
  }

  // async fileSelected(event: any) {
  //   if(!event.target.files.length) return

  //   const file = new File(event.target.files, event.target.files[0].name)

  //   const attachment = await fileToBase64(file)

  //   const extension = event.target.files[0].name.split(".")
  //   const ext = extension[extension.length - 1]

  //   this.anexo = attachment
  //   this.ext = ext
  // }

  sendMensagem() {
    const anexos: CreateAnxNaMensagem[] = this.anexos.map(anx => ({
      instrucao: anx.instrucao,
      data_validade: new Date(anx.data_validade.toString().split('/').reverse().join('-')),
      valor: anx.valor,
      arquivo: anx.arquivo,
      ext: anx.ext_file
    }))

    let payload: CreateMensagemDto = {
      id_conversa: this.idConversa,
      id_destinatario: this.idDestinatario,
      texto: this.texto,
      anexos
    }

    this.$store.dispatch('mensagem/create', payload)
      .then(res => {
        this.texto = ''
        this.anexos = []

        this.mensagens.push(res.data)
        this.$emit('commit-recharge')
      })
      .catch((err) => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar criar mensagem',
          text: err.response.data.message
        });
      })
  }

  async downloadAttachment(id: string, index: number) {
    const { data } = await this.$store.dispatch(
      "mensagem/getMensagemByID",
      id
    )

    if (!data.anexo) return

    const attB64 = await fetch(`data:${data.ext};base64,${data.anexo}`)

    const buf = await attB64.arrayBuffer()

    const file = new File([buf], `${'download'}.${data.ext}`)

    saveAs(file, `${'download'}.${data.ext}`)

    if (data.atualizado) {
      this.mensagens[index].data_anexo = new Date()
    }

  }

  formatDate(date: string){
    return this.$moment(date).format('LLL')
  }

  getIcon(data: string | null){
    if (!data) {
      return 'mdi-check'
    }

    return 'mdi-check-all'
  }
}
</script>

<style>
/* .banner {
  background-color: #080912;
  color: #FFF;
  font-size: 12px;
  padding: 10px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
} */

.messages{
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.input-message{
  height: 8vh;
  padding: 10px;
}

/* Chat containers */
.container-chat {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #464650;
  background-color: #464650;
  color: #FFF;
}

/* Clear floats */
.container-chat::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container-chat #avatar {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container-chat #avatar.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #FFF;
}

</style>