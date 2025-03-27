import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { subscribeToGame, startGame } from '../utils/firebaseUtils';

function WaitingRoom() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToGame(gameId, (data) => {
      setGameData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      navigate(`/game/${gameId}`);
    }
  }, [countdown, gameId, navigate]);

  const handleStartGame = async () => {
    try {
      setLoading(true);
      await startGame(gameId);
      setCountdown(5);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!gameData) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography color="error">La sala no existe</Typography>
        </Box>
      </Container>
    );
  }

  const isHost = gameData.players.find(p => p.isHost)?.name === gameData.host;

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
            Sala de Espera
          </Typography>
          
          <Typography variant="h6" color="primary" gutterBottom>
            Código de la sala: {gameId}
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Typography variant="body1" sx={{ mb: 3 }}>
            {countdown ? `El juego comenzará en ${countdown}...` : 'Esperando jugadores...'}
          </Typography>

          <List sx={{ mb: 3 }}>
            {gameData.players.map((player) => (
              <ListItem key={player.id}>
                <ListItemText 
                  primary={player.name}
                  secondary={player.isHost ? 'Host' : ''}
                />
              </ListItem>
            ))}
          </List>

          {isHost && !countdown && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleStartGame}
              disabled={loading || gameData.players.length < 3}
            >
              {loading ? 'Iniciando...' : 'Iniciar Juego'}
            </Button>
          )}

          {countdown && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default WaitingRoom; 