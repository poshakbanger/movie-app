import React, { useState, useEffect } from 'react';
import "./App.css";
const MovieDatabase = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://dummyapi.online/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
      setFilteredMovies(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching movies. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = movies.filter(movie => 
      movie.movie.toLowerCase().includes(query)
    );
    
    setFilteredMovies(filtered);
  };

  const handleSort = (e) => {
    const sortType = e.target.value;
    setSortBy(sortType);
    
    let sorted = [...filteredMovies];
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.movie.localeCompare(b.movie));
        break;
      default:
        break;
    }
    setFilteredMovies(sorted);
  };

  const MovieCard = ({ movie }) => (
    <div className="movie-card">
      <div className="movie-image">
        <img 
          src={movie.image || "/api/placeholder/300/400"} 
          alt={movie.movie}
          onError={(e) => e.target.src = "/api/placeholder/300/400"}
        />
      </div>
      <div className="movie-content">
        <h2>{movie.movie}</h2>
        <div className="movie-info">
          <p className="rating">⭐ {movie.rating}/10</p>
          <div className="movie-actions">
            <button 
              className="details-button"
              onClick={() => setSelectedMovie(movie)}
            >
              View Details
            </button>
            <a 
              href={movie.imdb_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="imdb-button"
              onClick={(e) => e.stopPropagation()}
            >
              IMDb
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const MovieDetails = ({ movie }) => (
    <div className="movie-details">
      <button 
        className="back-button"
        onClick={() => setSelectedMovie(null)}
      >
        ← Back to Movies
      </button>
      <div className="details-grid">
        <div className="details-image">
          <img 
            src={movie.image || "/api/placeholder/400/600"} 
            alt={movie.movie}
            onError={(e) => e.target.src = "/api/placeholder/400/600"}
          />
        </div>
        <div className="details-content">
          <h1>{movie.movie}</h1>
          <div className="details-info">
            <p className="rating-large">⭐ {movie.rating}/10</p>
            <a 
              href={movie.imdb_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="imdb-link"
            >
              View on IMDb
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="movie-database">
      <h1>Movie Database</h1>
      
      {!selectedMovie && (
        <div className="controls">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search movies..."
            className="search-input"
          />
          <select 
            value={sortBy} 
            onChange={handleSort}
            className="sort-select"
          >
            <option value="none">Sort by...</option>
            <option value="rating">Rating</option>
            <option value="name">Movie Name</option>
          </select>
          
          {filteredMovies.length === 0 && (
            <p className="no-results">No movies found matching your search.</p>
          )}
        </div>
      )}

      {selectedMovie ? (
        <MovieDetails movie={selectedMovie} />
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieDatabase;