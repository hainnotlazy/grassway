import { RedisDatabase, RedisService } from 'src/shared/services/redis/redis.service';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { BrandDraft } from 'src/entities';
import { SOCKET_ORIGIN } from 'src/config/socket.config';

@WebSocketGateway({
  cors: { origin: SOCKET_ORIGIN },
  namespace: "brands",
  maxHttpBufferSize: 1e7 //1MB
})
export class BrandsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly DRAFT_CHANGED_EVENT_NAME = "DraftChanged"; 
  @WebSocketServer() server: Server;

  constructor(
    private redisService: RedisService,
    private jwtService: JwtService
  ) {}

  async onModuleInit() {
    await this.redisService.flushDatabase(RedisDatabase.BRAND);
  }

  async handleConnection(socket: Socket) {
    try {
      if (!socket.handshake.headers.authorization) {
        this.disconnectSocket(socket, 401);
      }
    } catch (err) {
      this.disconnectSocket(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const userId = socket.data.user.userId;
      await this.redisService.removeKey({
        key: userId.toString(),
        database: RedisDatabase.BRAND
      });
      socket.disconnect();
    } catch (err) {}
  }
  
  @SubscribeMessage("register")
  async registerGetNewChanges(socket: Socket) {
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
        database: RedisDatabase.BRAND
      });
      socket.data.user = user;
    } catch (err) {
      this.disconnectSocket(socket);
    }
  }

  async emitDraftChanged(userId: number, brandDraft: BrandDraft): Promise<boolean> {
    try {
      const socketId = await this.redisService.getKey({
        key: userId.toString(),
        database: RedisDatabase.BRAND
      });

      if (!socketId) return false;

      return this.server.to(socketId).emit(this.DRAFT_CHANGED_EVENT_NAME, brandDraft);
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
