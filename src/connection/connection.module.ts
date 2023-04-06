import { Module, forwardRef } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionGateway } from './connection.gateway';
import { ConnectionService } from './connection.service';
import { ConnectionGatewayService } from './connection.gateway.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ConnectionController],
  providers: [ConnectionService, ConnectionGateway, ConnectionGatewayService],
})
export class ConnectionModule {}
