import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private patientService: PatientService, // Renamed for clarity
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const existingChat = await this.chatRepository.findOne({
      where: {
        patient: { id: createChatDto.patientId }, // ✅ Fix: Reference patient object
        date: createChatDto.date,
      },
    });

    if (existingChat) {
      throw new NotFoundException(
        `Chat entry for patient ID ${createChatDto.patientId} on date ${createChatDto.date} already exists`,
      );
    }

    const patient = await this.patientService.findOne(createChatDto.patientId);
    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createChatDto.patientId} not found`,
      );
    }

    const chat = this.chatRepository.create({
      ...createChatDto,
      patient: patient, // ✅ Fix: Store patient object
    });

    return this.chatRepository.save(chat);
  }


  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find({ relations: ['patient'] }); // Fixed relation
  }

  async findByDate(date: string): Promise<Chat[]> {
    const chats = await this.chatRepository.find({
      where: { date },
      relations: ['patient'],
    });

    if (!chats.length) {
      throw new NotFoundException(`No chat entries found for date ${date}`);
    }

    return chats;
  }

  async findByPatientId(patientId: number): Promise<Chat[]> {
    const chats = await this.chatRepository.find({
      where: { patient: { id: patientId } },
      relations: ['patient'],
    });

    if (!chats.length) {
      throw new NotFoundException(
        `No chat entries found for patient ID ${patientId}`,
      );
    }

    return chats;
  }

  async findByChatId(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    return chat;
  }

  async findOne(patientId: number, date: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { patient: { id: patientId }, date },
      relations: ['patient'],
    });

    if (!chat) {
      throw new NotFoundException(
        `No chat entry found for patient ID ${patientId} on ${date}`,
      );
    }

    return chat;
  }

  async update(id: number, updateChatDto: UpdateChatDto): Promise<Chat> {
    const existingChat = await this.chatRepository.findOne({ where: { id } });
    if (!existingChat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    if (updateChatDto.patientId) {
      const patient = await this.patientService.findOne(updateChatDto.patientId);
      if (!patient) {
        throw new NotFoundException(
          `Patient with ID ${updateChatDto.patientId} not found`,
        );
      }
      existingChat.patient = patient;
    }

    this.chatRepository.merge(existingChat, updateChatDto);
    return this.chatRepository.save(existingChat);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chatRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
  }
}
