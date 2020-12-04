<template>
  <v-navigation-drawer
    app
    permanent
    expand-on-hover
    dark
  >
    <v-img class="img-drawer" :src="require('~/assets/background.jpg')">
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-icon size="35">
              mdi-account-circle
            </v-icon>
            <!-- <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img> -->
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ $store.state.userName || 'Nome não encontrado' }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ $store.state.userMail || 'E-mail não encontrado' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list
        nav
        dense
      >
        <v-list-item 
          v-if="$store.getters.isLoggedIn" 
          link 
          to="/"
        >
          <v-list-item-icon>
            <v-icon>mdi-chat-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Conversas</v-list-item-title>
        </v-list-item>
        <v-list-item 
          v-if="$store.getters.isLoggedIn && $store.state.userAcessoMaster"
          link 
          to="/usuarios/list"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Usuários</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-cog-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Configurações</v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-img>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
@Component({})
export default class NavigationDrawerComponent extends Vue {

}
</script>

<style>
.img-drawer{
  height: 100%;
}
</style>
