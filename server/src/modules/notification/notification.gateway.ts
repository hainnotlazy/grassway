import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { RedisDatabase, RedisService } from 'src/shared/services/redis/redis.service';
import { UserNotification } from 'src/entities';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "notification",
  maxHttpBufferSize: 1e7 //1MB
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly NEW_NOTIFICATION_EVENT_NAME = "NewNotification"; 
  @WebSocketServer() server: Server;

  constructor(
    private redisService: RedisService,
    private jwtService: JwtService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const accessToken = socket.handshake.headers.authorization.replace("Bearer ", "");
      const user = await this.extractTokenPayload(accessToken);

      if (!user) {
        this.disconnectSocket(socket);
      } else if (await this.isTokenBlacklisted(accessToken) || !user.isActive) {
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

  async emitNewNotification(userId: number, notification: UserNotification): Promise<boolean> {
    try {
      const socketId = await this.redisService.getKey({
        key: userId.toString(),
        database: RedisDatabase.NOTIFICATION_SOCKET
      });

      if (!socketId) return false;

      return this.server.to(socketId).emit(this.NEW_NOTIFICATION_EVENT_NAME, notification);
    } catch (err) {
      return false;
    }
  }

  private disconnectSocket(socket: Socket, error?: 401) {
    if (error === 401) {
      socket.emit("Error", new UnauthorizedException());
    }
    socket.disconnect();
  }

  private async isTokenBlacklisted(accessToken: string) {
    return !!(await this.redisService.getKey({
      key: accessToken
    }));
  }

  private async extractTokenPayload(token: string) {
    return this.jwtService.verify(token);
  }
}
