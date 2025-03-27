# Impostor Game

Un juego de preguntas y respuestas tipo "Among Us" jugable desde el navegador móvil.

## Características

- Crear o unirse a salas de juego
- Sistema de preguntas donde un jugador es el impostor
- Tiempo de discusión para debatir las respuestas
- Sistema de votación para descubrir al impostor
- Interfaz optimizada para dispositivos móviles
- Sincronización en tiempo real usando Firebase

## Requisitos

- Node.js 14.0.0 o superior
- npm o yarn
- Una cuenta de Firebase (para la sincronización en tiempo real)

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd impostor-game
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura Firebase:
   - Crea un proyecto en la [Consola de Firebase](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Copia la configuración de tu proyecto y pégala en `src/firebase.js`

4. Inicia el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

5. Abre la aplicación en tu navegador móvil:
   - El servidor de desarrollo mostrará la URL local
   - Asegúrate de que tu dispositivo móvil esté en la misma red local

## Cómo jugar

1. **Crear o unirse a una sala**
   - El creador de la sala recibirá un código único
   - Comparte este código con los demás jugadores

2. **Registro de jugadores**
   - Cada jugador debe ingresar su nombre (máximo 8 letras)
   - Se necesitan al menos 3 jugadores para comenzar

3. **Gameplay**
   - Cada ronda comienza con una pregunta
   - Un jugador aleatorio (el impostor) recibirá una pregunta diferente
   - Todos los jugadores escriben sus respuestas
   - Se muestra la pregunta original
   - Los jugadores tienen 1 minuto para discutir y mostrar sus respuestas
   - Cada jugador vota por quien cree que es el impostor
   - Se revela el impostor y se puede comenzar una nueva ronda

## Tecnologías utilizadas

- React
- Material-UI
- Firebase (Firestore)
- React Router

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 