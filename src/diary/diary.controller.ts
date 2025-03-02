import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from 'src/patientAuth/jwt-auth.guard';

@Controller('diaries')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post('create')
  create(
    @Body() createDiaryDto: CreateDiaryDto,
    @Req() req: any,
  ): Promise<Diary> {
    return this.diaryService.create(createDiaryDto, req.user.id);
  }

  @Get('all')
  findAll(@Req() req: any): Promise<Diary[]> {
    return this.diaryService.findAll(); // Send user id to service
  }

  @Get('details/:id')
  findByID(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Diary> {
    return this.diaryService.findByID(id, req.user.id); // Send user id to service
  }

  @Get('by-date/:date')
  findByDate(@Param('date') date: string, @Req() req: any): Promise<Diary[]> {
    return this.diaryService.findByDate(date); // Send user id to service
  }

  @Get('entry/:date')
  findOne(@Param('date') date: string, @Req() req: any): Promise<Diary> {
    return this.diaryService.findOne(req.user.id, date); // Send user id to service
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
    @Req() req: any,
  ): Promise<Diary> {
    updateDiaryDto.patientId = req.user.id; // Ensure the update belongs to the logged-in user
    return this.diaryService.update(id, updateDiaryDto, req.user.id); // Send user id to service
  }

  @Delete('delete/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<void> {
    return this.diaryService.remove(id, req.user.id); // Send user id to service
  }
}
