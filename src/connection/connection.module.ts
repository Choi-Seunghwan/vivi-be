import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionGateway } from './connection.gateway';
import { ConnectionService } from './connection.service';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService, ConnectionGateway],
})
export class ConnectionModule {}
