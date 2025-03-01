import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { PatientModule } from '../patient/patient.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), PatientModule, MessageModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
