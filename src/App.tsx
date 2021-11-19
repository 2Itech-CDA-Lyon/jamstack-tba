import { useEffect, useState } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { Room } from './types/api';

const startingRoomName = 'bedroom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<Room>();

  // Fetch starting room on component mounting
  useEffect(
    () => {
      fetch(`/.netlify/functions/roomByName/${startingRoomName}`)
      .then(response => response.json())
      .then((data: Room) => setCurrentRoom(data));
    },
    []
  )

  if (typeof currentRoom === 'undefined') {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container>
      <p>You are in the {currentRoom.data.name}.</p>
      <p>
        {currentRoom.data.description}
      </p>
      <Form>
        <Form.Label>
          What do you want to do?
        </Form.Label>
        <Form.Control
          placeholder="Enter your command"
          type="text"
        />
        <Button
          type="submit"
          variant="primary"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default App;
