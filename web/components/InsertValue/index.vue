<template>
  <v-card>
    <v-card-title>
      <span class="headline">Inserir valor</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validFormValue">
        <v-text-field
          v-model="valor"
          type="number"
          label="* Valor"
          min="0"
          color="#000"
          outlined
          dense
          prefix="R$"
          :rules="[
            v => !!v || 'Valor é obrigatório'
          ]"
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
        Cancelar
      </v-btn>
      <v-btn
        color="success darken-1"
        text
        :disabled="!validFormValue"
        @click="commitValue"
      >
        Inserir
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { fileToBase64 } from "../../utils"
import { CreateMensagemDto } from "@/@types"
import { saveAs } from 'file-saver'

@Component
export default class InsertValueComponent extends Vue {
  @Prop({required: true}) valor!: number;

  validFormValue: boolean = false
  newValor: number = 0

  commitClose() {
    this.$emit('commit-close')
  }

  commitValue() {
    this.$emit('commit-value', this.valor)
  }
}
</script>