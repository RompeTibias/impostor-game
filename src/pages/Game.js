import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { subscribeToGame, submitAnswer, submitVote, startNextRound } from '../utils/firebaseUtils';

const QUESTIONS = [
  {
    normal: "¿Cuál es tu color favorito?",
    impostor: "¿Cuál es tu comida favorita?"
  },
  {
    normal: "¿Qué superpoder te gustaría tener?",
    impostor: "¿Qué animal te gustaría ser?"
  },
  {
    normal: "¿Cuál es tu estación del año favorita?",
    impostor: "¿Cuál es tu día de la semana favorito?"
  }
];

function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [votedPlayer, setVotedPlayer] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToGame(gameId, (data) => {
      setGameData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (gameData?.status === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameData?.status, timeLeft]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      setLoading(true);
      await submitAnswer(gameId, gameData.players.find(p => p.name === gameData.host).id, answer);
      setGameData(prev => ({ ...prev, status: 'discussion' }));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVote = async (playerId) => {
    try {
      setLoading(true);
      await submitVote(gameId, gameData.players.find(p => p.name === gameData.host).id, playerId);
      setVotedPlayer(playerId);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNextRound = async () => {
    try {
      setLoading(true);
      await startNextRound(gameId);
      setAnswer('');
      setTimeLeft(60);
      setShowResults(false);
      setVotedPlayer(null);
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
          <Typography color="error">Error al cargar el juego</Typography>
        </Box>
      </Container>
    );
  }

  const currentPlayer = gameData.players.find(p => p.name === gameData.host);
  const isImpostor = currentPlayer?.id === gameData.impostor;
  const currentQuestion = QUESTIONS[gameData.currentRound % QUESTIONS.length];

  const renderQuestionPhase = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tu pregunta:
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        {isImpostor ? currentQuestion.impostor : currentQuestion.normal}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Tu respuesta"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmitAnswer}
        disabled={!answer.trim() || loading}
      >
        {loading ? 'Enviando...' : 'Enviar Respuesta'}
      </Button>
    </Box>
  );

  const renderDiscussionPhase = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tiempo restante: {timeLeft}s
      </Typography>
      <Typography variant="body1" gutterBottom>
        Muestra tu dispositivo a los demás jugadores y discute sobre las respuestas.
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        Tu respuesta: {answer}
      </Typography>
    </Box>
  );

  const renderVotingPhase = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Vota por el impostor
      </Typography>
      <List>
        {gameData.players.map((player) => (
          <ListItem
            key={player.id}
            button
            selected={votedPlayer === player.id}
            onClick={() => handleVote(player.id)}
            disabled={loading}
          >
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {gameData.status === 'playing' && renderQuestionPhase()}
          {gameData.status === 'discussion' && renderDiscussionPhase()}
          {gameData.status === 'voting' && renderVotingPhase()}
        </Paper>

        <Dialog open={showResults} onClose={() => setShowResults(false)}>
          <DialogTitle>Resultados</DialogTitle>
          <DialogContent>
            <Typography>
              {isImpostor ? '¡Eres el impostor!' : '¡No eres el impostor!'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNextRound} variant="contained" disabled={loading}>
              {loading ? 'Iniciando...' : 'Siguiente Ronda'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Game; 