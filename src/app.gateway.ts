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
    client.emit('welcome', { chatUser: "Admin", message: `Welcome to the chat,${this.users[client.id]} ` });
  }


  @SubscribeMessage('joinSingleChat')
  handleSingleChatJoinedEvent(client: Socket, payload: { chatUser: string }) {
    const { chatUser } = payload;
    this.users[client.id] = chatUser;
    client.broadcast.emit('singleUserJoined', { chatUser: "Admin", message: `${this.users[client.id]} has joined` });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { message: string, id: string, name: string, groupId: string }): void {
    const { message, id, name, groupId } = payload;
    const chatUser = this.users[id];
    this.server.emit('sendMessage', { chatUser, message, id, name, groupId });
  }

  @SubscribeMessage('userTyping')
  handleUserTypeJoinedEvent(client: Socket, payload: { isTyping: boolean, userName: string, values: any }) {
    const { isTyping, userName, values } = payload;
    client.broadcast.emit('userTypings', { isTyping, userName, values });
  }

  @SubscribeMessage('groupUserTyping')
  handleGroupUserJoinedEvent(client: Socket, data: any) {
    client.broadcast.emit('userGroupTypings', data);
  }

  @SubscribeMessage('singleMessage')
  handleSingleMessageEvent(client: Socket, payload: { message: string, id: string, name: string, userId: number, loginUserId: number }) {
    const { message, id, name, userId, loginUserId } = payload;
    const user = this.users[id];
    this.server.emit('singleSendMessage', { user, message, id, name, userId, loginUserId });
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