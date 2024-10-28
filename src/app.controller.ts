import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessageDto } from './chat-room-dto/message.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('chatroom/:id')
  // getChatRoom(@Param('id') chatRoomId: string) {
  //   return this.appService.getChatRoom(chatRoomId);
  // }

  // @Get('watch-chatroom/:id')
  // watchChatRoom(@Param('id') chatRoomId: string) {
  //   return this.appService.watchChatRoom(chatRoomId);
  // }

  @Post('send-message/:id')
  sendMessage(@Param('id') chatRoomId: string, @Body() message: MessageDto) {
    return this.appService.sendMessage(chatRoomId, message);
  }
}
