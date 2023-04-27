// app.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: { [socketId: string]: string } = {}; // Define a private property to store user information

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joined')
  handleJoinedEvent(client: Socket, payload: { user: string }) {
    const { user } = payload;
    const socketId = client.id;
    console.log(`${user} has joined `);
    this.users[socketId] = user; // Store user information in the users property
    client.broadcast.emit('userJoined', { user: 'Admin', message: `${user} has joined` });
    client.emit('welcome', { user: 'Admin', message: `Welcome to the chat, ${user}` });
  }

  @SubscribeMessage('message')
  handleMessageEvent(client: Socket, payload: { message: string, id: string }) {
    const { message, id } = payload;
    const user = this.users[id];
    this.server.emit('sendMessage', { user, message, id });
  }

  @SubscribeMessage('disconnecting')
  handleDisconnectEvent(client: Socket) {
    const user = this.users[client.id];
    client.broadcast.emit('leave', { user: 'Admin', message: `${user} has left` });
    console.log(`${user} has left`);
    delete this.users[client.id];
  }
}
