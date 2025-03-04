<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getMovieDetails, getMovieCredits, getImageUrl } from "../services/api";

interface Movie {
  title: string;
  tagline: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  overview: string;
  status: string;
  budget: number;
  revenue: number;
  original_language: string;
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

const route = useRoute();
const movie = ref<Movie | null>(null);
const credits = ref<CreditsResponse | null>(null);
const loading = ref(true);
const errorMessage = ref("");

const fetchMovieData = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const movieId = route.params.id as string;
    const [movieResponse, creditsResponse] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
    ]);
    movie.value = movieResponse.data;
    credits.value = creditsResponse.data;
  } catch (error) {
    errorMessage.value =
      "Erro ao carregar detalhes do filme. Verifique sua chave de API.";
    console.error("Error fetching movie details:", error);
  } finally {
    loading.value = false;
  }
};

const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

onMounted(() => {
  fetchMovieData();
});
</script>

<template>
  <div>
    <v-btn prepend-icon="mdi-arrow-left" variant="text" to="/" class="mb-4">
      Voltar
    </v-btn>

    <v-alert v-if="errorMessage" type="error" class="my-4" closable>
      {{ errorMessage }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
      class="d-flex mx-auto my-12 pulse-animation"
    ></v-progress-circular>

    <div v-else-if="movie" class="movie-details-container">
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            :src="
              movie.poster_path
                ? getImageUrl(movie.poster_path, 'w500')
                : '/no-poster.jpg'
            "
            :aspect-ratio="2 / 3"
            class="rounded-lg movie-poster"
            cover
          ></v-img>

          <div class="mt-4">
            <v-chip-group class="mb-4">
              <v-chip
                v-for="genre in movie.genres"
                :key="genre.id"
                color="primary"
                variant="outlined"
                size="small"
                :to="`/discover/${genre.id}`"
                class="ma-1"
              >
                {{ genre.name }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h3 mb-2 movie-title">{{ movie.title }}</h1>
          <h2 class="text-subtitle-1 text-grey mb-4" v-if="movie.tagline">
            {{ movie.tagline }}
          </h2>

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
            <v-divider vertical class="mx-3" v-if="movie.runtime"></v-divider>
            <span v-if="movie.runtime">{{ formatRuntime(movie.runtime) }}</span>
          </div>

          <h3 class="text-h6 mb-2">Sinopse</h3>
          <p class="text-body-1 mb-4 movie-overview">
            {{ movie.overview || "Sinopse não disponível." }}
          </p>

          <v-row class="mb-4">
            <v-col cols="12" sm="6">
              <h3 class="text-h6 mb-2">Informações</h3>
              <v-list density="compact" bg-color="transparent">
                <v-list-item v-if="movie.status">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-information-outline" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>{{ movie.status }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="movie.budget">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cash" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title>Orçamento</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatCurrency(movie.budget)
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="movie.revenue">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cash-multiple" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title>Receita</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatCurrency(movie.revenue)
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="movie.original_language">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-translate" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title>Idioma Original</v-list-item-title>
                  <v-list-item-subtitle>{{
                    movie.original_language.toUpperCase()
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" sm="6" v-if="credits && credits.crew">
              <h3 class="text-h6 mb-2">Equipe</h3>
              <v-list density="compact" bg-color="transparent">
                <v-list-item v-for="person in credits.crew.slice(0, 5)" :key="person.id">
                  <v-list-item-title>{{ person.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ person.job }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <h3
            class="text-h6 mb-2"
            v-if="credits && credits.cast && credits.cast.length > 0"
          >
            Elenco Principal
          </h3>
          <v-row v-if="credits && credits.cast">
            <v-col
              v-for="actor in credits.cast.slice(0, 6)"
              :key="actor.id"
              cols="6"
              sm="4"
              md="4"
              lg="2"
            >
              <v-card class="actor-card">
                <v-img
                  :src="
                    actor.profile_path
                      ? getImageUrl(actor.profile_path, 'w185')
                      : '/no-profile.jpg'
                  "
                  height="150"
                  cover
                ></v-img>
                <v-card-text class="pa-2">
                  <div class="text-subtitle-2 font-weight-bold">{{ actor.name }}</div>
                  <div class="text-caption">{{ actor.character }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <v-alert
      v-else-if="!loading && !errorMessage"
      type="error"
      title="Erro"
      text="Não foi possível carregar os detalhes do filme."
      class="mt-4"
    ></v-alert>
  </div>
</template>

<style scoped>
.movie-details-container {
  animation: fadeIn 0.5s ease-in-out;
}

.movie-poster {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.02);
}

.movie-title {
  position: relative;
  display: inline-block;
}

.movie-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--v-primary-base);
}

.movie-overview {
  line-height: 1.6;
}

.actor-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.actor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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
