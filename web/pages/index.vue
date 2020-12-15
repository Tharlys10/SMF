<template>
  <div>
    <v-row class="ma-1">
      <v-col class="ma-0 pa-0" cols="3" xs="3">
        <div class="title-card title-card-left">
          <v-menu top offset-y :close-on-content-click="false" :nudge-width="300" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-filter-outline</v-icon>
              </v-btn>
            </template>

            <v-sheet elevation="10">
              <v-sheet class="pa-2 pr-5" dark>
                <span>Filtros</span>
              </v-sheet>
              <div class="pa-5">
                <v-form ref="formFiltro">
                  <v-text-field
                    v-model="filtroAssunto"
                    label="Assunto"
                    dense
                    outlined
                    color="#000"
                    clearable
                  />
                  <v-select
                    v-model="filtroIDCategoria"
                    label="Categoria"
                    :items="categorias"
                    color="#000"
                    outlined
                    dense
                    item-text="descricao"
                    item-value="id"
                    no-data-text="Nenhuma categoria encontrada!"
                    clearable
                  ></v-select>
                  <v-autocomplete
                    v-model="filtroUsuario"
                    label="Usuário"
                    :search-input.sync="searchUsuarios"
                    :items="usuariosToSelection"
                    item-text="nome"
                    item-value="id"
                    outlined
                    dense
                    color="#000"
                    no-data-text="Nenhum usuario para seleciona"
                    clearable
                  >
                  </v-autocomplete>
                  <v-select
                    v-model="filtroStatusLidas"
                    label="Status"
                    :items="[
                      {
                        label: 'Todas',
                        chave: 0
                      },
                      {
                        label: 'Lidas',
                        chave: 1
                      },
                      {
                        label: 'Não lidas',
                        chave: 2
                      }
                    ]"
                    color="#000"
                    outlined
                    dense
                    item-text="label"
                    item-value="chave"
                  ></v-select>
                  <v-btn text color="error" @click="$refs.formFiltro.reset(), filtroStatusLidas = 0">Limpar</v-btn>
                </v-form>
              </div>
            </v-sheet>
          </v-menu>
          <v-tooltip bottom color="#E26724">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on" @click="openModalNewConversa = true">
                <v-icon>mdi-message-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>Nova conversa</span>
          </v-tooltip>
          <span>CONVERSAS</span>
        </div>
        <div class="card-conversas">
          <v-list>
            <v-list-item
              :class="idConversa === item.conversa_id ? 'grey lighten-1' : null"
              @click="
                conversas[index].total_nao_lidas = 0,
                key++,
                idConversa = item.conversa_id, 
                idDestinatario = item.conversa_id_usuario_primario === $store.getters.tokenData.id ? item.conversa_id_usuario_secundario : item.conversa_id_usuario_primario, 
                userConversa = item.usuario_s_nome, 
                assuntoConversa = item.conversa_assunto"
              v-for="(item, index) in conversas"
              :key="item.conversa_id"
            >
              <v-list-item-avatar>
                <v-avatar color="#080912">
                  <!-- <v-icon dark>mdi-account-circle</v-icon> -->
                  <img :src="`${$store.state.url_server}/usuario/${ item.conversa_id_usuario_secundario }/foto`">
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.conversa_assunto }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span>{{ item.usuario_s_nome }}</span>
                  <br />
                  <v-chip
                    small
                    class="my-1"
                    :color="`#${item.categoria_cor}`"
                    text-color="white"
                  >{{ item.categoria }}</v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action v-if="item.total_nao_lidas > 0">
                <div class="não-lidas">{{ item.total_nao_lidas }}</div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-col class="ma-0 pa-0" cols="9" xs="9">
        <div v-if="idConversa">
          <div class="title-card title-card-right pa-4">
            {{ userConversa }}
            <span style="font-size: 10px;">({{ assuntoConversa }})</span>
          </div>
          <div class="card-conversas" id="messages">
            <MessageViewer
              :key="key"
              :idConversa="idConversa"
              :idDestinatario="idDestinatario"
              v-on:commit-recharge="getMinhasConversas()"
            />
          </div>
        </div>
        <div v-else>
          <div class="title-card title-card-right pa-4">
            <span>Selecione uma conversa para vizualiza o conteúdo</span>
          </div>
          <div class="card-conversas">
            <DefaultMessageViewer />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="openModalNewConversa"
      v-if="openModalNewConversa"
      persistent
      max-width="600px"
    >
      <NewConversa
        v-if="openModalNewConversa"
        v-on:commit-close="openModalNewConversa = false; getMinhasConversas()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "nuxt-property-decorator";
import { LoginDto, CategoriaDto } from "~/@types";
import { RequiresAuth, RequiredAccess } from "~/middleware";

@Component({
  meta: {
    auth: {
      requiredAccess: false,
      requiresAuth: true
    }
  },
  middleware: [RequiresAuth, RequiredAccess]
})
export default class HomePage extends Vue {
  openModalNewConversa: boolean = false;
  conversas: Array<any> = [];

  idConversa: string | null = null;
  idDestinatario: string | null = null;
  userConversa: string | null = null;
  assuntoConversa: string | null = null;

  key: number = 0;

  timeout: any = null;
  searchUsuarios: string = "";
  usuarios: Array<any> = [];

  categorias: Array<CategoriaDto> = [];

  filtroAssunto: string = ''
  filtroIDCategoria: number = -1
  filtroUsuario: string = ''
  filtroStatusLidas: number = 0

  @Watch("searchUsuarios")
  onSearchUsuairosChanged(_search: string) {
    if (!_search || _search.length <= 3) {
      return;
    }

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.getUsuarios(_search);
    }, 500);
  }

  @Watch("filtroAssunto")
  onConversasAssuntoChanged(_assunto: string) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {

      this.getMinhasConversas();
    }, 500);

  }

  @Watch("filtroIDCategoria")
  onConversasCategoriaChanged(_idCategoria: number) {
    this.getMinhasConversas();
  }

  @Watch("filtroUsuario")
  onConversasUsuarioChanged(_id_usuario: string) {
    this.getMinhasConversas();
  }

  @Watch("filtroStatusLidas")
  onConversasLidasNãoLisdaChanged(_chave: number) {
    this.getMinhasConversas();
  }

  created() {
    this.getMinhasConversas();
    this.getCategorias();
  }

  scrollMessage() {
    var objDiv: any = window.document.getElementById("messages");

    objDiv.scrollTop = objDiv.scrollHeight;
  }

  getMinhasConversas() {
    let params = {
      assunto: this.filtroAssunto,
      id_categoria: this.filtroIDCategoria,
      id_usuario: this.filtroUsuario,
      status: this.filtroStatusLidas
    }

    this.$store
      .dispatch("conversa/getConversaCurrent", params)
      .then(res => {
        this.conversas = res.data;
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar as conversa",
          text: err.response.data.message
        });
      });
  }

  getCategorias() {
    this.$store
      .dispatch("categorias/getCategorias")
      .then(res => {
        this.categorias = res.data;
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar as categorias",
          text: err.response.data.message
        });
      });
  }

  getUsuarios(nome: string) {
    let params = {
      nome
    };

    this.$store
      .dispatch("usuario/getUsuariosByName", params)
      .then(res => {
        res.data?.map((usr: any) => {
          const estaNosUsuariosListados = this.usuarios.some(
            us => usr.email === us.email
          );

          if (!estaNosUsuariosListados) {
            this.usuarios.push(usr);
          }
        });
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar os usuário",
          text: err.response.data.message
        });
      });
  }

  get usuariosToSelection() {
    return this.usuarios;
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
  background: #e26724;
  border-radius: 10px;
}

/* Handle on hover */
.card-conversas::-webkit-scrollbar-thumb:hover {
  background: #e26724;
}

.title-card {
  color: #fff;
  background-color: #080912;
  padding: 10px;
}

.title-card-left {
  border-top-left-radius: 7px;
  /* border-bottom-left-radius: 7px; */
}

.title-card-right {
  border-top-right-radius: 7px;
  /* border-bottom-right-radius: 7px; */
}

.não-lidas {
  width: 25px;
  color: #fff;
  display: flex;
  background-color: #228b22;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
}
</style>
