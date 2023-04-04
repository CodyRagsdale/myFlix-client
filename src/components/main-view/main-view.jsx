import { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { Container, Row, Col } from 'react-bootstrap';

export const MainView = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch('https://dark-blue-lizard-kilt.cyclic.app/movies', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [token]);

  const onMovieClick = (movie) => {
    console.log('onMovieClick called with movie:', movie);
    setSelectedMovie(movie);
  };

  let style = {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  };

  return (
    <Container>
      {!user ? (
        <Row
          className="justify-content-space-between align-items-center"
          style={style}
        >
          <Col md={6}>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
              }}
            />
            <div className="text-center mt-2">or</div>
            <SignupView />
          </Col>
        </Row>
      ) : selectedMovie ? (
        <Row>
          <Col md={8} className="mt-3">
            <MovieView
              movie={selectedMovie}
              onBackClick={() => setSelectedMovie(null)}
            />
          </Col>
        </Row>
      ) : (
        <Row>
          {movies.map((movie) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              key={movie._id}
              className="mb-4 movie-col"
              style={{ marginLeft: '20px', marginRight: '20px' }}
            >
              <MovieCard movie={movie} onMovieClick={onMovieClick} />
            </Col>
          ))}
          <Col md={12} className="text-center">
            <button
              className="btn btn-danger"
              onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
              }}
            >
              Logout
            </button>
          </Col>
        </Row>
      )}
    </Container>
  );
};
