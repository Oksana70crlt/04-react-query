import css from './Loader.module.css';

// основний компонент Loader  ===================================
function Loader() {
  return <p className={css.text}>Loading movies, please wait...</p>;
}

// ===========================================================
export default Loader;
