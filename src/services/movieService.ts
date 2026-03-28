import axios from 'axios';
import type { Movie } from '../types/movie';

// опис відповіді від TMDB API для пошуку фільмів
interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

// опис параметрів для функції fetchMovies
interface FetchMoviesParams {
  query: string;
  page?: number;
}

// базова адреса для пошуку фільмів у TMDB (V3 API)
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

// функція для отримання фільмів за запитом
export async function fetchMovies({
  query,
  page = 1, // за замовчуванням запитуємо першу сторінку результатів
}: FetchMoviesParams): Promise<FetchMoviesResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  // GET-запит до TMDB API
  const response = await axios.get<FetchMoviesResponse>(BASE_URL, {
    params: {
      query, // передаємо пошуковий запит як параметр
      page, // передаємо номер сторінки як параметр
    },
    headers: {
      accept: 'application/json', // очікуємо JSON-відповідь
      Authorization: `Bearer ${token}`, // додаємо токен у заголовок
    },
  });

  return response.data; // повертаємо дані з відповіді
}
