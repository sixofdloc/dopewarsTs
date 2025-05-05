// src/index.ts
import net from 'net';
import { Comm } from './utils/comm';
import { Game } from './game';

// Port configuration, default to 6970
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 6970;

// Create TCP server
const server = net.createServer(async (socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  // Initialize communication (ANSI vs PETSCII)
  const comm = new Comm(socket);
  await comm.init();

  // Instantiate and start the game using the negotiated Comm
  const game = new Game(comm);
  await game.start();

  socket.on('error', (err) => console.error('Socket error:', err));
  socket.on('close', () => console.log('Client disconnected'));
});

// Start listening
server.listen(PORT, () => {
  console.log(`DopeWars server listening on port ${PORT}`);
});
