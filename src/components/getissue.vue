<template>
  <div>
    <div v-if="loader.getIssue"><img src="/static/loading.svg" alt="" /></div>

    <nav class="navbar navbar-dark bg-dark justify-content-center">
      <a class="navbar-brand" href="#"> Projeto Github - Problemas </a>
    </nav>

    
    <div v-if="!loader.getissue && problema.number" class="container card">
      <div class="card-header">
        <h2>{{ problema.title }}</h2>
      </div>
      <div class="card-body">
        <p class="card-text">{{ problema.body }}</p>
        <button
          type="button"
          class="btn btn-primary btn-lg btn-block"
          @click.prevent.stop="$router.go(-1)"
        >
          Voltar
        </button>
      </div>
    </div>
  </div>

  
</template>

<script>
import axios from "axios";

export default {
  nome: "getissue",

  created() {
    this.getIssue();
  },

  data() {
    return {
      problema: {},
      loader: {
        getIssue: false,
      },
    };
  },

  methods: {
    getIssue() {
      this.loader.getIssue = true;
      const url = `https://api.github.com/repos/${this.$route.params.name}/${this.$route.params.repo}/issues/${this.$route.params.problema}`;
      axios
        .get(url)
        .then((response) => {
          this.problema = response.data;
        })
        .finally(() => {
          this.loader.getIssue = false;
        });
    },
  },
};
</script>

<style></style>
