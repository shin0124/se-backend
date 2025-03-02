import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private chatService: ChatService, // Inject Chat service
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const chat = await this.chatService.findOne(createMessageDto.chatId);
    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${createMessageDto.chatId} not found`,
      );
    }

    const message = this.messageRepository.create({
      ...createMessageDto,
      chatId: chat.id,
    });

    return await this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({ relations: ['chatId'] });
  }

  async findByChatId(chatId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      where: { chatId },
      relations: ['chatId'],
    });

    if (!messages || messages.length === 0) {
      throw new NotFoundException(`No messages found for chat ID ${chatId}`);
    }

    return messages;
  }

  async findByMessageId(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['chatId'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const existingMessage = await this.messageRepository.findOne({ where: { id } });
    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    if (updateMessageDto.chatId) {
      const chat = await this.chatService.findOne(updateMessageDto.chatId);
      if (!chat) {
        throw new NotFoundException(
          `Chat with ID ${updateMessageDto.chatId} not found`,
        );
      }
      existingMessage.chatId = chat.id;
    }

    this.messageRepository.merge(existingMessage, updateMessageDto);
    return await this.messageRepository.save(existingMessage);
  }

  async remove(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }
}
