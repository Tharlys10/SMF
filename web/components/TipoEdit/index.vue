<template>
  <v-card>
    <v-card-title>
      <span class="headline">Editar tipo</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormUpdateTipo">
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
          v-model="cor"
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
        :disabled="!validFormUpdateTipo"
        @click="sendUpdateTipo"
      >
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { TipoDto, UpdateTipoDto } from '~/@types'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class TipoUpdateComponent extends Vue {
  @Prop({type: Number, required: true})
  idTipo!: number

  @Prop({type: String, required: true})
  descricaoTipo!: string

  @Prop({type: String, required: true})
  corTipo!: string

  validFormUpdateTipo: boolean = false

  id: number = 0
  descricao: string = ''
  cor: string = ''

  created(){
    this.id = this.idTipo
    this.descricao = this.descricaoTipo
    this.cor = this.corTipo
  }

  sendUpdateTipo(){
    let payload: UpdateTipoDto = {
      descricao: this.descricao,
      cor: this.cor.substring(1, this.cor.length)
    }

    this.$store.dispatch('tipos/update', { payload, id: this.idTipo })
      .then(res => {
        this.$notify({
          group: 'notifications',
          type: 'success',
          title: 'Tipo atualizado com sucesso',
        });
        this.commitClose();
      })
      .catch(err => {
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar atualizar o tipo',
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
