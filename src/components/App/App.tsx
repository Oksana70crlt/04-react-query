import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import styles from './App.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// основний компонент App  ===================================
function App() {
  // стани
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1); // для пагінації
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // використання useQuery для отримання фільмів
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ['movies', query, page], // ключ запиту з залежностями
    queryFn: () => fetchMovies({ query, page }), // функція для отримання даних
    enabled: query !== '', // запит виконується лише якщо query не порожній
    placeholderData: keepPreviousData,
  });

  //useEffect для виклику API при зміні query
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  // обробник пошуку: очищаємо попередні дані і встановлюємо новий запит
  const handleSearch = (newQuery: string) => {
    setSelectedMovie(null); // закриваємо модалку при новому пошуку
    setPage(1); // скидаємо сторінку на 1 при новому пошуку
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

  // масив фільмів із data або порожній масив
  const movies = data?.results ?? [];

  const totalPages = data?.total_pages ?? 0; // загальна кількість сторінок із відповіді

  // рендеринг компонента
  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {/* умови рендерингу */}
      {isLoading && !isPlaceholderData && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

// ==========================================================

export default App;
