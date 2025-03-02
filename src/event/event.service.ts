import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Event } from './event.entity';
import { PatientService } from 'src/patient/patient.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private patientsService: PatientService,
  ) {}

  async create(createEventDto: CreateEventDto, patientId): Promise<Event> {
    const patient = await this.patientsService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      patient: patient,
    });

    return await this.eventRepository.save(event);
  }

  async updateEvent(updateEventDto: UpdateEventDto, patientId): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({
      where: { id: updateEventDto.id },
      relations: ['patient'],
    });
    if (!existingEvent) {
      throw new NotFoundException(
        `Event with ID ${updateEventDto.id} not found`,
      );
    }

    if (patientId !== existingEvent.patient.id) {
      throw new NotFoundException(
        "You are not authorized to access this patient's event.",
      );
    }

    existingEvent.event = updateEventDto.event;

    return this.eventRepository.save(existingEvent);
  }

  async findOne(eventId: number): Promise<Event> {
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
        patient: { id: patientId },
        date: Between(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
        ),
      },
    });
  }

  async removeByDateAndPatient(id: number, patientId): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['patient'],
    });
    if (!event) {
      throw new NotFoundException(`Event id: ${id} is not found`);
    }

    if (patientId !== event.patient.id) {
      throw new NotFoundException(
        "You are not authorized to access this patient's event.",
      );
    }

    await this.eventRepository.remove(event);
  }
}
