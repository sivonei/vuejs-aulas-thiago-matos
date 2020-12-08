<template>
  <div>
    <!-- Image and text -->
    <nav class="navbar navbar-dark bg-dark justify-content-center">
      <a class="navbar-brand" href="#"> Projeto Github - Problemas </a>
    </nav>

    <div class="container">
      <h1>Projeto Vue.js + Github</h1>
      <p>Página que lista issues(problemas) de uma repositório do Github.</p>

      <div class="row">
        <div class="col">
          <div class="form-group">
            <input
              v-model="username"
              type="text"
              class="form-control"
              placeholder="Github username"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <input
              v-model="repositorio"
              type="text"
              class="form-control"
              placeholder="Github repositório"
            />
          </div>
        </div>

        <div class="col-3">
          <div class="form-group">
            <button @click.prevent.stop="getIssues()" class="btn btn-success">
              Buscar
            </button>
            <button @click.prevent.stop="reset()" class="btn btn-danger">
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div v-if="response.status === 'error'" class="alert alert-danger" role="alert">
        {{ response.message }}
      </div>

      <table class="table table-sm table-bordered">
        <thead>
          <tr>
            <th width="200">Número</th>
            <th>Título</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loader.getIssues">
            <td class="text-center" colspan="2">
              <img src="/static/loader.svg" alt="" />
            </td>
          </tr>

          <tr
            v-if="showissues"
            v-for="problema in problemas"
            :key="problema.number"
          >
            <td>
              <router-link
                :to="{
                  name: 'getissue',
                  params: {
                    name: username,
                    repo: repositorio,
                    problema: problema.number,
                  },
                }"
                ><button type="button" class="btn btn-primary">
                  {{ problema.number }}
                </button>
              </router-link>
            </td>
            <td>{{ problema.title }}</td>
          </tr>

          <tr v-if="noissues">
            <td colspan="2">Nenhum resultado encontrado</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  nome: "githubissues",

  created() {
    this.getLocalData();
  },

  data() {
    return {
      username: "",
      repositorio: "",
      problemas: [],
      response: {
        status: '',
        message: '',
      },
      loader: {
        getIssues: false,
      },
    };
  },
  computed: {
    showissues() {
      return !!this.problemas.length && !this.loader.getIssues;
    },
    noissues() {
      return !!!this.problemas.length && !this.loader.getIssues;
    },
  },

  methods: {
    reset() {
      this.username = "";
      this.repositorio = "";
      localStorage.removeItem('gitHubIssues');
      this.problemas = [];
    },

    resetresaponse() {
      this.response.status = '';
      this.response.message = '';
    },

    getIssues() {
      this.resetresaponse();
      this.problemas = [];
      if (this.username && this.repositorio) {
        localStorage.setItem(
          "gitHubIssues",
          JSON.stringify({
            username: this.username,
            repositorio: this.repositorio,
          })
        );
        this.loader.getIssues = true;
        const url = `https://api.github.com/repos/${this.username}/${this.repositorio}/issues`;
        axios
          .get(url)
          .then((response) => {
            this.problemas = response.data;
          })
          .catch((error) => {
            console.log(error.response.data);
            this.response.status = 'error';
            this.response.message = 'Repositório não existe!';

          }).finally(() => {
            this.loader.getIssues = false;
          });
      }
    },
    getIssue(problema) {
      if (this.username && this.repositorio) {
        this.$set(problema, "is_loading", true);
        const url = `https://api.github.com/repos/${this.username}/${this.repositorio}/issues/${problema.number}`;
        axios
          .get(url)
          .then((response) => {
            this.selectedProblemas = response.data;
          })
          .finally(() => {
            this.$set(problema, "is_loading", false);
          });
      }
    },
    getLocalData() {
      const localData = JSON.parse(localStorage.getItem("gitHubIssues"));
      if (localData && localData.username && localData.repositorio) {
        this.username = localData.username;
        this.repositorio = localData.repositorio;
        this.getIssues();
      }
    },
  },
};
</script>

<style>
</style>