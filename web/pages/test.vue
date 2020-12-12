<template>
  <v-card>
    <div style="border: 1px solid black">
      <p>FORA</p>
      <pre>
        {{variavel}}
      </pre>
    </div>
    <Teste :variavel="variavel" />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TestPage extends Vue {
  variavel: any[] = []
}
</script>