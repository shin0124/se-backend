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
import { JwtAuthGuard } from 'src/patientAuth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    return this.eventService.create(createEventDto, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any,
  ): Promise<Event> {
    updateEventDto.id = id;
    return this.eventService.updateEvent(updateEventDto, req.user.id);
  }

  @Get()
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

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any): Promise<void> {
    return this.eventService.removeByDateAndPatient(id, req.user.id);
  }
}
