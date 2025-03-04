// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { MessageService } from './message.service';
// import { Message } from './message.entity';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';

// @Controller('messages')
// export class MessageController {
//   constructor(private readonly messageService: MessageService) {}

//   @Post()
//   create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
//     return this.messageService.create(createMessageDto);
//   }

//   @Get()
//   findAll(): Promise<Message[]> {
//     return this.messageService.findAll();
//   }

//   @Get('by-message/:id')
//   findByMessageId(@Param('id', ParseIntPipe) id: number): Promise<Message> {
//     return this.messageService.findByMessageId(id);
//   }

//   @Get('by-chat/:chatId')
//   findByChatId(
//     @Param('chatId', ParseIntPipe) chatId: number,
//   ): Promise<Message[]> {
//     return this.messageService.findByChatId(chatId);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateMessageDto: UpdateMessageDto,
//   ): Promise<Message> {
//     return this.messageService.update(id, updateMessageDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.messageService.remove(id);
//   }
// }
