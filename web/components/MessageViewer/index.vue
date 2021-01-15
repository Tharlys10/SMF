<template>
  <div>
    <div class="messages">
      <div v-for="(item, index) in mensagens" :key="item.id">
        <div v-if="!item.e_remetente" class="container-chat darker">
          <!-- <v-avatar id="avatar" color="#080912">
            <v-icon dark>mdi-account-circle</v-icon>
            <img :src="`${$store.state.url_server}/usuario/${ item.id_remetente }/foto`">
          </v-avatar> -->
          <p>{{ item.texto }}</p>
          <v-tooltip color="#E26724" top v-for="anexo in item.dados_anexos" :key="anexo.sequencia">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mb-2 mr-1"
                color="success"
                outlined
                dark
                small
                v-bind="attrs"
                v-on="on"
                :disabled="loadingAnexoIDMensagem === item.id && loadingAnexoSequencia == anexo.sequencia"
                @click="downloadAttachment(item.id, index, anexo.sequencia)"
              >
                <v-progress-circular
                  v-if="loadingAnexoIDMensagem === item.id && loadingAnexoSequencia == anexo.sequencia"
                  indeterminate
                  color="#E26724"
                  size="20"
                ></v-progress-circular>
                <v-icon v-else left>{{ getIcon(anexo.data_leitura) }}</v-icon>Anexo
                <v-icon right>mdi-cloud-download-outline</v-icon>
              </v-btn>
            </template>
            <span>
              <b>Instrução:</b>
              {{ anexo.instrucao }}
              <br />
              <b>Valor:</b>
              {{
              Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency'
              }).format(anexo.valor)
              }}
              <br />
              <b>Data de vencimento:</b>
              {{ formatDate(anexo.data_validade, 'LL') }}
            </span>
          </v-tooltip>

          <br />
          <span class="time-left">
            {{ formatDate(item.data_envio) }}
            <v-icon right>{{ getIcon(item.data_leitura) }}</v-icon>
          </span>
        </div>

        <div v-else class="container-chat">
          <!-- <v-avatar id="avatar" color="#080912">
            <img :src="`${$store.state.url_server}/usuario/${ item.id_remetente }/foto`">
            <v-icon dark>mdi-account-circle</v-icon>
          </v-avatar> -->
          <p>{{ item.texto }}</p>
          <v-tooltip color="#E26724" top v-for="anexo in item.dados_anexos" :key="anexo.sequencia">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mb-2 mr-1"
                color="success"
                outlined
                dark
                small
                v-bind="attrs"
                v-on="on"
                :disabled="loadingAnexoIDMensagem === item.id && loadingAnexoSequencia == anexo.sequencia"
                @click="downloadAttachment(item.id, index, anexo.sequencia)"
              >
                <v-progress-circular
                  v-if="loadingAnexoIDMensagem === item.id && loadingAnexoSequencia == anexo.sequencia"
                  indeterminate
                  color="#E26724"
                  size="20"
                ></v-progress-circular>
                <v-icon v-else left>{{ getIcon(anexo.data_leitura) }}</v-icon>Anexo
                <v-icon right>mdi-cloud-download-outline</v-icon>
              </v-btn>
            </template>
            <span>
              <b>Instrução:</b>
              {{ anexo.instrucao }}
              <br />
              <b>Valor:</b>
              {{
              Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency'
              }).format(anexo.valor)
              }}
              <br />
              <b>Data de vencimento:</b>
              {{ formatDate(anexo.data_validade, 'LL') }}
            </span>
          </v-tooltip>

          <span class="time-right">
            {{ formatDate(item.data_envio) }}
            <v-icon right>{{ getIcon(item.data_leitura) }}</v-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="input-message">
      <v-form>
        <v-textarea v-model="texto" color="#000" outlined rows="2" label="Mensagem" type="text">
          <template v-slot:append>
            <Anexo :anexos="anexos" />
            <v-btn v-if="!isLoading" :disabled="!texto" icon @click="sendMensagem">
              <v-icon size="25">mdi-send</v-icon>
            </v-btn>
            <v-progress-circular v-else indeterminate color="#E26724"></v-progress-circular>
          </template>
        </v-textarea>
      </v-form>
    </div>

    <v-dialog
      v-model="openModalInsertValue"
      v-if="openModalInsertValue"
      persistent
      max-width="600px"
    >
      <InsertValue
        v-if="openModalInsertValue"
        :valor="valor"
        v-on:commit-close="openModalInsertValue = false"
        v-on:commit-value="setValue"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { fileToBase64 } from "../../utils";
import { CreateMensagemDto, AnexosCustom, CreateAnxNaMensagem } from "@/@types";
import { saveAs } from "file-saver";

@Component
export default class MessageViewerComponent extends Vue {
  @Prop({ type: String, required: true })
  idConversa!: string;

  @Prop({ type: String, required: true })
  idDestinatario!: string;

  loadingAnexoIDMensagem: string = "";
  loadingAnexoSequencia: number = 0;

  openModalInsertValue: boolean = false;

  anexos: Array<AnexosCustom> = [];

  mensagens: Array<any> = [];

  id_conversa: string = "";
  id_destinatario: string = "";
  texto: string = "";

  isLoading: boolean = false;

  created() {
    this.getMensagensByIDConversa();
  }

  // setValue(v: any) {
  //   this.valor = Number(v)
  //   this.openModalInsertValue = false
  // }

  getMensagensByIDConversa() {
    this.$store
      .dispatch("mensagem/getMensagensByIDConversa", this.idConversa)
      .then(res => {
        this.mensagens = res.data;
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar buscar as mensagens",
          text: err.response.data.message
        });
      });
  }

  sendMensagem() {
    this.isLoading = true;

    const anexos: CreateAnxNaMensagem[] = this.anexos.map(anx => ({
      instrucao: anx.instrucao,
      data_validade: this.$moment(
        anx.data_validade
          .toString()
          .split("/")
          .reverse()
          .join("-")
      )
        .add(3, "hours")
        .toDate(),
      valor: Number(anx.valor),
      arquivo: anx.arquivo,
      ext: anx.ext_file
    }));

    let payload: CreateMensagemDto = {
      id_conversa: this.idConversa,
      id_destinatario: this.idDestinatario,
      texto: this.texto,
      anexos
    };

    this.$store
      .dispatch("mensagem/create", payload)
      .then(res => {
        this.texto = "";
        this.anexos = [];

        this.mensagens.push(res.data);
        this.$emit("commit-recharge");
      })
      .catch(err => {
        this.$notify({
          group: "notifications",
          type: "error",
          title: "Erro ao tentar criar mensagem",
          text: err.response.data.message
        });
      })
      .finally(() => (this.isLoading = false));
  }

  async downloadAttachment(id: string, index: number, sequencia: number) {
    this.loadingAnexoIDMensagem = id;
    this.loadingAnexoSequencia = sequencia;

    const { data } = await this.$store.dispatch(
      "mensagem/getAnexoByIDMensagem",
      { id, sequencia }
    );

    if (!data.arquivo) return;

    const attB64 = await fetch(`data:${data.ext};base64,${data.arquivo}`);

    const buf = await attB64.arrayBuffer();

    const file = new File([buf], `${"download"}.${data.ext}`);

    saveAs(file, `${"download"}.${data.ext}`);

    if (data.data_leitura != null) {
      this.mensagens[index].dados_anexos[
        sequencia - 1
      ].data_leitura = new Date();
    }

    this.loadingAnexoIDMensagem = "";
    this.loadingAnexoSequencia = 0;
  }

  formatDate(date: string, format: string = "LLL") {
    return this.$moment(date).format(format);
  }

  getIcon(data: string | null) {
    if (!data) {
      return "mdi-check";
    }

    return "mdi-check-all";
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

.messages {
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.input-message {
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
  color: #fff;
}

/* Clear floats */
.container-chat::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container-chat #avatar {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container-chat #avatar.right {
  float: right;
  margin-left: 20px;
  margin-right: 0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #fff;
}
</style>