import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import styles from './App.module.css';

// основний компонент App  ===================================
function App() {
  // стани
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  //useEffect для виклику API при зміні query
  useEffect(() => {
    if (query === '') {
      return; // якщо запит порожній — нічого не робимо
    }

    //функція для отримання фільмів
    async function getMovies() {
      try {
        setIsError(false); // перед новим запитом скидаємо помилку
        setIsLoading(true);

        const data = await fetchMovies({ query }); // виклик API

        if (data.length === 0) {
          setMovies([]);
          toast.error('No movies found for your request.');
          return;
        }

        // якщо є дані — зберігаємо їх у стан
        setMovies(data);
      } catch {
        setIsError(true);
        setMovies([]);
      } finally {
        setIsLoading(false); // у будь-якому випадку вимикаємо індикатор
      }
    }

    getMovies();
  }, [query]);

  // обробник пошуку: очищаємо попередні дані і встановлюємо новий запит
  const handleSearch = (newQuery: string) => {
    setMovies([]);
    setIsError(false);
    setSelectedMovie(null); // закриваємо модалку при новому пошуку
    setQuery(newQuery);
  };

  // обробник вибору фільму: відкриває модалку
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // обробник закриття модалки
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // рендеринг компонента
  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {/* умови рендерингу */}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && ( //якщо selectedMovie вже не null, то спрацює  цей умовний рендер
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

// ==========================================================

export default App;
