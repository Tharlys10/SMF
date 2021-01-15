<template>
  <div style="border: 1px solid black">
    <v-btn @click="variavel.push({ anexo: true, step: variavel.length+1 })" class="success">PUSH</v-btn>
    <v-btn @click="variavel.shift()" class="warning">SHIFT</v-btn>
    <p>DENTRO</p>
    <pre>
      {{ variavel }}
    </pre>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class TesteComponent extends Vue {
  @Prop({ required: true }) variavel!: any[]
}
</script>

<style>
</style>
