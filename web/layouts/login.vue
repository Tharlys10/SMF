<template>
  <v-app>
    <v-main>
      <v-container fluid>
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
