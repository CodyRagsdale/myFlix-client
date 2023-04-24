import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SimilarMovieCard } from '../similar-movie-card/similar-movie-card';

export const ProfileView = ({
  user,
  movies,
  setMovies,
  setUser,
  onLoggedOut,
  updateUserFavorites,
}) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(user.email);
  const [birthdate, setBirthdate] = useState(
    new Date(user.birthday).toISOString().split('T')[0]
  );
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);

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

  useEffect(() => {
    const detectHover = () => {
      const hoverSupported = window.matchMedia('(hover: hover)').matches;
      setHoverEnabled(hoverSupported);
    };

    detectHover();
    window.addEventListener('resize', detectHover);

    return () => {
      window.removeEventListener('resize', detectHover);
    };
  }, []);

  // Allows a user to update their information details
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

  // Allows a user to delete their account
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
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        onLoggedOut();
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
    console.log('Removing movie with ID:', movieId);
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
        const updatedFavorites = favorites.filter(
          (favorite) => favorite._id !== data._id
        );
        setFavorites(updatedFavorites);
        updateUserFavorites(movieId, 'remove'); // Use updateUserFavorites function
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container
      className="profile-container"
      style={{
        backgroundColor: '#9dbeb7',
        padding: '20px',
        width: '150%',
        justifyContent: 'center',
      }}
    >
      <style>
        {`
        .profile-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 25%;
          margin: 0 auto;
        }


        @media screen and (max-width: 768px) {
          .profile-form {
            width: 75%;
          }
        }
      `}
      </style>
      <h1 className="text-center" style={{ textDecoration: 'bold' }}>
        {user.username}'s Profile
      </h1>
      <Form className="profile-form" style={{ width: '25%' }}>
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
        <br />
        <Button
          variant="primary"
          type="submit"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={handleUpdate}
        >
          Update
        </Button>
        <br></br>
        <h4>or</h4>
        <br></br>
        <Button variant="danger" type="button" onClick={handleDelete}>
          Delete Account
        </Button>
      </Form>
      <br />
      <br />
      <br />
      <h2 className="text-center">Favorite Movies</h2>
      <Row
        className="justify-content-center"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {favorites.length > 0 ? (
          favorites
            .filter((movie) => movie !== null)
            .map((movie) => (
              <Col
                key={movie._id}
                xs={3}
                sm={3}
                md={3}
                lg={3}
                className="d-flex justify-content-center mb-4"
                style={{
                  position: 'relative',
                  minHeight: '400px',
                  minWidth: '300px',
                  margin: '5px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minWidth: '150px',
                    maxWidth: '1000px',
                  }}
                  onMouseEnter={() => {
                    if (hoverEnabled) {
                      setShowButton(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoverEnabled) {
                      setShowButton(false);
                    }
                  }}
                >
                  <SimilarMovieCard
                    key={movie._id}
                    movie={movie}
                    user={user}
                    onAddToFavorites={(movieId) =>
                      handleAddToFavorites(movieId)
                    }
                  />
                  <Button
                    variant="danger"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      opacity: hoverEnabled && showButton ? 1 : 0,

                      zIndex: 1,
                    }}
                    onClick={() => handleRemoveFromFavorites(movie._id)}
                  >
                    Remove from Favorites
                  </Button>
                </div>
              </Col>
            ))
        ) : (
          <h3>No favorite movies added yet.</h3>
        )}
      </Row>
    </Container>
  );
};
