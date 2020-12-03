<template>
  <v-app-bar
    color="#080912"
    dense
    dark
    app
  >
    <v-toolbar-title>Page title</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AppBarComponent extends Vue {

}
</script>

<style>

</style>
