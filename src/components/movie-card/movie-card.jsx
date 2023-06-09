import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './movie-card.scss';

export const MovieCard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${encodeURIComponent(movie._id)}`);
  };

  return (
    <Card className="movie-card p-0" onClick={handleClick}>
      <Card.Img
        variant="top"
        src={movie.imagePath}
        style={{
          height: '100%',
          objectFit: 'cover',
          maxWidth: '100%',
        }}
      />
      <Card.Body>
        <h2>
          <Card.Title>{movie.title}</Card.Title>
        </h2>
        <p>({movie.releaseYear})</p>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
