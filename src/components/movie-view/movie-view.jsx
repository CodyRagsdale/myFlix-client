import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

export const MovieView = ({ movies, user, updateUserFavorites }) => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const movie = movies.find((movie) => movie._id === movieId);
    setMovie(movie);

    if (user && user.favorites.includes(movieId)) {
      setIsFavorite(true);
    }
  }, [movies, movieId, user]);

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

  if (!movie) return null;

  return (
    <Card className="movie-view">
      <Card.Img variant="top" src={movie.imagePath} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text>Genre: {movie.genre.name}</Card.Text>
        <Card.Text>Director: {movie.director.name}</Card.Text>
        <Button
          variant={isFavorite ? 'danger' : 'primary'}
          onClick={
            isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
          }
        >
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </Button>
      </Card.Body>
    </Card>
  );
};
