import MovieCard from './MovieCard.jsx';

/** Lista de resultados em grade responsiva. */
export default function MovieGrid({ movies, onSelect }) {
  return (
    <ul className="grid">
      {movies.map((movie) => (
        <li key={movie.imdbID}>
          <MovieCard movie={movie} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}