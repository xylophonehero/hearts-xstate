import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { interpret } from 'xstate';
import { heartsMachine } from '../src/heartsMachine';

const app = express();

// Create a HTTP server using Express
const server = http.createServer(app);

// Create a Socket.io server using the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const service = interpret(heartsMachine, { devTools: true })
service.subscribe((state) => {
  if (state.context.$queue.length > 0) {
    console.log(state.context.$queue)
    // io.emit('message', state.context.$queue)
    service.send({ type: 'EMPTY_QUEUE' })
    state.context.$queue.forEach((event) => {
      io.send(event)
    })
  }

  // console.log(service.system.get('hand-1'))
  // postMessage(state.event)
})
service.start()

// Handle new connections
io.on('connection', (socket: Socket) => {
  console.log('New client connected');

  // Handle 'message' events
  socket.on('message', (event: string) => {
    console.log('Received message:', event);
    service.send(event)

    // Broadcast the message to all connected clients
    // io.emit('message', message);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Listening on port 3000');
});

