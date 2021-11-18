import { Button, Container, Form } from 'react-bootstrap';

function App() {
  return (
    <Container>
      <div>
        La description du lieu dans lequel on se trouve actuellement
      </div>
      <Form>
        <Form.Control
          placeholder="Entrez votre commande ici"
          type="text"
        />
        <Button
          type="submit"
          variant="primary"
        >
          Envoyer
        </Button>
      </Form>
    </Container>
  );
}

export default App;
