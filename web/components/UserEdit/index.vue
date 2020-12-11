<template>
  <v-card>
    <v-card-title>
      <span class="headline">Editar usuário</span>
    </v-card-title>
    <v-card-text>
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
        <v-text-field
          v-model="contatoNome"
          label="* Contato nome"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Contato nome é obrigatório',
          ]"
          prepend-inner-icon="mdi-account-circle"
        />
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
        <v-select
          v-model="id_tipo"
          label="* Tipo"
          :items="tipos"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Tipo é obrigatório',
          ]"
          item-text="descricao"
          item-value="id"
          prepend-inner-icon="mdi-tag-outline"
          no-data-text="Nenhum tipo encontrado!"
        ></v-select>
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
        :disabled="!validFormUpdateUser"
        @click="sendUpdateUser"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { UpdateUsuarioDto, TipoDto } from '~/@types'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class UserUpdateComponent extends Vue {
  @Prop({type: String, required: true})
  idUser!: string

  @Prop({type: String, required: true})
  nomeUser!: string

  @Prop({type: String, required: true})
  emailUser!: string

  @Prop({type: String, required: true})
  contatoNomeUser!: string

  @Prop({type: String, required: true})
  contatoTelefoneUser!: string

  @Prop({type: Number, required: true})
  idTipoUser!: number

  emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

  validFormUpdateUser: boolean = false
  obscuredSenha: boolean = true

  nome: string = ''
  email: string = ''
  contatoNome: string = ''
  contatoTelefone: string = ''
  id_tipo: number = 0

  tipos: Array<TipoDto> = []

  created(){
    this.nome = this.nomeUser
    this.email = this.emailUser
    this.contatoNome = this.contatoNomeUser
    this.contatoTelefone = this.contatoTelefoneUser
    this.id_tipo = this.idTipoUser

    this.getTipos();
  }

  sendUpdateUser(){
    let payload: UpdateUsuarioDto = {
      nome: this.nome,
      email: this.email,
      contato_nome: this.contatoNome,
      contato_celular: this.contatoTelefone.replace(/\D/g, ''),
      id_tipo: this.id_tipo
    }

    this.$store.dispatch('usuario/update', { payload, id: this.idUser })
      .then(res => {
        this.$notify({
          group: 'notifications',
          type: 'success',
          title: 'Usuário atualizado com sucesso',
        });
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar atualizar o usuário',
          text: err.response.data.message
        });
      })
  }

  getTipos(){
    this.$store.dispatch('tipos/getTipos')
      .then(res => {
        this.tipos = res.data
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar buscar os tipos',
          text: err.response.data.message
        });
      })
  }

  commitClose() {
    this.$emit("commit-close");
  }

}
</script>

<style>

</style>
