import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ path: '/events', transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('args: ', args);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('client: ', client);
    console.log('payload: ', payload);
    return 'Hello world!';
  }

  broadcastMessage(message: string): void {
    this.server.emit('message', { message });
  }

  broadcastQueryKey(queryKey: any[]): void {
    this.server.emit('queryKey', queryKey);
  }
}
