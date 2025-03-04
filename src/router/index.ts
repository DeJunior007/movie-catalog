import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetails from '../views/MovieDetails.vue'
import RandomMovie from '../views/RandomMovie.vue'
import Categories from '../views/Categories.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movie/:id',
      name: 'movie-details',
      component: MovieDetails,
      props: true
    },
    {
      path: '/random',
      name: 'random-movie',
      component: RandomMovie
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/discover/:genreId',
      name: 'discover',
      component: () => import('../views/DiscoverView.vue'),
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router