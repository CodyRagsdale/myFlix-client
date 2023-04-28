import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './login-view.scss';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username,
      password,
    };

    fetch('https://dark-blue-lizard-kilt.cyclic.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        onLoggedIn(data.user);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ paddingTop: '45px', display: 'flex', flexDirection: 'column' }}
    >
      <Form.Group controlId="formUsername">
        <Form.Label style={{ fontWeight: 'bold', padding: '3px' }}>
          Username:
        </Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3"
        />
      </Form.Group>
      <br />
      <Form.Group controlId="formPassword">
        <Form.Label style={{ fontWeight: 'bold', padding: '3px' }}>
          Password:
        </Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Button variant="primary" type="submit">
        Submit
      </Button>

      <div className="mt-3">
        <p style={{ fontWeight: 'bold', padding: '3px', textAlign: 'center' }}>
          Not a member yet?{' '}
          <Link
            style={{ fontWeight: 'bold', padding: '3px', textAlign: 'center' }}
            to="/signup"
          >
            Sign up!
          </Link>
        </p>
      </div>
    </Form>
  );
};
