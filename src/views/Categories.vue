<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getGenres } from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();
interface Genre {
  id: number;
  name: string;
}

const genres = ref<Genre[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const fetchGenres = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const response = await getGenres();
    genres.value = response.data.genres;
  } catch (error) {
    errorMessage.value = "Erro ao carregar categorias. Verifique sua chave de API.";
    console.error("Error fetching genres");
  } finally {
    loading.value = false;
  }
};

const navigateToGenre = (genreId: number) => {
  router.push({ name: "discover", params: { genreId } });
};

onMounted(() => {
  fetchGenres();
});

// Gradientes modernos e bonitos
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(135deg, #f761a1 0%, #8c1bab 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #b8cbb8 0%, #b8cbb8 0%, #b465da 100%)",
  "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  "linear-gradient(135deg, #868f96 0%, #596164 100%)",
  "linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)",
];

// Retorna um gradiente com base no índice
const getColor = (index: number) => {
  return gradients[index % gradients.length];
};
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Categorias</h1>

    <v-alert v-if="errorMessage" type="error" class="my-4" closable>
      {{ errorMessage }}
    </v-alert>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-linear>

    <v-row v-else-if="genres.length > 0">
      <v-col
        v-for="(genre, index) in genres"
        :key="genre.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <v-card
          @click="navigateToGenre(genre.id)"
          :style="{ background: getColor(index) }"
          class="genre-card"
          height="120px"
        >
          <v-card-title class="text-white">{{ genre.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else-if="!loading" type="info" class="my-4">
      Nenhuma categoria encontrada.
    </v-alert>
  </div>
</template>

<style scoped>
.genre-card {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px; /* Bordas mais arredondadas */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

.genre-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.genre-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Sombra mais intensa no hover */
}

.genre-card:hover::before {
  opacity: 1;
}

.v-card-title {
  font-size: 1.25rem; /* Tamanho da fonte maior */
  font-weight: 600; /* Fonte mais grossa */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Sombra no texto para melhor legibilidade */
}
</style>
V-