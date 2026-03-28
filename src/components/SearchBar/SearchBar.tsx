import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

// Оголошуємо інтерфейс пропсів для компонента
interface SearchBarProps {
  onSubmit: (query: string) => void;
}

// основний компонент SearchBar ============================================
function SearchBar({ onSubmit }: SearchBarProps) {
  // Функція-обробник сабміту форми
  const handleSubmit = (formData: FormData) => {
    const query = formData.get('query'); // отримання значення поля з ім'ям "query"

    if (typeof query !== 'string' || query.trim() === '') {
      // здійснюємо перевірку
      toast.error('Please enter your search query.');
      return;
    }

    onSubmit(query.trim()); // якщо рядок валідний, передаємо його наверх у App
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={styles.form} action={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query" // ім'я поля, щоб потім отримати його з FormData
            autoComplete="off" // вимикаємо автозаповнення
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

// ========================================================================

export default SearchBar;
