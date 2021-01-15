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
            <v-img :key="$store.state.keyImg" :src="`${$store.state.url_server}/usuario/${$store.getters.tokenData.id}/foto`"></v-img>
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
        <v-list-item 
          v-if="$store.getters.isLoggedIn && $store.state.userAcessoMaster"
          link 
          to="/tipos/list"
        >
          <v-list-item-icon>
            <v-icon>mdi-format-list-text</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Tipos</v-list-item-title>
        </v-list-item>
        <v-list-item 
          v-if="$store.getters.isLoggedIn && $store.state.userAcessoMaster"
          link 
          to="/categorias/list"
        >
          <v-list-item-icon>
            <v-icon>mdi-clipboard-list-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Categorias</v-list-item-title>
        </v-list-item>
        <v-list-item 
          v-if="$store.getters.isLoggedIn" 
          link 
          to="/usuarios/edit"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
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
