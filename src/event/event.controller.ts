import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { EncryptionService } from 'src/encryption/encryption.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post()
  async create(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.eventService.create(createEventDto, citizenID);
  }

  @Put(':eventId')
  async update(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('eventId') eventId: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.eventService.updateEvent(updateEventDto, eventId, citizenID);
  }

  @Get()
  async getEventsByMonthAndPatientID(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<Event[]> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.eventService.getEventsByMonthAndPatientID(
      citizenID,
      month,
      year,
    );
  }

  @Delete(':eventId')
  async remove(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('eventId') eventId: number,
  ): Promise<void> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.eventService.removeByDateAndPatient(eventId, citizenID);
  }
}
