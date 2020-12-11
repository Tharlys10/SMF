<template>
  <div>
    <h4>LISTA DE CATEGORIA</h4>
    <br />
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          class="ml-5"
          color="success"
          outlined
          @click="openModalNewCategoria = true"
        >
          Nova categoria <v-icon right>mdi-comment-edit</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="isLoadingTable"
        :calculate-widths="true"
        loading-text="Buscando categorias..."
        no-data-text="Nenhuma categoria encontrada!"
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
                @click="dadosModalUpdateCategoria = item, openModalUpdateCategoria = true"
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
      v-model="openModalNewCategoria"
      v-if="openModalNewCategoria"
      persistent
      max-width="600px"
    >
      <CategoriaNew 
        v-if="openModalNewCategoria" 
        v-on:commit-close="openModalNewCategoria = false; getListaCategorias()"
      />
    </v-dialog>

    <v-dialog
      v-model="openModalUpdateCategoria"
      v-if="openModalUpdateCategoria"
      persistent
      max-width="600px"
    >
      <CategoriaEdit
        v-if="openModalUpdateCategoria" 
        :idCategoria="dadosModalUpdateCategoria.id"
        :descricaoCategoria="dadosModalUpdateCategoria.descricao"
        :corCategoria="dadosModalUpdateCategoria.cor"
        v-on:commit-close="openModalUpdateCategoria = false; getListaCategorias()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class CategoriaListComponent extends Vue {
  openModalNewCategoria: boolean = false;
  openModalUpdateCategoria: boolean = false;
  dadosModalUpdateCategoria: Array<any> = [];

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
    this.getListaCategorias()
  }

  getListaCategorias(){
    this.$store.dispatch('categorias/getCategorias')
      .then(res => {
        this.items = res.data
      })
      .catch(err => {
        this.isLoadingTable = false
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar listar as categorias',
          text: err.response.data.message
        });
      })
      .finally(() => this.isLoadingTable = false)
  }

}
</script>

<style>

</style>
