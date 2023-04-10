import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';

export const ProfileView = ({ user, movies, setMovies, setUser }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(user.email);
  const [birthdate, setBirthdate] = useState(
    new Date(user.birthday).toISOString().split('T')[0]
  );
  const [favorites, setFavorites] = useState([]);

  const fetchFavoriteMovies = () => {
    if (!user || !user.favorites || user.favorites.length === 0) {
      setFavorites([]);
      return;
    }

    const favoriteMoviesList = movies.filter((movie) =>
      user.favorites.includes(movie._id)
    );

    setFavorites(favoriteMoviesList);
  };

  useEffect(() => {
    fetchFavoriteMovies();
  }, [user, movies]);

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        birthday: birthdate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Profile updated successfully!');
        setUser(data);
      })
      .catch((e) => console.log(e));
  };

  const handleDelete = () => {
    const confirmDeletion = window.confirm(
      'Are you sure you want to delete your account?'
    );

    if (!confirmDeletion) {
      return;
    }

    fetch(`https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })
      .catch((e) => console.log(e));
  };

  const handleAddToFavorites = (movieId) => {
    fetch(
      `https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}/movies/${movieId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        alert('Added to favorites!');
        setFavorites([...favorites, data.movie]);
        setUser({ ...user, favorites: [...user.favorites, movieId] });
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveFromFavorites = (movieId) => {
    fetch(
      `https://dark-blue-lizard-kilt.cyclic.app/users/${user.username}/movies/${movieId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        alert('Removed from favorites!');
        const updatedFavorites = favorites.filter(
          (favorite) => favorite._id !== data._id
        );
        setFavorites(updatedFavorites);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container className="profile-container">
      <h1 className="text-center">My Profile</h1>
      <Form className="profile-form">
        <br></br>
        <h2 className="text-center">Need to update your information?</h2>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBirthdate">
          <Form.Label>Birthdate:</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="danger" type="button" onClick={handleDelete}>
          Delete Account
        </Button>
      </Form>
      <br />

      <h2 className="text-center">Favorite Movies</h2>
      <ListGroup>
        {favorites.length > 0 ? (
          favorites
            .filter((movie) => movie !== null)
            .map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                user={user}
                onAddToFavorites={(movieId) => handleAddToFavorites(movieId)}
              />
            ))
        ) : (
          <h3>No favorite movies added yet.</h3>
        )}
      </ListGroup>
    </Container>
  );
};
