import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { RoomGateway } from './ws.gateway';
import { WsController } from './ws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from 'src/source-code/entities/chat.entity';
import { ProfileModule } from 'src/account/profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel]), ProfileModule, AuthModule],
  providers: [RoomGateway, WsService],
  controllers: [WsController],
})
export class WsModule {}
