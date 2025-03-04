import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
  params: {
    api_key: import.meta.env.VITE_API_KEY,
    language: "pt-BR",
    include_adult: false, 
  },
});

export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', {
    params: { page }
  })
}

export const searchMovies = (query: string, page = 1) => {
  return api.get('/search/movie', {
    params: { query, page }
  })
}

export const getMovieDetails = (movieId: string) => {
  return api.get(`/movie/${movieId}`)
}

export const getMovieCredits = (movieId: string) => {
  return api.get(`/movie/${movieId}/credits`)
}

export const getImageUrl = (path: string, size = 'w500') => {
  if (!path) return '/no-poster.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getRandomMovie = async () => {
  // Get a random page between 1 and 500 (TMDb API limit)
  const randomPage = Math.floor(Math.random() * 500) + 1
  
  try {
    const response = await getPopularMovies(randomPage)
    const movies = response.data.results
    
    // Get a random movie from the results
    const randomIndex = Math.floor(Math.random() * movies.length)
    return movies[randomIndex]
  } catch (error) {
    console.error('Error fetching random movie')
    throw error
  }
}

export const getGenres = () => {
  return api.get('/genre/movie/list')
}

export const discoverMoviesByGenre = (genreId: string, page = 1) => {
  return api.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page
    }
  })
}
