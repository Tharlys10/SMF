<template>
  <v-app-bar
    color="#080912"
    dense
    dark
    app
  >
    <v-toolbar-title style="display: flex">
      <v-img width="35" :src="require('~/assets/logo.png')"></v-img>
      <span class="mt-1">SMF</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn @click="logout" text>
      Sair <v-icon right>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AppBarComponent extends Vue {
  logout(){
    this.$store.dispatch('logout')
      .then(() => this.$router.push('/login'))
      .catch(() => 
        this.$notify({
          group: 'notifications',
          type: 'error',
          title: 'Erro ao tentar sair',
        })
      );
  }
}
</script>

<style>

</style>
