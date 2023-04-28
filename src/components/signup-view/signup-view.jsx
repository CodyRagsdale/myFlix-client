import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export const SignupView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
      email: email,
      birthday: birthday,
    };

    fetch('https://dark-blue-lizard-kilt.cyclic.app/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          alert('Signup successful!');
          navigate('/login');
        } else {
          alert('Signup failed!');
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Form
      className="signup-view"
      onSubmit={handleSubmit}
      style={{ paddingTop: '45px', display: 'flex', flexDirection: 'column' }}
    >
      <Form.Group controlId="formUsername" style={{ padding: '10px' }}>
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

      <Form.Group controlId="formPassword" style={{ padding: '10px' }}>
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

      <Form.Group controlId="formEmail" style={{ padding: '10px' }}>
        <Form.Label style={{ fontWeight: 'bold', padding: '3px' }}>
          Email:
        </Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBirthday" style={{ padding: '10px' }}>
        <Form.Label style={{ fontWeight: 'bold', padding: '3px' }}>
          Birthday:
        </Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Button variant="primary" type="submit" style={{ width: '100%' }}>
        Submit
      </Button>
      <p style={{ paddingTop: '20px', textAlign: 'center' }}>
        Already a member?{' '}
        <Link to="/login" style={{ fontWeight: 'bold' }}>
          Login
        </Link>
      </p>
    </Form>
  );
};
