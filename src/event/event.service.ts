import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    patientId: string,
  ): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      patientId: patientId, // Store patientId instead of relation
    });

    return await this.eventRepository.save(event);
  }

  async updateEvent(
    updateEventDto: UpdateEventDto,
    id: number,
  ): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    existingEvent.event = updateEventDto.event;
    return this.eventRepository.save(existingEvent);
  }

  async findOne(eventId: number): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  async getEventsByMonthAndPatientID(
    patientId: string,
    month: number,
    year: number,
  ): Promise<Event[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.eventRepository.find({
      where: {
        patientId: patientId, // Use patientId directly
        date: Between(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
        ),
      },
    });
  }

  async removeByDateAndPatient(id: number): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
    });

    if (!event) {
      throw new NotFoundException(`Event ID: ${id} is not found`);
    }

    await this.eventRepository.remove(event);
  }
}
