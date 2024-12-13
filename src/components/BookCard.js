/* import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BookCard(props) {
  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          _id: {props._id}
        </Card.Text>
        <Button href={"/book/" + props._id} variant="outline-primary">Open Book</Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard; */

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

function BookCard(props) {
  const navigate = useNavigate();

  const handleOpenBook = () => {
    navigate(`/book/${props._id}`);
  };

  return (
    <Card style={{ width: '18rem' }} className="mb-3">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          _id: {props._id}
        </Card.Text>
        <Button onClick={handleOpenBook} variant="outline-primary">Open Book</Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
