import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    updateEventDto.id = id;
    return this.eventService.updateEvent(updateEventDto);
  }

  @Get()
  async getEventsByMonthAndPatientID(
    @Query('patientId') patientId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<Event[]> {
    return this.eventService.getEventsByMonthAndPatientID(
      patientId,
      month,
      year,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.eventService.removeByDateAndPatient(id);
  }
}
