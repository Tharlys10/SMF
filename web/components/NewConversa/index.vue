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
          color="#000"
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
            >{{ data.item.nome }}</v-chip>
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
        <v-select
          v-model="id_categoria"
          label="* Categoria"
          :items="categorias"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Categoria é obrigatória',
          ]"
          item-text="descricao"
          item-value="id"
          no-data-text="Nenhuma categoria encontrada!"
        ></v-select>
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
          v-model="texto"
          color="#000" 
          outlined 
          rows="2" 
          label="* Mensagem" 
          type="text"  
          :rules="[
            v => !!v || 'Mensagem é obrigatória',
          ]"
        >
          <template v-slot:append>
            <Anexo :anexos="anexos" />
          </template>
        </v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="commitClose">Cancelar</v-btn>
      <v-btn
        v-if="!isLoading"
        color="success darken-1"
        text
        :disabled="!validFormNewConversa"
        @click="sendConversaEMensagem"
      >Enviar</v-btn>
      <v-progress-circular
        v-else
        indeterminate
        color="#E26724"
      ></v-progress-circular>

    </v-card-actions>

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
  </v-card>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "nuxt-property-decorator";
import {
  CreateMensagemEConversaDto,
  CategoriaDto,
  AnexosCustom,
  CreateAnxNaMensagem
} from "~/@types";
import { fileToBase64 } from "../../utils";
import { mask } from "vue-the-mask";

@Component({
  directives: {
    mask
  }
})
export default class NewConversaComponent extends Vue {
  validFormNewConversa: boolean = false;
  openModalInsertValue: boolean = false;

  isLoading: boolean = false

  idDestinatario: Array<string> = [];
  texto: string = "";
  valor: number = 0;
  assunto: string = "";
  anexos: Array<AnexosCustom> = [];
  ext: string = "";

  id_categoria: number = 0;
  categorias: Array<CategoriaDto> = [];

  // Funções e variveis de controles no campo usuarios
  // No formulario de nova conversa
  searchUsuarios: string = "";
  usuarios: Array<any> = [];
  timeout: any = null;

  @Watch("searchUsuarios")
  onSearchUsuairosChanged(_search: string) {
    if (!_search || _search.length <= 3) {
      return;
    }

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.getUsuarios(_search);
    }, 500);
  }

  created() {
    this.getCategorias();
  }

  setValue(v: any) {
    this.valor = Number(v);
    this.openModalInsertValue = false;
  }

  // Buscar usuarios para preencher o campo de envio das mensagens
  getUsuarios(nome: string) {
    let params = {
      nome
    };

    this.$store
      .dispatch("usuario/getUsuariosByName", params)
      .then(res => {
        res.data?.map((usr: any) => {
          const estaNosUsuariosListados = this.usuarios.some(
            us => usr.email === us.email
          );

          if (!estaNosUsuariosListados) {
            this.usuarios.push(usr);
          }
        });
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar os usuário",
          text: err.response.data.message
        });
      });
  }

  async fileSelected(event: any) {
    // if (!event.target.files.length) return;
    // const file = new File(event.target.files, event.target.files[0].name);
    // const attachment = await fileToBase64(file);
    // const extension = event.target.files[0].name.split(".");
    // const ext = extension[extension.length - 1];
    // this.anexo = attachment;
    // this.ext = ext;
  }

  sendConversaEMensagem() {
    this.isLoading = true;

    const anexos: CreateAnxNaMensagem[] = this.anexos.map(anx => ({
      instrucao: anx.instrucao,
      data_validade: this.$moment(anx.data_validade
        .toString()
        .split("/")
        .reverse()
        .join("-")).add(3, "hours").toDate(),
      valor: Number(anx.valor),
      arquivo: anx.arquivo,
      ext: anx.ext_file
    }));

    let payload: CreateMensagemEConversaDto = {
      anexos,
      texto: this.texto,
      id_destinatario: this.idDestinatario,
      assunto: this.assunto,
      id_categoria: Number(this.id_categoria)
    };

    this.$store
      .dispatch("mensagem/createMensagemEConverso", payload)
      .then(res => {
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar criar a conversa",
          text: err.response.data.message
        });
      })
      .finally(() => this.isLoading = false)
  }

  getCategorias() {
    this.$store
      .dispatch("categorias/getCategorias")
      .then(res => {
        this.categorias = res.data;
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar as categorias",
          text: err.response.data.message
        });
      });
  }

  commitClose() {
    this.$emit("commit-close");
  }

  remove(item: any) {
    const index = this.idDestinatario.indexOf(item.id);
    if (index >= 0) this.idDestinatario.splice(index, 1);
  }

  get usuariosToSelection() {
    return this.usuarios;
  }
}
</script>

<style>
</style>
