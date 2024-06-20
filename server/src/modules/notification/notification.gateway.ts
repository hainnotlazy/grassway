import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { RedisDatabase, RedisService } from 'src/shared/services/redis/redis.service';

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "notification",
  maxHttpBufferSize: 1e7 //1MB
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private redisService: RedisService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const accessToken = socket.handshake.headers.authorization.replace("Bearer ", "");
      const user = await this.authService.extractTokenPayload(accessToken);
  
      if (!user) {
        this.disconnectSocket(socket);
      } else if (await this.authService.isTokenBlacklisted(accessToken) || !user.isActive) {
        this.disconnectSocket(socket, 401);
      }

      await this.redisService.setKey({
        key: user.userId.toString(),
        value: socket.id,
        database: RedisDatabase.NOTIFICATION_SOCKET
      });
      socket.data.user = user;
    } catch (err) {
      this.disconnectSocket(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const userId = socket.data.user.userId;
      await this.redisService.removeKey({
        key: userId.toString(),
        database: RedisDatabase.NOTIFICATION_SOCKET
      });
      socket.disconnect();
    } catch (err) {}
  }


  private disconnectSocket(socket: Socket, error?: 401) {
    if (error === 401) {
      socket.emit("Error", new UnauthorizedException());
    }
    socket.disconnect();
  }
}
