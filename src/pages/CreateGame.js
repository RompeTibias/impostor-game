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
import { createGame } from '../utils/firebaseUtils';

function CreateGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
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

    try {
      // Generar un ID de sala aleatorio
      const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
      await createGame(gameId, playerName);
      navigate(`/waiting/${gameId}`);
    } catch (err) {
      setError('Error al crear la sala. Por favor, intenta de nuevo.');
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
            Crear Sala
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
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creando sala...' : 'Crear Sala'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateGame; 