<template>
  <div>
    <h4>LISTA DE TIPOS</h4>
    <br />
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          class="ml-5"
          color="success"
          outlined
          @click="openModalNewTipo = true"
        >
          Novo tipo <v-icon right>mdi-comment-edit</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="isLoadingTable"
        :calculate-widths="true"
        loading-text="Buscando tipos..."
        no-data-text="Nenhum tipo encontrado!"
      >
        <template v-slot:item.cor="{ item }">
          <div>
            <v-chip
              class="ma-2"
              :color="`#${item.cor}`"
              text-color="white"
            >
              {{ item.tipo }}
            </v-chip>
          </div>
        </template>

      
        <template v-slot:item.actions="{ item }">
          <v-tooltip left color="#E26724">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="dadosModalUpdateTipo = item, openModalUpdateTipo = true"
              >
                <v-icon color="primary">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span>Editar dados</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="openModalNewTipo"
      v-if="openModalNewTipo"
      persistent
      max-width="600px"
    >
      <TipoNew 
        v-if="openModalNewTipo" 
        v-on:commit-close="openModalNewTipo = false; getListaTipos()"
      />
    </v-dialog>

    <v-dialog
      v-model="openModalUpdateTipo"
      v-if="openModalUpdateTipo"
      persistent
      max-width="600px"
    >
      <TipoEdit
        v-if="openModalUpdateTipo" 
        :idTipo="dadosModalUpdateTipo.id"
        :descricaoTipo="dadosModalUpdateTipo.descricao"
        :corTipo="dadosModalUpdateTipo.cor"
        v-on:commit-close="openModalUpdateTipo = false; getListaTipos()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class TipoListComponent extends Vue {
  openModalNewTipo: boolean = false;
  openModalUpdateTipo: boolean = false;
  dadosModalUpdateTipo: Array<any> = [];

  count: number = 0

  params = {
    limit: 10,
    page: 1,
    busca: ''
  }

  timeout: any = null
  isLoadingTable: boolean = true

  headers = [
    {
      text: 'Descrição',
      align: 'start',
      sortable: false,
      value: 'descricao',
    },
    {
      text: 'Cor',
      align: 'start',
      sortable: false,
      value: 'cor',
    },
    {
      text: 'Ações', 
      sortable: false,
      value: 'actions', 
    }
  ];

  items: Array<any> = []

  created(){
    this.getListaTipos()
  }

  getListaTipos(){
    this.$store.dispatch('tipos/getTipos')
      .then(res => {
        this.items = res.data
      })
      .catch(err => {
        this.isLoadingTable = false
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar listar os tipos',
          text: err.response.data.message
        });
      })
      .finally(() => this.isLoadingTable = false)
  }

}
</script>

<style>

</style>
