<template>
  <div>
    <div class="messages">
      <div class="container-chat" v-for="n in 100" :key="n">
        <img src="https://randomuser.me/api/portraits/women/81.jpg" alt="Avatar">
        <p>Hello. How are you today?</p>
        <v-btn 
          v-if="anexo"
          color="success"
          outlined 
          dark
          small
        >
          <v-icon left>{{ getIcon(null) }}</v-icon> Anexo <v-icon right>mdi-cloud-download-outline</v-icon>
        </v-btn>
        <span class="time-right">11:00 <v-icon right>{{ getIcon('2020-12-02T00:00:00') }}</v-icon></span>
      </div>

      <div class="container-chat darker">
        <img src="https://randomuser.me/api/portraits/women/81.jpg" alt="Avatar" class="right">
        <p>Hey! I'm fine. Thanks for asking!</p>
        <span class="time-left">11:01</span>
      </div>
    </div>
    <div class="input-message">
      <v-form>
        <v-textarea
          color="#000"
          outlined
          rows="2"
          label="Message"
          type="text"
        >
          <template v-slot:append>
            <v-btn icon>
              <v-icon size="25">mdi-clippy</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon size="25">mdi-send</v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class MessageViewerComponent extends Vue {
  getIcon(data: string | null){
    if (!data) {
      return 'mdi-check'
    }

    return 'mdi-check-all'
  }
}
</script>

<style>
/* .banner {
  background-color: #080912;
  color: #FFF;
  font-size: 12px;
  padding: 10px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
} */

.messages{
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.input-message{
  height: 8vh;
  padding: 10px;
}

/* Chat containers */
.container-chat {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #464650;
  background-color: #464650;
  color: #aaa;
}

/* Clear floats */
.container-chat::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container-chat img {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container-chat img.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #999;
}

</style>
