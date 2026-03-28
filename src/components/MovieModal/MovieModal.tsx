import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; //базова адреса для бекдроп-зображень TMDB
const FALLBACK_IMAGE = 'https://via.placeholder.com/1280x720?text=No+Image';

// основний компонент MovieModal ============================================
function MovieModal({ movie, onClose }: MovieModalProps) {
  //формування imageUrl
  const imageUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : FALLBACK_IMAGE;

  //використовуємо useEffect для обробки Escape та блокування скролу сторінки
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape); //додаємо слухач клавіатури
    document.body.style.overflow = 'hidden'; //блокування скролу

    return () => {
      //при розмонтуванні компонента - прибираємо слухач і повертаємо скроллрт
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  //обробник кліку по бекдропу
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  //рендер модалки напряму в document.body
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <img className={css.image} src={imageUrl} alt={movie.title} />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || 'No description available.'}</p>
          <p>
            <strong>Release Date:</strong>{' '}
            {movie.release_date || 'No information'}
          </p>
          <p>
            <strong>Rating:</strong>{' '}
            {movie.vote_average > 0
              ? `${movie.vote_average.toFixed(1)}/10`
              : 'No rating'}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

//==========================================================================

export default MovieModal;
