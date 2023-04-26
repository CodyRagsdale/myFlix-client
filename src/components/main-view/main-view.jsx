import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './main-view.scss';

export const MainView = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch('https://dark-blue-lizard-kilt.cyclic.app/movies', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => ({
          _id: movie._id,
          title: movie.title,
          description: movie.description,
          imagePath: movie.imagePath,
          genre: {
            name: movie.genre.name,
            description: movie.genre.description,
          },
          director: {
            name: movie.director.name,
            bio: movie.director.bio,
          },
          releaseYear: movie.releaseYear,
        }));
        setMovies(moviesFromApi);
      });
  }, [token, loggedIn]);

  const updateUserFavorites = (movieId, action) => {
    if (action === 'add') {
      setUser({ ...user, favorites: [...user.favorites, movieId] });
    } else if (action === 'remove') {
      setUser({
        ...user,
        favorites: user.favorites.filter((id) => id !== movieId),
      });
    }
  };

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={onLoggedOut}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Container>
        <div style={{ marginTop: '80px' }}>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  movies.length !== 0 ? (
                    <Row noGutters className="justify-content-center">
                      {filteredMovies.map((movie) => (
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          key={movie._id}
                          className="mb-4 movie-col"
                          style={{
                            marginLeft: '20px',
                            marginRight: '20px',
                            padding: '0px',
                          }}
                        >
                          <MovieCard movie={movie} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Row>
                      <Col>The list is empty!</Col>
                    </Row>
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={12}>
                      <LoginView
                        onLoggedIn={(user) => {
                          setUser(user);
                          setLoggedIn(true);
                        }}
                      />
                    </Col>
                  )}
                </>
              }
            />
            <Route path="/signup" element={<SignupView />} />
            <Route
              path="/movies/:movieId"
              element={
                user ? (
                  <Row className="justify-content-center">
                    <Col md={12} className="mt-3">
                      <MovieView
                        movies={movies}
                        user={user}
                        updateUserFavorites={updateUserFavorites}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/users/:username"
              element={
                user ? (
                  <Row className="justify-content-center">
                    <Col md={12} className="mt-3">
                      <ProfileView
                        user={user}
                        movies={movies}
                        setMovies={setMovies}
                        setUser={setUser}
                        onLoggedOut={onLoggedOut}
                        updateUserFavorites={updateUserFavorites}
                      />
                    </Col>
                  </Row>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Container>
    </BrowserRouter>
  );
};
