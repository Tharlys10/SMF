<template>
  <v-card>
    <v-card-title>
      <span class="headline">Novo tipo</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormNewTipo">
        <v-text-field
          v-model="descricao"
          label="* Descrição"
          color="#000"
          outlined
          dense
          :rules="[
            v => !!v || 'Descrção é obrigatório',
          ]"
          prepend-inner-icon="mdi-account-outline"
        />
        <v-color-picker
          v-model="color"
          hide-inputs
          canvas-height="100"
        ></v-color-picker>
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
        :disabled="!validFormNewTipo"
        @click="sendCreateTipo"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateTipoDto } from '~/@types'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class TipoNewComponent extends Vue {
  validFormNewTipo: boolean = false

  descricao: string = ''
  color: string = ''

  sendCreateTipo(){
    let payload: CreateTipoDto = {
      descricao: this.descricao,
      cor: this.color.substring(1, this.color.length)
    }

    this.$store.dispatch('tipos/create', payload)
      .then(res => {
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar criar o tipo',
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
