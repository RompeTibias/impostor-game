import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper
} from '@mui/material';

function Home() {
  const navigate = useNavigate();

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
          <Typography variant="h3" component="h1" gutterBottom>
            Impostor Game
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            ¡Descubre al impostor en este divertido juego de preguntas y respuestas!
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create')}
              fullWidth
            >
              Crear Sala
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/join')}
              fullWidth
            >
              Unirse a Sala
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 