import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { MESSAGE_PC } from 'src/constants/message.constant';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import { webSocketJwtAuthGuard } from 'src/auth/guards/web-socket-jwt-auth.guard';
import { SendOfferPayload } from './payload/send-offer.payload';
import { WSValidationPipe } from 'src/pipe/WsValidationPipe';
import { ConnectionService } from './connection.service';
import { ConnectionGatewayService } from './connection.gateway.service';
import { AuthService } from 'src/auth/auth.service';
import { ToeknVerifyFailed } from 'src/common/common.exception';
import { SendAnswerPayload } from './payload/send-answer.payload';
import { sendIceCandidate } from './payload/send-ice-candidate.payload';

@WebSocketGateway()
@UsePipes(new WSValidationPipe())
export class ConnectionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: SocketIoServer;
  logger = new Logger(ConnectionGateway.name);

  constructor(private readonly connectionGatewayService: ConnectionGatewayService, private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      if (client?.handshake?.headers?.authorization) {
        const rawToken = client?.handshake?.headers?.authorization?.split(' ')?.[1];

        if (!rawToken) return false;

        const { userInfo, token } = await this.authService.validateToken(rawToken);
        client.handshake['user'] = { ...userInfo, socketId: client.id };
        client.data['user'] = { ...userInfo, socketId: client.id };
      }

      return true;
    } catch (e) {
      if (e instanceof ToeknVerifyFailed) return false;
      else throw e;
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_PC.SEND_OFFER)
  async sendOfferHandler(client: Socket, payload: SendOfferPayload) {
    try {
      const { offer, socketId } = payload;
      this.connectionGatewayService.sendOffer(client, { offer, destSocketId: socketId });
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_PC.SEND_ANSWER)
  async sendAnswerHandler(client: Socket, payload: SendAnswerPayload) {
    try {
      const { answer, socketId } = payload;
      this.connectionGatewayService.sendAnswer(client, { answer, destSocketId: socketId });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  @UseGuards(webSocketJwtAuthGuard)
  @SubscribeMessage(MESSAGE_PC.SEND_ICE_CANDIDATE)
  async sendIceCandidate(client: Socket, payload: sendIceCandidate) {
    try {
      const { candidate, socketId } = payload;
      this.connectionGatewayService.sendIceCandidate(client, { candidate, destSocketId: socketId });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
