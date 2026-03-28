import axios from 'axios';
import type { Movie } from '../types/movie';

// тип відповіді від TMDB API
interface FetchMoviesResponse {
  results: Movie[];
}

// параметрів для функції fetchMovies
interface FetchMoviesParams {
  query: string;
}

// базова адреса для пошуку фільмів у TMDB (V3 API)
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

// функція для отримання фільмів за запитом
export async function fetchMovies({
  query,
}: FetchMoviesParams): Promise<Movie[]> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  //GET-запит до TMDB API
  const response = await axios.get<FetchMoviesResponse>(BASE_URL, {
    params: {
      query, // передаємо пошуковий запит як параметр
    },
    headers: {
      accept: 'application/json', // очікуємо JSON-відповідь
      Authorization: `Bearer ${token}`, // додаємо токен у заголовок
    },
  });

  return response.data.results; //повертаємо масив фільмів із відповіді
}
