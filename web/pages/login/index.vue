<template>
  <div>
    <v-row class="card-login" align="center" justify="center" >
      <v-form class="form-login" v-model="validFormLogin">
        <v-text-field
          v-model="email"
          label="E-mail"
          outlined
          dense
          color="#000"
          :rules="[
            v => !!v || 'E-mail é obrigatório',
            v => emailPattern.test(v) || 'Email não possui um formato válido'
          ]"
          prepend-inner-icon="mdi-email-multiple"
          required
        />

        <v-text-field
          v-model="senha"
          label="Senha"
          outlined
          dense
          color="#000"
          :rules="[
            v => !!v || 'Senha é obrigatória',
            v => (!!v && v.length >= 8) || 'Min. 8 caracteres'
          ]"
          prepend-inner-icon="mdi-lock"
          :append-icon="obscuredSenha ? 'mdi-eye' : 'mdi-eye-off'"
          :type="!obscuredSenha ? 'text' : 'password'"
          @click:append="obscuredSenha = !obscuredSenha"
          required
          @keyup.enter="senha.length >= 8 ? sendLogin() : null"
        />

        <v-btn
          :disabled="!validFormLogin"
          color="success"
          class="mr-4"
          @click="sendLogin"
        >
          Entrar
          <v-icon right>mdi-send</v-icon>
        </v-btn>
      </v-form>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { LoginDto } from '~/@types'

@Component({
  layout: 'login'
})
export default class LoginPage extends Vue {
  emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

  validFormLogin: boolean = false
  obscuredSenha: boolean = true

  email: string = ''
  senha: string = ''

  sendLogin(){
    let payload: LoginDto = {
      email: this.email,
      senha: this.senha
    }

    this.$store.dispatch('sendLogin', payload)
      .then(res => {
        this.$notify({
          group: 'notifications',
          type: 'success',
          title: 'Bem-vindo',
        });

        this.$router.push('/')
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar realizar o login',
          text: err.response.data.message
        });
      })
  }
}
</script>

<style>
.card-login{
  height: 95vh;
}
.form-login{
  width: 35vw;
}
</style>