import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PatientRoleGuard } from 'src/auth/guard/patient-auth.guard';
import { PatientOwnEventGuard } from 'src/auth/guard/event-patient-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(PatientRoleGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    return this.eventService.create(createEventDto, req.user.id);
  }

  @Put(':eventId')
  @UseGuards(PatientOwnEventGuard)
  async update(
    @Param('eventId') eventId: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.updateEvent(updateEventDto, eventId);
  }

  @Get()
  @UseGuards(PatientRoleGuard)
  async getEventsByMonthAndPatientID(
    @Query('month') month: number,
    @Query('year') year: number,
    @Req() req: any,
  ): Promise<Event[]> {
    return this.eventService.getEventsByMonthAndPatientID(
      req.user.id,
      month,
      year,
    );
  }

  @Delete(':eventId')
  @UseGuards(PatientOwnEventGuard)
  async remove(@Param('eventId') eventId: number): Promise<void> {
    return this.eventService.removeByDateAndPatient(eventId);
  }
}
