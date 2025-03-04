<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getRandomMovie, getMovieDetails, getMovieCredits } from "../services/api";

interface Movie {
  id: number;
  title: string;
  tagline: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
}

interface Credit {
  id: number;
  name: string;
  job: string;
  profile_path: string;
  character: string;
}

interface CreditsResponse {
  cast: Credit[];
  crew: Credit[];
}

const router = useRouter();
const loading = ref(true);
const errorMessage = ref("");
const movie = ref<Movie | null>(null);
const credits = ref<CreditsResponse | null>(null);

const fetchRandomMovie = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    // Get a random movie
    const randomMovie = await getRandomMovie();

    // Fetch details for the random movie
    const [movieResponse, creditsResponse] = await Promise.all([
      getMovieDetails(randomMovie.id.toString()),
      getMovieCredits(randomMovie.id.toString()),
    ]);

    movie.value = movieResponse.data;
    credits.value = creditsResponse.data;
  } catch (error) {
    errorMessage.value = "Erro ao carregar filme aleatório. Tente novamente.";
    console.error("Error fetching random movie:", error);
  } finally {
    loading.value = false;
  }
};

const getAnotherRandom = () => {
  fetchRandomMovie();
};

const viewMovieDetails = () => {
  if (movie.value) {
    router.push({ name: "movie-details", params: { id: movie.value.id } });
  }
};

onMounted(() => {
  fetchRandomMovie();
});
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Filme Aleatório</h1>

    <v-alert v-if="errorMessage" type="error" class="my-4" closable>
      {{ errorMessage }}
    </v-alert>

    <div v-if="loading" class="d-flex flex-column align-center my-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-4 pulse-animation"
      ></v-progress-circular>
      <p class="text-body-1">Encontrando um filme aleatório para você...</p>
    </div>

    <div v-else-if="movie" class="random-movie-container">
      <v-card class="random-movie-card">
        <v-row>
          <v-col cols="12" md="5" lg="4">
            <v-img
              :src="
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/no-poster.jpg'
              "
              :aspect-ratio="2 / 3"
              class="rounded-lg"
              cover
            ></v-img>
          </v-col>

          <v-col cols="12" md="7" lg="8">
            <v-card-title class="text-h4">{{ movie.title }}</v-card-title>
            <v-card-subtitle v-if="movie.tagline" class="text-subtitle-1 mb-4">{{
              movie.tagline
            }}</v-card-subtitle>

            <v-chip-group class="mb-4">
              <v-chip
                v-for="genre in movie.genres"
                :key="genre.id"
                color="primary"
                variant="outlined"
                size="small"
              >
                {{ genre.name }}
              </v-chip>
            </v-chip-group>

            <v-card-text>
              <p class="text-body-1 mb-4">
                {{ movie.overview || "Sinopse não disponível." }}
              </p>

              <div class="d-flex align-center mb-4">
                <v-rating
                  :model-value="movie.vote_average / 2"
                  color="amber"
                  half-increments
                  readonly
                  size="small"
                ></v-rating>
                <span class="ml-2">{{ movie.vote_average.toFixed(1) }}/10</span>
                <v-divider vertical class="mx-3"></v-divider>
                <span>{{ new Date(movie.release_date).getFullYear() }}</span>
              </div>

              <div class="flex flex-wrap gap-x-4 mt-6">
                <v-btn
                  class="mx-2 py-2 px-4"
                  color="primary"
                  @click="viewMovieDetails"
                  prepend-icon="mdi-information-outline"
                >
                  Ver detalhes
                </v-btn>
                <v-btn
                  class="mx-2 py-2 px-4"
                  color="secondary"
                  @click="getAnotherRandom"
                  prepend-icon="mdi-refresh"
                >
                  Outro aleatório
                </v-btn>
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-alert
      v-else-if="!loading && !errorMessage"
      type="error"
      title="Erro"
      text="Não foi possível carregar um filme aleatório."
      class="mt-4"
    ></v-alert>
  </div>
</template>

<style scoped>
.random-movie-container {
  animation: fadeIn 0.5s ease-in-out;
}

.random-movie-card {
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
}

.random-movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
