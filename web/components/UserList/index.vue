<template>
  <div>
    <h4>LISTA DE USUÁRIOS</h4>
    <br />
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="params.busca"
          append-icon="mdi-magnify"
          outlined
          label="Pesquisar"
          single-line
          hide-details
          dense
        ></v-text-field>

        <v-btn
          class="ml-5"
          color="success"
          outlined
          @click="openModalNewUser = true"
        >
          Novo usuário <v-icon right>mdi-account-plus-outline</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page.sync="params.limit"
        :page.sync="params.page"
        :loading="isLoadingTable"
        :server-items-length="count"
        :calculate-widths="true"
        :footer-props="{itemsPerPageOptions: [5,10,20,40]}"
        loading-text="Buscando usuários..."
        no-data-text="Nenhum usuário encontrado!"
      >
        <template v-slot:item.contato_celular="{ item }">
          <div>
            {{ item.contato_celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3")}}
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            @click="dadosModalUpdateUSer = item, openModalUpdateUser = true"
          >
            <v-icon color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="openModalNewUser"
      v-if="openModalNewUser"
      persistent
      max-width="600px"
    >
      <UserNew 
        v-if="openModalNewUser" 
        v-on:commit-close="openModalNewUser = false; getListaUsuarios()"
      />
    </v-dialog>

    <v-dialog
      v-model="openModalUpdateUser"
      v-if="openModalUpdateUser"
      persistent
      max-width="600px"
    >
      <UserEdit
        v-if="openModalUpdateUser" 
        :idUser="dadosModalUpdateUSer.id"
        :nomeUser="dadosModalUpdateUSer.nome"
        :emailUser="dadosModalUpdateUSer.email"
        :contatoNomeUser="dadosModalUpdateUSer.contato_nome"
        :contatoTelefoneUser="dadosModalUpdateUSer.contato_celular"
        v-on:commit-close="openModalUpdateUser = false; getListaUsuarios()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class UserListComponent extends Vue {
  openModalNewUser: boolean = false;
  openModalUpdateUser: boolean = false;
  dadosModalUpdateUSer: Array<any> = [];

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
      text: 'Nome',
      align: 'start',
      sortable: false,
      value: 'nome',
    },
    { 
      text: 'E-mail', 
      align: 'start',
      sortable: false,
      value: 'email' 
    },
    { 
      text: 'Contato nome',
      align: 'start',
      sortable: false, 
      value: 'contato_nome' 
    },
    { 
      text: 'Contato celular', 
      align: 'start',
      sortable: false,
      value: 'contato_celular' 
    },
    {
      text: 'Ações', 
      sortable: false,
      value: 'actions', 
    }
  ];

  items: Array<any> = []

  // Atualizar a tabela pelas mudanças dos filtros
  @Watch("params.limit")
  onPageChanged(_page: number) {
    this.getListaUsuarios();
  }

  @Watch("params.amount")
  onAmountChanged(_amount: number) {
    this.getListaUsuarios();
  }

  @Watch("params.busca")
  onSearchChanged(_search: string) {
    clearTimeout(this.timeout);

    this.isLoadingTable = true

    this.timeout = setTimeout(() => {
      this.params.page = 1

      this.getListaUsuarios();
    }, 500);
  }


  created(){
    this.getListaUsuarios()
  }

  getListaUsuarios(){
    this.$store.dispatch('usuario/getListUsers', this.params)
      .then(res => {
        console.log(res.data);
        this.count = res.data.total
        this.items = res.data.data
      })
      .catch(err => {
        this.isLoadingTable = false
        console.log(err.response.data.message);
      })
      .finally(() => this.isLoadingTable = false)
  }

}
</script>

<style>

</style>
