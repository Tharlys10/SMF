<template>
  <div>
    <h4>LISTA DE USUÁRIOS</h4>
    <br />
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
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
      >
        <template v-slot:item.actions="{  }">
          <v-btn
            icon
            @click="null"
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
        v-on:commit-close="openModalNewUser = false"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class UserListComponent extends Vue {
  openModalNewUser: boolean = false;

  search: string =  '';

  headers = [
    {
      text: 'Nome',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    { 
      text: 'E-mail', 
      align: 'start',
      sortable: false,
      value: 'calories' 
    },
    { 
      text: 'Contato nome',
      align: 'start',
      sortable: false, 
      value: 'fat' 
    },
    { 
      text: 'Contato celular', 
      align: 'start',
      sortable: false,
      value: 'carbs' 
    },
    {
      text: 'Ações', 
      sortable: false,
      value: 'actions', 
    }
  ];

  items = [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      iron: '1%',
    },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      iron: '1%',
    },
    {
      name: 'Eclair',
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      iron: '7%',
    },
    {
      name: 'Cupcake',
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      iron: '8%',
    },
    {
      name: 'Gingerbread',
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      iron: '16%',
    },
    {
      name: 'Jelly bean',
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      iron: '0%',
    },
    {
      name: 'Lollipop',
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      iron: '2%',
    },
    {
      name: 'Honeycomb',
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      iron: '45%',
    },
    {
      name: 'Donut',
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      iron: '22%',
    },
    {
      name: 'KitKat',
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      iron: '6%',
    },
  ]

}
</script>

<style>

</style>
