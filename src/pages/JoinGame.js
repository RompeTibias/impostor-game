import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { joinGame } from '../utils/firebaseUtils';

function JoinGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!playerName.trim()) {
      setError('Por favor, ingresa tu nombre');
      setLoading(false);
      return;
    }

    if (playerName.length > 8) {
      setError('El nombre no puede tener más de 8 letras');
      setLoading(false);
      return;
    }

    if (!gameId.trim()) {
      setError('Por favor, ingresa el código de la sala');
      setLoading(false);
      return;
    }

    try {
      await joinGame(gameId.toUpperCase(), playerName);
      navigate(`/waiting/${gameId.toUpperCase()}`);
    } catch (err) {
      setError(err.message || 'Error al unirse a la sala. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Unirse a Sala
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Tu nombre"
              variant="outlined"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              error={!!error}
              helperText={error}
              inputProps={{ maxLength: 8 }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Código de la sala"
              variant="outlined"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Uniéndose...' : 'Unirse'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default JoinGame; 