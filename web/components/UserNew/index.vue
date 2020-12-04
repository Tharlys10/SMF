<template>
  <v-card>
    <v-card-title>
      <span class="headline">Novo usuário</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormNewUser">
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
        <v-text-field
          v-model="senha"
          label="* Senha"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Senha é obrigatória',
            v => (!!v && v.length >= 8) || 'Min. 8 caracteres'
          ]"
          prepend-inner-icon="mdi-lock"
          :append-icon="obscuredSenha ? 'mdi-eye' : 'mdi-eye-off'"
          :type="!obscuredSenha ? 'text' : 'password'"
          @click:append="obscuredSenha = !obscuredSenha"
        />
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
        :disabled="!validFormNewUser"
        @click="sendCreateUser"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateUsuarioDto } from '~/@types'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class UserNewComponent extends Vue {
  emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

  validFormNewUser: boolean = false
  obscuredSenha: boolean = true

  nome: string = ''
  email: string = ''
  contatoNome: string = ''
  contatoTelefone: string = ''
  senha: string = ''

  sendCreateUser(){
    let payload: CreateUsuarioDto = {
      nome: this.nome,
      email: this.email,
      contato_nome: this.contatoNome,
      contato_celular: this.contatoTelefone.replace(/\D/g, ''),
      senha: this.senha
    }

    this.$store.dispatch('usuario/create', payload)
      .then(res => {
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar criar o usuário',
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
