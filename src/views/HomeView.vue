<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getPopularMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard.vue";

interface Movie {
  id: number;
  title: string;
}

const movies = ref<Movie[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const totalPages = ref(0);
const errorMessage = ref("");

const fetchMovies = async (page = 1) => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = searchQuery.value
      ? await searchMovies(searchQuery.value, page)
      : await getPopularMovies(page);
    movies.value = response.data.results;
    totalPages.value = response.data.total_pages;
    currentPage.value = response.data.page;
  } catch (error) {
    // Safely handle error without causing data clone issues
    errorMessage.value = "Erro ao carregar filmes. Verifique sua chave de API.";
    // Use a simpler error logging approach
    console.error("Error fetching movies");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchMovies(1);
};

const pageTitle = computed(() => {
  return searchQuery.value ? `Resultados para: ${searchQuery.value}` : "Filmes Populares";
});

onMounted(() => {
  fetchMovies();
});
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">{{ pageTitle }}</h1>

    <v-row>
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Buscar filmes"
          append-inner-icon="mdi-magnify"
          @click:append-inner="handleSearch"
          @keyup.enter="handleSearch"
          hide-details
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-alert v-if="errorMessage" type="error" class="my-4" closable>
      {{ errorMessage }}
    </v-alert>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-linear>

    <v-row v-else-if="movies.length > 0">
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
        class="d-flex"
      >
        <router-link
          :to="{ name: 'movie-details', params: { id: movie.id } }"
          class="text-decoration-none d-flex"
          style="width: 100%"
        >
          <MovieCard :movie="movie" />
        </router-link>
      </v-col>
    </v-row>

    <v-alert v-else-if="!loading" type="info" class="my-4">
      Nenhum filme encontrado.
    </v-alert>

    <div class="d-flex justify-center mt-6">
      <v-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :length="Math.min(totalPages, 10)"
        @update:model-value="fetchMovies"
        rounded
      ></v-pagination>
    </div>
  </div>
</template>
