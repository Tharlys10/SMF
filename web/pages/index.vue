<template>
  <div>
    <v-row class="ma-1">
      <v-col class="ma-0 pa-0" cols="3" xs="3">
        <div
          class="title-card title-card-left"
        >
          CONVERSAS
        </div>
        <div class="card-conversas">
          <v-list v-for="n in 10" :key="n">
            <v-list-item>
              <v-list-item-avatar>
                <img src="https://randomuser.me/api/portraits/women/81.jpg">
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Jane Smith</v-list-item-title>
                <v-list-item-subtitle>Logged In</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-col class="ma-0 pa-0" cols="9" xs="9">
        <div
          class="title-card title-card-right"
        >
          THARLYS ALVES
        </div>
        <div class="card-conversas" id="messages">
          <MessageViewer />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { LoginDto } from '~/@types'

@Component({})
export default class HomePage extends Vue {
  tab = 0

  mounted(){
    this.scrollMessage()
  }

  scrollMessage(){
    var objDiv: any = window.document.getElementById("messages");

    objDiv.scrollTop = objDiv.scrollHeight;
  }
}
</script>

<style>
  .card-conversas {
    height: 75vh;
    overflow-y: auto;
  }

  /* width */
  .card-conversas::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  .card-conversas::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey; 
    border-radius: 10px;
  }

  /* Handle */
  .card-conversas::-webkit-scrollbar-thumb {
    background: #EFB810; 
    border-radius: 10px;
  }

  /* Handle on hover */
  .card-conversas::-webkit-scrollbar-thumb:hover {
    background: #D9AD26; 
  }

  .title-card{
    color: #FFF; 
    background-color: #080912; 
    padding: 10px;
  }

  .title-card-left{
    border-top-left-radius: 7px;
    /* border-bottom-left-radius: 7px; */
  }

  .title-card-right{
    border-top-right-radius: 7px;
    /* border-bottom-right-radius: 7px; */
  }
</style>
