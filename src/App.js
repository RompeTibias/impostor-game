import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import CreateGame from './pages/CreateGame';
import Game from './pages/Game';
import WaitingRoom from './pages/WaitingRoom';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/waiting/:gameId" element={<WaitingRoom />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 