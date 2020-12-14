<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" xs="12">
        <b>Meus dados</b>
      </v-col>
      <v-col style="display: flex; justify-content: center" cols="12" xs="12" md="3">
        <input ref="file" @change="fileSelected" type="file" style="display: none">
        <v-hover :key="$store.state.keyImg" v-slot="{ hover }">
          <v-avatar
            size="250"
          >
            <v-img
              :aspect-ratio="16/9"
              @click="$refs.file.click()"
              :src="`http://100.64.144.174:3369/usuario/${$store.getters.tokenData.id}/foto`"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out darken-2 orange v-card--reveal headline white--text"
                  style="height: 100%;"
                >
                  Atualizar avatar
                </div>
              </v-expand-transition>
            </v-img>
          </v-avatar>
        </v-hover>
      </v-col>
      <v-col cols="12" xs="12" md="9">
        <v-row v-if="!edit">
          <v-col class="headline font-weight-black" cols="12" xs="12">
            {{ usuario.nome || 'Nome não encontrado!' }} <span style="font-size: 12px">({{ usuario.contato_nome || 'Nome do contato não encontrado!' }})</span>
            <v-chip
              class="ma-2"
              :color="`#${ usuario.tipo_cor || '000' }`"
              text-color="white"
            >
              {{ usuario.tipo || 'Tipo não encontrado!' }}
            </v-chip>
          </v-col>
          <v-col cols="12" xs="12">
            <span><b>E-mail:</b> {{ usuario.email || 'E-mail não encontrado!' }}</span><br />
            <span><b>Telefone:</b> {{ usuario.contato_celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3") || 'Telefone do contato não encontrado!' }}</span><br />
          </v-col>
          <v-col cols="12" xs="12">
            <v-btn @click="edit = true" style="float: right" outlined color="success">
              Editar dados
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="edit">
          <v-col class="headline font-weight-black" cols="12" xs="12">
            <v-form v-model="validFormUpdateUser">
              <v-text-field
                v-model="nome"
                label="* Nome"
                color="#000"
                outlined
                dense
                :rules="[
                  v => !!v || 'Nome é obrigatório',
                ]"
                prepend-inner-icon="mdi-account-outline"
              />
              <v-text-field
                v-model="email"
                label="* E-mail"
                color="#000"
                outlined
                dense
                :rules="[
                  v => !!v || 'E-mail é obrigatório',
                  v => emailPattern.test(v) || 'Email não possui um formato válido'
                ]"
                prepend-inner-icon="mdi-email"
              />
              <!-- <v-text-field
                v-model="contatoNome"
                label="* Contato nome"
                color="#000"
                outlined
                dense
                :rules="[
                  v => !!v || 'Contato nome é obrigatório',
                ]"
                prepend-inner-icon="mdi-account-circle"
              /> -->
              <v-text-field
                v-model="contatoTelefone"
                label="* Contato telefone"
                color="#000"
                outlined
                dense
                v-mask="'(##)#####-####'"
                :rules="[
                  v => !!v || 'Contato telefone é obrigatório',
                  v => (!!v && v.length === 14) || 'Telefone não possui um formato válido'
                ]"
                prepend-inner-icon="mdi-cellphone-basic"
              />
            </v-form>
          </v-col>
          <v-col cols="12" xs="12">
            <v-btn @click="saveDados" :disabled="!validFormUpdateUser" style="float: right" outlined color="success">
              Salvar
            </v-btn>
            <v-btn @click="edit = false" style="float: right" outlined class="mr-1" color="error">
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12"><v-divider></v-divider></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12">
        <b>Alteração de senha</b>
      </v-col>
      <v-col cols="12" xs="12">
        <v-form v-model="validFormUpdateSenha">
          <v-text-field
            v-model="oldSenha"
            label="Senha antiga"
            outlined
            dense
            color="#000"
            :rules="[
              v => !!v || 'Senha antiga é obrigatória',
              v => (!!v && v.length >= 8) || 'Min. 8 caracteres'
            ]"
            prepend-inner-icon="mdi-lock"
            :append-icon="obscuredSenha ? 'mdi-eye' : 'mdi-eye-off'"
            :type="!obscuredSenha ? 'text' : 'password'"
            @click:append="obscuredSenha = !obscuredSenha"
            required
          />
          <v-text-field
            v-model="newSenha"
            label="Senha nova"
            outlined
            dense
            color="#000"
            :rules="[
              v => !!v || 'Senha nova é obrigatória',
              v => (!!v && v.length >= 8) || 'Min. 8 caracteres'
            ]"
            prepend-inner-icon="mdi-lock"
            :append-icon="obscuredSenha ? 'mdi-eye' : 'mdi-eye-off'"
            :type="!obscuredSenha ? 'text' : 'password'"
            @click:append="obscuredSenha = !obscuredSenha"
            required
          />
          <v-text-field
            v-model="newSenhaConf"
            label="Confirmação senha nova"
            outlined
            dense
            color="#000"
            :rules="[
              v => !!v || 'Confirmação senha nova é obrigatória',
              v => (!!v && v.length >= 8) || 'Min. 8 caracteres'
            ]"
            prepend-inner-icon="mdi-lock"
            :append-icon="obscuredSenha ? 'mdi-eye' : 'mdi-eye-off'"
            :type="!obscuredSenha ? 'text' : 'password'"
            @click:append="obscuredSenha = !obscuredSenha"
            required
          />
          <v-btn @click="updateSenha" :disabled="!validFormUpdateSenha" style="float: right" outlined color="success">
            Alterar
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { RequiresAuth, RequiredAccess } from '~/middleware'
import { fileToBase64 } from "../../utils";
import { mask } from 'vue-the-mask'
import { UsuarioDto, UpdateSenhaDto } from '../../@types'

@Component({
  directives: {
    mask
  },
  meta: {
    auth: {
      requiredAccess: false,
      requiresAuth: true
    },
  },
  middleware: [RequiresAuth, RequiredAccess]
})
export default class UsuariosEditPage extends Vue {
  edit: boolean = false

  keyImg: number = 0

  emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

  validFormUpdateUser: boolean = false

  nome: string = ''
  email: string = ''
  // contatoNome: string = ''
  contatoTelefone: string = ''

  validFormUpdateSenha: boolean = false
  obscuredSenha: boolean = true

  oldSenha: string = ''
  newSenha: string = ''
  newSenhaConf: string = ''

  usuario: any = {
    id: '',
    id_tipo: 0,
    tipo: '',
    tipo_cor: '',
    nome: '',
    email: '',
    contato_celular: '',
    contato_nome: '',
    tem_foto: false
  }

  created(){
    this.getUsuario()
  }

  getUsuario(){
    let id = this.$store.getters.tokenData.id

    this.$store.dispatch('usuario/getUserByID', id)
      .then((res) => {
        this.usuario = res.data

        this.nome = res.data.nome
        this.email = res.data.email
        this.contatoTelefone = res.data.contato_celular
      })
      .catch((err) => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar usuário",
          text: err.response.data.message
        });
      })
  }

  saveDados(){
    let id = this.$store.getters.tokenData.id

    let payload = {
      nome: this.nome,
      email: this.email,
      contato_celular: this.contatoTelefone.replace(/\D/g, ''),
      contato_nome: this.usuario.contato_nome
    }

    this.$store.dispatch('usuario/update', { id, payload } )
      .then((res) => {
        this.usuario = res.data

        this.nome = res.data.nome
        this.email = res.data.email
        this.contatoTelefone = res.data.contato_celular

        this.edit = false

        this.$notify({
          group: "notifications",
          type: "success",
          title: "Usuário atualizado com sucesso"
        });
      })
      .catch((err) => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar usuário",
          text: err.response.data.message
        });
      })
  }

  async fileSelected(event: any) {
    if (!event.target.files.length) return;
    const file = new File(event.target.files, event.target.files[0].name);
    const attachment = await fileToBase64(file);
    const extension = event.target.files[0].name.split(".");
    const ext = extension[extension.length - 1];

    let id = this.$store.getters.tokenData.id

    let payload = {
      foto: attachment
    }

    this.$store.dispatch('usuario/updateFoto', { payload, id })
    
    this.$store.state.keyImg++
  }

  updateSenha(){
    if (this.newSenha != this.newSenhaConf) {
      this.$notify({
        group: "notifications",
        type: "error",
        title: "Erro ao tentar atualizar senha",
        text: "Senhas diferentes"
      });
    }

    let id = this.$store.getters.tokenData.id

    let payload: UpdateSenhaDto = {
      id,
      senha_antiga: this.oldSenha,
      senha_nova: this.newSenha
    }

    this.$store.dispatch('usuario/updateSenha', { payload })
      .then((res) => {
        this.$notify({
          group: "notifications",
          type: "success",
          title: "Senha atualizada com sucesso",
        });

        this.oldSenha = ''
        this.newSenha = ''
        this.newSenhaConf = ''
      })
      .catch((err) => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar usuário",
          text: err.response.data.message
        });
      })
  }
}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .7;
  position: absolute;
  width: 100%;
  cursor: pointer;
}
</style>