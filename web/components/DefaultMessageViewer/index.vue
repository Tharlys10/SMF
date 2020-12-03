<template>
  <div>
    <v-row class="card-default" align="center" justify="center" >
      Selecione uma conversa
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultMessageViewerComponent extends Vue {
  
}
</script>

<style>
.card-default{
  width: 100%;
  height: 70vh;
}
</style>
