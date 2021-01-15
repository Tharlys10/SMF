<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-main>
      <v-container fluid>
        <notifications position="bottom right" class="my-1" group="notifications" />
        <nuxt />  
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultLayout extends Vue {
}
</script>
