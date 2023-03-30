import { Button, Card } from "react-bootstrap";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Card>
      <Card.Img variant="top" src={movie.imageURL} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text>
          <strong>Genre: </strong>
          {movie.genre.name}
        </Card.Text>
        <Card.Text>
          <strong>Director: </strong>
          {movie.director.name}
        </Card.Text>
        <Button onClick={onBackClick} variant="primary">
          Go Back
        </Button>
      </Card.Body>
    </Card>
  );
};