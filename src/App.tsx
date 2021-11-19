import { FormEventHandler, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { Room } from './types/api';

const startingRoomName = 'bedroom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<Room>();
  const [command, setCommand] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch starting room on component mounting
  useEffect(
    () => {
      fetch(`/.netlify/functions/roomByName/${startingRoomName}`)
      .then(response => response.json())
      .then((data: Room) => setCurrentRoom(data));
    },
    []
  )

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    fetch(`/.netlify/functions/room-by-from-room-and-direction-name/${currentRoom?.ref['@ref'].id}/${command}`)
    .then(response => {
      if (response.ok) {
        setCommand(''); 
        return response.json();
      }
      throw new Error(String(response.status));
    })
    .then((data: Room) => { setCurrentRoom(data); setErrorMessage('') })
    .catch(error => {
      if (error.message === '404') {
        setErrorMessage('You cannot go into that direction!');
      }
    })
  }

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
      {currentRoom.data.connectionsFrom && (
        <>
          <Card>
            <Card.Body className="d-flex gap-2">
              <div>Available exits</div>
              <ul className="d-flex gap-2">
                {
                  currentRoom.data.connectionsFrom.map(
                    connection => (
                      <li key={connection.ref['@ref'].id}>
                        <Badge pill bg="primary">
                          {connection.data.direction.data.name}
                        </Badge>
                      </li>
                    )
                  )
                }
              </ul>
            </Card.Body>
          </Card>
        </>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Label>
          What do you want to do?
        </Form.Label>
        <Form.Control
          placeholder="Enter your command"
          type="text"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
        >
          Submit
        </Button>
      </Form>

      {
        errorMessage && (
          <Alert variant="warning">
            {errorMessage}
          </Alert>
        )
      }
    </Container>
  );
}

export default App;
