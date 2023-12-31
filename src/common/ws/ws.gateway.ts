import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { Server, Socket } from 'socket.io';
import { RoomGatewaySendMessage } from './dto/room-gateway-send-message.dto';
import { cors } from 'src/source-code/common/cors';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthID } from '../auth/decorator/id.decorator';

@WebSocketGateway({ secure: true, namespace: /room\/*/, cors })
@UseGuards(AuthGuard)
export class RoomGateway {
  constructor(private readonly wsService: WsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() data: RoomGatewaySendMessage,
    @ConnectedSocket() socket: Socket,
    @AuthID() loginUserID: number,
  ) {
    const roomID: number = parseInt(socket.nsp.name.split('/').slice(-1)[0]);
    const { chat } = await this.wsService.sendMessage(
      data,
      roomID,
      loginUserID,
    );
    socket.broadcast.emit(`${roomID}`, chat);
  }
}
