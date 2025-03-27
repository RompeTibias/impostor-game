import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import db from '../firebase';

export const createGame = async (gameId, hostName) => {
  const gameRef = doc(db, 'games', gameId);
  await setDoc(gameRef, {
    host: hostName,
    players: [{
      id: Date.now().toString(),
      name: hostName,
      isHost: true
    }],
    status: 'waiting',
    currentRound: 0,
    createdAt: new Date().toISOString()
  });
  return gameRef;
};

export const joinGame = async (gameId, playerName) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  
  if (!gameDoc.exists()) {
    throw new Error('La sala no existe');
  }

  const gameData = gameDoc.data();
  if (gameData.status !== 'waiting') {
    throw new Error('La sala ya está en juego');
  }

  const newPlayer = {
    id: Date.now().toString(),
    name: playerName,
    isHost: false
  };

  await updateDoc(gameRef, {
    players: [...gameData.players, newPlayer]
  });

  return newPlayer;
};

export const subscribeToGame = (gameId, callback) => {
  const gameRef = doc(db, 'games', gameId);
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const startGame = async (gameId) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  const gameData = gameDoc.data();

  if (gameData.players.length < 3) {
    throw new Error('Se necesitan al menos 3 jugadores');
  }

  // Seleccionar impostor aleatorio
  const impostorIndex = Math.floor(Math.random() * gameData.players.length);
  const impostor = gameData.players[impostorIndex];

  await updateDoc(gameRef, {
    status: 'playing',
    impostor: impostor.id,
    currentRound: 1,
    roundStartTime: new Date().toISOString()
  });
};

export const submitAnswer = async (gameId, playerId, answer) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  const gameData = gameDoc.data();

  const updatedPlayers = gameData.players.map(player => {
    if (player.id === playerId) {
      return { ...player, answer };
    }
    return player;
  });

  await updateDoc(gameRef, {
    players: updatedPlayers
  });
};

export const submitVote = async (gameId, voterId, votedId) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  const gameData = gameDoc.data();

  const updatedPlayers = gameData.players.map(player => {
    if (player.id === voterId) {
      return { ...player, vote: votedId };
    }
    return player;
  });

  await updateDoc(gameRef, {
    players: updatedPlayers
  });
};

export const startNextRound = async (gameId) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  const gameData = gameDoc.data();

  // Seleccionar nuevo impostor
  const impostorIndex = Math.floor(Math.random() * gameData.players.length);
  const impostor = gameData.players[impostorIndex];

  await updateDoc(gameRef, {
    currentRound: gameData.currentRound + 1,
    roundStartTime: new Date().toISOString(),
    impostor: impostor.id,
    players: gameData.players.map(player => ({
      ...player,
      answer: null,
      vote: null
    }))
  });
}; 