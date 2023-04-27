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
  handleJoinedEvent(client: Socket, payload: { chatUser: string }) {
    const { chatUser } = payload;
    this.users[client.id] = chatUser;
    console.log(`${chatUser} has joined `);
    client.broadcast.emit('userJoined', { chatUser: "Admin", message: ` ${this.users[client.id]} has joined` });
    client.emit('welcome', { chatUser: "Admin", message: `Welcome to the chat,${this.users[client.id]} ` })
  }

  // @SubscribeMessage('joined')
  // handleJoinedEvent(client: Socket, payload: { user: string }) {
  //   const { user } = payload;
  //   const socketId = client.id;
  //   console.log(`${user} has joined `);
  //   this.users[socketId] = user; // Store user information in the users property
  //   client.broadcast.emit('userJoined', { user: 'Admin', message: `${user} has joined` });
  //   client.emit('welcome', { user: 'Admin', message: `Welcome to the chat, ${user}` });
  // }

  // @SubscribeMessage('message')
  // handleMessageEvent(client: Socket, payload: { message: string, id: string, name: string, groupId: number }) {
  //   const { message, id, name, groupId } = payload;
  //   const user = this.users[id];
  //   this.server.emit('sendMessage', { user, message, id, name, groupId });
  // }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { message: string, id: string, name: string, groupId: string }): void {
    const { message, id, name, groupId } = payload;
    const chatUser = this.users[id];
    this.server.emit('sendMessage', { chatUser, message, id, name, groupId });
  }

  @SubscribeMessage('singleMessage')
  handleSingleMessageEvent(client: Socket, payload: { message: string, id: string, name: string, userId: number }) {
    const { message, id, name, userId } = payload;
    const user = this.users[id];
    this.server.emit('sendMessage', { user, message, id, name, userId });
  }

  @SubscribeMessage('request')
  handleRequest(client: Socket, data: any, username: string): void {
    const response = { data, username };
    this.server.emit('response', response);
  }

  @SubscribeMessage('disconnecting')
  handleDisconnectEvent(client: Socket) {
    const user = this.users[client.id];
    client.broadcast.emit('leave', { user: 'Admin', message: `${user} has left` });
    console.log(`${user} has left`);
    delete this.users[client.id];
  }
}
