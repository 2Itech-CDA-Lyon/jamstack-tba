import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from './types/api';

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const handleClick = () => {
    fetch('/.netlify/functions/users')
    .then(response => response.json())
    .then(data => setUsers(data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={handleClick}>
          Fetch users
        </button>
        <ul>
          {
            users.map(
              user => (
                <li key={user.ref['@ref'].id}>
                  {user.data.firstName} {user.data.lastName} ({user.data.email})
                </li>
              )
            )
          }
        </ul>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
