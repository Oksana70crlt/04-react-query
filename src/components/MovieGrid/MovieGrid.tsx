import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[]; // очікуємо масив об'єктів
  onSelect: (movie: Movie) => void; // функція, яка викликається при виборі фільму
}

// Базова URL для постерів з TMDB
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
// Запасне зображення, якщо постера немає
const FALLBACK_IMAGE = 'https://via.placeholder.com/500x750?text=No+Image';

// основний компонент MovieGrid  ===================================
function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map(movie => {
        const posterUrl = movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : FALLBACK_IMAGE;

        return (
          // кожен елемент списку повинен мати унікальний ключ (id фільму)
          <li key={movie.id}>
            {/* картка фільму */}
            <div
              className={css.card}
              onClick={() => onSelect(movie)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onSelect(movie);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img
                className={css.image}
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// =================================================================

export default MovieGrid;
