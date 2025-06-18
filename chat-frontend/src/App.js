import {React,useEffect} from 'react';
import Chat from './Chat';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "InstaM v2.0 - Instant Messaging";
  }, []);

  return (
    <div className="App">
      <Chat />
    </div>
  );
}

export default App;