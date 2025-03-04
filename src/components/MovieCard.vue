<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { getImageUrl } from '../services/api'

const props = defineProps<{
  movie: any
}>()

const { movie } = toRefs(props)

const releaseYear = computed(() => {
  return movie.value?.release_date ? new Date(movie.value.release_date).getFullYear() : 'N/A'
})

const rating = computed(() => {
  return movie.value?.vote_average ? movie.value.vote_average.toFixed(1) : 'N/A'
})
</script>

<template>
  <v-card class="movie-card" height="100%" width="100%" >
    <div class="card-image-container">
      <v-img
        :src="movie?.poster_path ? getImageUrl(movie.poster_path) : '/no-poster.jpg'"
        :aspect-ratio="2/3"
        cover
        class="align-end"
      >
        <div class="card-overlay">
          <v-card-title class="text-white text-subtitle-1">
            {{ movie?.title || 'Título desconhecido' }}
          </v-card-title>
          <v-card-text class="text-white pt-0">
            <div class="d-flex align-center">
              <v-rating
                :model-value="movie?.vote_average ? movie.vote_average / 2 : 0"
                color="amber"
                density="compact"
                half-increments
                readonly
                size="small"
              ></v-rating>
              <span class="ml-2 text-caption">{{ rating }}/10</span>
            </div>
            <div class="text-caption">
              {{ releaseYear }}
            </div>
            <p class="text-caption mt-2 movie-overview">
              {{ movie?.overview ? movie.overview.substring(0, 100) + '...' : 'Sem descrição disponível.' }}
            </p>
            <v-btn
              variant="outlined"
              color="white"
              size="small"
              class="mt-2"
              :to="movie?.id ? `/movie/${movie.id}` : '#'"
            >
              Ver detalhes
            </v-btn>
          </v-card-text>
        </div>
      </v-img>
    </div>
  </v-card>
</template>

<style scoped>
.card-image-container {
  position: relative;
  height: 100%;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%);
  padding: 16px;
  transform: translateY(70%);
  transition: transform 0.3s ease;
}

.movie-card:hover .card-overlay {
  transform: translateY(0);
}

.movie-overview {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.movie-card:hover .movie-overview {
  opacity: 1;
  max-height: 100px;
}
</style>
