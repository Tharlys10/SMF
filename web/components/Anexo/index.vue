<template>
  <div>
    <v-menu top offset-y :close-on-content-click="false" :nudge-width="200" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          color="#E26724"
          :content="anexos.length"
          :value="anexos.length > 0"
          overlap
        >
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon :color="anexos.length ? 'success' : 'secondary'" size="25">mdi-clippy</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-sheet elevation="10">
        <v-sheet class="text-right pa-2 pr-5" dark>
          <span>Anexos</span>
        </v-sheet>

        <div class="pa-4">
          <v-card
            outlined
          >
            <v-list-item-title class="subtitle-1 pa-2 mb-1">
              <v-tooltip left color="#000">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="newAnexo = !newAnexo"  icon v-bind="attrs" v-on="on">
                    <v-icon color="#000">{{ !newAnexo ? 'mdi-arrow-down-bold-outline' : 'mdi-arrow-up-bold-outline' }}</v-icon>
                  </v-btn>
                </template>
                <span>Fechar</span>
              </v-tooltip>
               - Novo anexo

            </v-list-item-title>
            <v-list-item-content v-if="newAnexo" class="pa-2">
              <v-form v-model="validFormNewAnexo">
                <v-file-input
                  v-model="file"
                  label="* Anexo"
                  color="#000"
                  outlined
                  dense
                  show-size
                  :rules="[
                    v => !!v || 'Anexo é obrigatório',
                  ]"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip
                      small
                      label
                      color="primary"
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
                <v-text-field
                  v-model="dataValidade"
                  label="* Data vencimento"
                  color="#000"
                  outlined
                  dense
                  v-mask="'##/##/####'"
                  :rules="[
                    v => !!v || 'Data de vencimento é obrigatória',
                  ]"
                  prepend-icon="mdi-calendar"
                />
                <v-text-field
                  v-model="valor"
                  type="number"
                  label="Valor"
                  min="0"
                  color="#000"
                  outlined
                  dense
                  prepend-icon="mdi-currency-brl"
                />
                <v-text-field
                  v-model="instrucao"
                  label="* Instrução"
                  color="#000"
                  outlined
                  dense
                  :rules="[
                    v => !!v || 'Instrução é obrigatória',
                  ]"
                  prepend-icon="mdi-card-bulleted-settings-outline"
                />
                <v-btn
                  style="float: right"
                  color="success darken-1"
                  text
                  @click="insertAnexo"
                  :disabled="!validFormNewAnexo"
                >
                  Adicionar
                </v-btn>
              </v-form>
            </v-list-item-content>
          </v-card>
          <v-chip-group active-class="primary--text" column>
            <v-chip
              close
              mandatory
              @click:close="removeItem(index)"
              v-for="(item, index) in anexos"
              :key="index"
            >{{ item.name_file }}...</v-chip>
          </v-chip-group>
        </div>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { fileToBase64 } from "../../utils";
import { mask } from 'vue-the-mask'
import { AnexosCustom } from "../../@types";

@Component({
  directives: {
    mask
  }
})
export default class AnexoComponent extends Vue {
  @Prop({ required: true }) anexos!: Array<AnexosCustom>

  newAnexo: boolean = true;
  validFormNewAnexo: boolean = false;

  file: File | null = null;
  dataValidade: Date | null = null;
  valor: number = 0
  instrucao: string = ''

  async insertAnexo(){
    let arquivo = await fileToBase64(this.file as File)
    
    let name = this.file?.name.split('.')[0].substring(0, 5)
    let ext = this.file?.name.split('.')[1]
    
    let payload: AnexosCustom = {
      instrucao: this.instrucao,
      data_validade: this.dataValidade as Date,
      valor: this.valor,
      arquivo: arquivo,
      name_file: name as string,
      ext_file: ext as string
    }

    this.anexos.push(payload)

    this.file = null;
    this.dataValidade = null;
    this.valor = 0;
    this.instrucao = '';
  }

  removeItem(index: number){
    this.anexos.splice(index, 1)
  }
}
</script>

<style>
</style>
