<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nova categoria</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormNewCategoria">
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
        :disabled="!validFormNewCategoria"
        @click="sendCreateCategoria"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { CreateCategoriaDto } from '~/@types'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class TipoNewComponent extends Vue {
  validFormNewCategoria: boolean = false

  descricao: string = ''
  color: string = ''

  sendCreateCategoria(){
    let payload: CreateCategoriaDto = {
      descricao: this.descricao,
      cor: this.color.substring(1, this.color.length)
    }

    this.$store.dispatch('categorias/create', payload)
      .then(res => {
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar criar a categoria',
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
