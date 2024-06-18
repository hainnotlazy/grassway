import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { PublicRoute } from 'src/common/decorators';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @PublicRoute()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check server health status' })
  async check() {
    const result = await this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);

    return `Server status: ${result.status}`;
  }

  @PublicRoute()
  @Get("database")
  @HealthCheck()
  @ApiOperation({ summary: 'Check database health status' })
  async checkDatabase() {
    const result = await this.health.check([
      () => this.db.pingCheck('database'),
    ]);
    return `Database status: ${result.status}`
  }
}
