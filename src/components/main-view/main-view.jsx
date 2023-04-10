import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export const MainView = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);

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
            description: movie.director.description,
          },
        }));
        setMovies(moviesFromApi);
      });
  }, [token]);

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
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      />
      <Container>
        <div style={{ marginTop: '80px' }}>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  movies.length !== 0 ? (
                    <Row>
                      {movies.map((movie) => (
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          key={movie._id}
                          className="mb-4 movie-col"
                          style={{
                            marginLeft: '20px',
                            marginRight: '20px',
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
                    <Col md={5}>
                      <LoginView onLoggedIn={(user) => setUser(user)} />
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
                  <Row>
                    <Col md={8} className="mt-3">
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
                  <Row>
                    <Col md={8} className="mt-3">
                      <ProfileView
                        user={user}
                        movies={movies}
                        setMovies={setMovies}
                        setUser={setUser}
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
