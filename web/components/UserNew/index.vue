<template>
  <v-card>
    <v-card-title>
      <span class="headline">Novo usuário</span>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Nome"
          color="#000"
          outlined
          dense
        />
        <v-text-field
          label="E-mail"
          color="#000"
          outlined
          dense
        />
        <v-text-field
          label="Contato nome"
          color="#000"
          outlined
          dense
        />
        <v-text-field
          label="Contato telefone"
          color="#000"
          outlined
          dense
        />
        <v-text-field
          label="Senha"
          color="#000"
          outlined
          dense
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
        @click="null"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class UserNewComponent extends Vue {
  commitClose() {
    this.$emit("commit-close");
  }

}
</script>

<style>

</style>
