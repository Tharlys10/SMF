<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nova conversa</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormNewConversa">
        <v-autocomplete
          v-model="idDestinatario"
          chips
          label="* Usuários para envio - Digite o nome para pesquisar"
          :search-input.sync="searchUsuarios"
          :items="usuariosToSelection"
          item-text="nome"
          item-value="id"
          outlined
          dense
          multiple
          :rules="[
            v => !!v || 'Selecione no minimo um usuário'
          ]"
          no-data-text="Nenhum usuario para seleciona"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="remove(data.item)"
            >
              {{ data.item.nome }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.nome"></v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="valor"
          type="number"
          label="Valor"
          min="0"
          color="#000"
          outlined
          dense
        />
        <v-text-field
          v-model="assunto"
          label="* Assunto"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Assunto é obrigatório',
          ]"
        />
        <v-textarea
          color="#000"
          outlined
          rows="2"
          label="* Mensagem"
          type="text"
          v-model="texto"
        >
          <template v-slot:append>
            <v-btn icon @click="$refs.inputFile.click()">
              <v-icon :color="anexo ? 'success' : 'secondary'" size="25">mdi-clippy</v-icon>
            </v-btn>
            <input
              ref="inputFile"
              type="file"
              style="display: none"
              @change="fileSelected"
            />
          </template>
        </v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="red darken-1"
        text
        @click="commitClose"
      >
        Cancela
      </v-btn>
      <v-btn
        color="success darken-1"
        text
        :disabled="!validFormNewConversa"
        @click="sendConversaEMensagem"
      >
        Enviar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { CreateMensagemEConversaDto } from '~/@types'
import { fileToBase64 } from "../../utils";
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class NewConversaComponent extends Vue {
  validFormNewConversa: boolean = false

  idDestinatario: Array<string> = []
  texto: string = ''
  valor: number = 0
  assunto: string = ''
  anexo: string = ''
  ext: string = ''

  // Funções e variveis de controles no campo usuarios
  // No formulario de nova conversa
  searchUsuarios: string = ""
  usuarios: Array<any> = []
  timeout: any = null

  @Watch("searchUsuarios")
  onSearchUsuairosChanged(_search: string) {
    if (!_search || _search.length <= 3) {
      return
    }

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.getUsuarios(_search);
    }, 500);
  }


  // Buscar usuarios para preencher o campo de envio das mensagens
  getUsuarios(nome: string){
    let params = {
      nome
    }

    this.$store.dispatch('usuario/getUsuariosByName',  params)
      .then((res) => {
        this.usuarios = res.data
      })
      .catch((err) => {
        console.log(err.response.data.message);
        
      })
  }

  async fileSelected(event: any) {
    if(!event.target.files.length) return

    const file = new File(event.target.files, event.target.files[0].name)

    const attachment = await fileToBase64(file)

    const extension = event.target.files[0].name.split(".")
    const ext = extension[extension.length - 1]

    this.anexo = attachment
    this.ext = ext
  }

  sendConversaEMensagem(){
    let payload: CreateMensagemEConversaDto = {
      anexo: this.anexo,
      ext: this.ext,
      texto: this.texto,
      valor: this.valor,
      id_destinatario: this.idDestinatario,
      assunto: this.assunto
    }

    this.$store.dispatch('mensagem/createMensagemEConverso', payload)
      .then(res => {
        console.log(res.data);
        this.commitClose()
      })
      .catch(err => {
        console.log(err.response.data.message);
      })
  }

  commitClose() {
    this.$emit("commit-close");
  }

  remove(item: any) {
    const index = this.idDestinatario.indexOf(item.id)
    if (index >= 0) this.idDestinatario.splice(index, 1)
  }


  get usuariosToSelection(){
    return this.usuarios
  }

}
</script>

<style>

</style>
