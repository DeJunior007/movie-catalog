<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const drawer = ref(false);

// Initialize theme based on stored preference
onMounted(() => {
  theme.global.name.value = isDarkMode.value ? 'dark' : 'light';
});

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  theme.global.name.value = isDarkMode.value ? 'dark' : 'light';
  localStorage.setItem('darkMode', isDarkMode.value.toString());
};

// Watch for theme changes
watch(isDarkMode, (newVal) => {
  document.body.classList.toggle('dark-theme', newVal);
});
</script>

<template>
  <v-app>
    <v-app-bar
      :color="isDarkMode ? 'grey-darken-3' : 'surface'"
      elevation="2"
      class="navbar-modern"
    >
      <v-container class="d-flex align-center px-2">
        <!-- Logo and App Name -->
        <router-link to="/" class="text-decoration-none d-flex align-center">
          <v-icon
            icon="mdi-movie-open"
            size="large"
            :color="isDarkMode ? 'primary' : 'primary'"
            class="mr-2 app-icon"
          ></v-icon>
          <span class="app-title text-h5" :class="isDarkMode ? 'text-white' : 'text-primary'">
            CineVerse
          </span>
        </router-link>

        <v-spacer></v-spacer>

        <!-- Navigation links for desktop -->
        <div class="navigation-links d-none d-md-flex">
          <v-btn
            variant="text"
            :ripple="false"
            class="mx-1 nav-btn"
            to="/"
            :class="isDarkMode ? 'text-white' : 'text-primary'"
          >
            <v-icon class="mr-1">mdi-fire</v-icon>
            Populares
          </v-btn>
          <v-btn
            variant="text"
            :ripple="false"
            class="mx-1 nav-btn"
            to="/random"
            :class="isDarkMode ? 'text-white' : 'text-primary'"
          >
            <v-icon class="mr-1">mdi-shuffle-variant</v-icon>
            Descubrir
          </v-btn>
          <v-btn
            variant="text"
            :ripple="false"
            class="mx-1 nav-btn"
            to="/categories"
            :class="isDarkMode ? 'text-white' : 'text-primary'"
          >
            <v-icon class="mr-1">mdi-shape</v-icon>
            Categorias
          </v-btn>
        </div>

        <!-- Theme toggle button -->
        <v-btn
          :icon="isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
          variant="text"
          :color="isDarkMode ? 'white' : 'primary'"
          class="ml-2 btn-hover"
          size="small"
        ></v-btn>

        <!-- Mobile menu button -->
        <v-app-bar-nav-icon
          class="d-flex d-md-none ml-2"
          :color="isDarkMode ? 'white' : 'primary'"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <!-- Mobile drawer -->
    <v-navigation-drawer v-model="drawer" temporary :color="isDarkMode ? 'grey-darken-4' : 'white'">
      <v-list>
        <v-list-item class="mb-4 mt-2">
          <v-list-item-title class="text-h6 d-flex align-center">
            <v-icon icon="mdi-movie-open" class="mr-2" color="primary"></v-icon>
            CineVerse
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-fire"
          title="Popular Movies"
          to="/"
          rounded="lg"
          class="mb-1"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-shuffle-variant"
          title="Discover Random"
          to="/random"
          rounded="lg"
          class="mb-1"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-shape"
          title="Categories"
          to="/categories"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

   <v-footer app :color="isDarkMode ? 'grey-darken-3' : 'surface'" class="text-center d-flex justify-center py-4">
      <a     href="https://www.linkedin.com/in/deilton-pedro" 
      target="_blank"  class="text-body-2 cursor-pointer" :class="isDarkMode ? 'text-medium-emphasis' : 'text-secondary'">
        &copy; {{ new Date().getFullYear() }} - CineVerse | &copy; DeJunior007
      </a>
    </v-footer>
  </v-app>
</template>

<style scoped>
/* Modern app styling */
.navbar-modern {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  backdrop-filter: blur(10px);
}

.app-title {
  font-weight: 700;
  letter-spacing: -0.5px;
}

.app-icon {
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Navigation buttons */
.nav-btn {
  position: relative;
  transition: all 0.3s ease;
  font-weight: 500;
  border-radius: 8px;
}

.nav-btn::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-btn:hover::after {
  width: 70%;
}

/* Button hover effects */
.btn-hover {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-hover:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
