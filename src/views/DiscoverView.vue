<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { discoverMoviesByGenre, getGenres } from '../services/api'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'

const route = useRoute()
const movies = ref([])
const genres = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const errorMessage = ref('')

const genreId = computed(() => route.params.genreId as string)
const genreName = computed(() => {
  const genre = genres.value.find(g => g.id.toString() === genreId.value)
  return genre ? genre.name : 'Categoria'
})

const fetchGenres = async () => {
  try {
    const response = await getGenres()
    genres.value = response.data.genres
  } catch (error) {
    console.error('Error fetching genres')
  }
}

const fetchMoviesByGenre = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await discoverMoviesByGenre(genreId.value, page)
    movies.value = response.data.results
    totalPages.value = response.data.total_pages
    currentPage.value = response.data.page
  } catch (error) {
    errorMessage.value = 'Erro ao carregar filmes. Verifique sua chave de API.'
    console.error('Error fetching movies by genre')
  } finally {
    loading.value = false
  }
}

watch(() => route.params.genreId, () => {
  currentPage.value = 1
  fetchMoviesByGenre(1)
})

onMounted(() => {
  fetchGenres()
  fetchMoviesByGenre()
})
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Filmes: {{ genreName }}</h1>
    
    <v-alert
      v-if="errorMessage"
      type="error"
      class="my-4"
      closable
    >
      {{ errorMessage }}
    </v-alert>
    
    <v-progress-linear v-if="loading" indeterminate color="primary" class="my-4"></v-progress-linear>
    
    <v-row v-else-if="movies.length > 0">
      <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3" class="d-flex">
        <router-link 
          :to="{ name: 'movie-details', params: { id: movie.id } }" 
          class="text-decoration-none d-flex"
          style="width: 100%;"
        >
          <MovieCard :movie="movie" />
        </router-link>
      </v-col>
    </v-row>
    
    <v-alert
      v-else-if="!loading"
      type="info"
      class="my-4"
    >
      Nenhum filme encontrado nesta categoria.
    </v-alert>
    
    <div class="d-flex justify-center mt-6">
      <v-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        :length="Math.min(totalPages, 10)"
        @update:model-value="fetchMoviesByGenre"
        rounded
      ></v-pagination>
    </div>
  </div>
</template>