import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Card, Row, Container } from 'react-bootstrap';
import { SimilarMovieCard } from '../similar-movie-card/similar-movie-card';
import './movie-view.scss';

export const MovieView = ({ movies, user, setUser, updateUserFavorites }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(
    user && user.favorites.includes(movieId)
  );

  const handleAddToFavorites = () => {
    fetch(
      `https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}/movies/${movieId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        updateUserFavorites(movieId, 'add');
        setIsFavorite(true);
      })
      .catch((e) => console.log(e));
  };

  const handleRemoveFromFavorites = () => {
    fetch(
      `https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}/movies/${movieId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        updateUserFavorites(movieId, 'remove');
        setIsFavorite(false);
      })
      .catch((e) => console.log(e));
  };

  const handleSimilarMovieClick = (movie) => {
    navigate(`/movies/${movie._id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const selectedMovie = movies.find((movie) => movie._id === movieId);
    setMovie(selectedMovie);
  }, [movieId, movies]);

  useEffect(() => {
    if (movie) {
      const similarMovies = movies.filter(
        (m) => m.genre.name === movie.genre.name && m._id !== movie._id
      );
      setSimilarMovies(similarMovies);
    }
  }, [movie, movies]);

  useEffect(() => {
    if (user && movie) {
      setIsFavorite(user.favorites.includes(movie._id));
    }
  }, [user, movie]);

  if (!movie) return null;

  return (
    <Container className="movie-view text-center">
      <Row className="movie-content">
        <Col className="movie-img-col" xs={12} lg={8}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={movie.imagePath}
              alt={movie.title}
              style={{
                height: '100%',
                objectFit: 'cover',
                maxWidth: '100%',
              }}
            />
          </Card>
        </Col>
        <Col className="movie-details-col" xs={12} lg={4}>
          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <br></br>
            <div className="movie-info">
              <p className="movie-label">Release Year: </p>
              <span className="movie-value">{movie.releaseYear}</span>
            </div>
            <br></br>
            <div className="movie-info">
              <p className="movie-label">Description: </p>
              <span className="movie-value">{movie.description}</span>
            </div>
            <br></br>
            <div className="movie-info">
              <p className="movie-label">Genre: </p>
              <span className="movie-value">{movie.genre.name}</span>
            </div>
            <br></br>
            <div className="movie-info">
              <p className="movie-label">Director: </p>
              <span className="movie-value">{movie.director.name}</span>
            </div>
            <br></br>
            {user ? (
              <Button
                className="favorite-button"
                variant={isFavorite ? 'danger' : 'primary'}
                onClick={
                  isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
                }
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            ) : null}
            <div className="d-flex justify-content-center">
              <Link to="/">
                <Button className="back-button" variant="primary">
                  Go Back
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      {similarMovies.length > 0 && (
        <div className="similar-movies">
          <h4 className="text-center mt-4">Movies similar to {movie.title}</h4>
          <br />
          <Row className="justify-content-center">
            {similarMovies.map((movie) => (
              <Col
                key={movie._id}
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={3}
                className="mb-4 similar-movie-card"
              >
                <SimilarMovieCard
                  movie={movie}
                  onClick={() => handleSimilarMovieClick(movie)}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};
