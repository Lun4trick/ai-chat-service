import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { MessageDto } from './chat-room-dto/message.dto';
import { Database } from 'firebase-admin/lib/database/database';

@Injectable()
export class AppService {
  realTimeDB: Database;
  constructor(private readonly databaseService: DatabaseService) {
    this.databaseService.getRealtimeDB().then((db) => {
      this.realTimeDB = db;
    });
  }

  async createChatRoom(clientId: string, userName: string): Promise<void> {
    const chatroomRef = this.realTimeDB.ref(`chatrooms/${clientId}`);
    try {
      await chatroomRef.set({
        userName,
        messages: [],
      });
      console.log('Chatroom created');
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllMessages(clientId: string): Promise<MessageDto[]> {
    const path = `chatrooms/${clientId}/messages`;
    const messagesRef = this.realTimeDB.ref(path);
    try {
      const snapshot = await messagesRef.once('value');
      const messages: MessageDto[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      return messages;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteChatRoom(clientId: string) {
    const path = `chatrooms/${clientId}`;
    const chatroomRef = this.realTimeDB.ref(path);
    try {
      await chatroomRef.remove();
    } catch (error) {
      throw new Error(error);
    }
  }

  async watchChatRoom(
    clientId: string,
    webSocketCallback: (message: MessageDto) => void,
  ) {
    const path = `chatrooms/${clientId}/messages`;
    const chatroomRef = this.realTimeDB.ref(path);
    if (!chatroomRef) {
      throw new Error('Chatroom not found');
    }
    try {
      chatroomRef
        .orderByKey()
        .limitToLast(1)
        .on('child_added', (snapshot) => {
          const lastMessage: MessageDto = snapshot.val();
          if (lastMessage.role !== 'system') {
            webSocketCallback(lastMessage);
          }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendMessage(clientId: string, message: MessageDto) {
    const path = `chatrooms/${clientId}/messages`;
    const chatroomRef = this.realTimeDB.ref(path);
    const data = message;
    try {
      await chatroomRef.push(data);
    } catch (error) {
      throw new Error(error);
    }
  }
}
