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
// import { ChatService } from './chat.service';
// import { Chat } from './chat.entity';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';

// @Controller('chats')
// export class ChatController {
//   constructor(private readonly chatService: ChatService) {}

//   @Post()
//   create(@Body() createChatDto: CreateChatDto): Promise<Chat> {
//     return this.chatService.create(createChatDto);
//   }

//   @Get()
//   findAll(): Promise<Chat[]> {
//     return this.chatService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<Chat> {
//     return this.chatService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateChatDto: UpdateChatDto,
//   ): Promise<Chat> {
//     return this.chatService.update(id, updateChatDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.chatService.remove(id);
//   }
// }
