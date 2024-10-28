import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { MessageDto } from './chat-room-dto/message.dto';
import { OpenAIService } from './openai/openai.service';
import * as dotenv from 'dotenv';

dotenv.config();

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS.split(', '),
    methods: ['GET', 'POST'],
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private activeConnections: Set<string> = new Set();
  constructor(
    private readonly appService: AppService,
    private readonly openAIService: OpenAIService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    const userName = client.handshake.query.userName as string;
    if (!userName) {
      client.disconnect();
      throw new Error('User name is required');
    }

    if (this.activeConnections.has(client.id)) {
      console.log(`Client ${client.id} already connected`);
      client.disconnect();
      return;
    }

    client.join(client.id);
    await this.appService.createChatRoom(client.id, userName);

    await this.appService.sendMessage(client.id, {
      role: 'assistant',
      content:
        'Hi! I am the AI assistant of this website. How can I help you today?',
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.appService.deleteChatRoom(client.id);
  }

  @SubscribeMessage('send-message')
  async sendNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: MessageDto,
  ): Promise<void> {
    await this.appService.sendMessage(client.id, message);

    if (message.role === 'user') {
      this.appService.getAllMessages(client.id).then((messages) => {
        console.log(messages);
        const messagesForAI = messages.map((message) => ({
          role: message.role,
          content: message.content,
        }));

        this.openAIService
          .generateResponse(messagesForAI, client)
          .then((message) => {
            this.appService.sendMessage(client.id, {
              role: 'assistant',
              content: message,
            });
          });
      });
    }
  }

  @SubscribeMessage('watch-messages')
  async watchForNewMessages(@ConnectedSocket() client: Socket) {
    this.appService.watchChatRoom(client.id, (message) => {
      client.emit('new-message', {
        role: message.role,
        content: message.content,
      });
    });
  }
}
