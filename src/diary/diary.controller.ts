import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { UpdateDiaryDto } from './dto/create-diary.dto';
import { CreateDiaryDto } from './dto/update-diary.dto';

@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto): Promise<Diary> {
    return this.diaryService.create(createDiaryDto);
  }

  @Get()
  findAll(): Promise<Diary[]> {
    return this.diaryService.findAll();
  }

  @Get(':patientId/:date')
  findOne(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('date') date: string,
  ): Promise<Diary> {
    return this.diaryService.findOne(patientId, date);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ): Promise<Diary> {
    return this.diaryService.update(id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.diaryService.remove(id);
  }
}
