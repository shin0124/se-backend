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
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DoctorRoleGuard } from 'src/auth/guard/doctor-auth.guard';
import { DiaryGuard } from 'src/auth/guard/diary-auth.guard';
import { PatientOwnDiaryGuard } from 'src/auth/guard/diary-patient-auth.guard';
import { PatientRoleGuard } from 'src/auth/guard/patient-auth.guard';

@Controller('diaries')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post('create')
  @UseGuards(PatientRoleGuard)
  create(
    @Body() createDiaryDto: CreateDiaryDto,
    @Req() req: any,
  ): Promise<Diary> {
    return this.diaryService.create(createDiaryDto, req.user.id);
  }

  @Get('all')
  @UseGuards(DoctorRoleGuard)
  findAll(): Promise<Diary[]> {
    return this.diaryService.findAll();
  }

  @Get('details/:diaryId')
  @UseGuards(DiaryGuard)
  findById(@Param('diaryId', ParseIntPipe) diaryId: number): Promise<Diary> {
    return this.diaryService.findById(diaryId);
  }

  @Get('by-patient')
  @UseGuards(PatientRoleGuard)
  findByPatientId(@Req() req: any): Promise<(Diary & { food: boolean[] })[]> {
    return this.diaryService.findByPatientId(req.user.id);
  }

  @Get('by-date/:date')
  @UseGuards(DoctorRoleGuard)
  findByDate(@Param('date') date: string): Promise<Diary[]> {
    return this.diaryService.findByDate(date);
  }

  @Get('by-month')
  @UseGuards(PatientRoleGuard)
  async getEventsByMonthAndPatientID(
    @Query('month') month: number,
    @Query('year') year: number,
    @Req() req: any,
  ): Promise<Diary[]> {
    return this.diaryService.getDiariesByMonthAndPatientID(
      req.user.id,
      month,
      year,
    );
  }

  @Get('entry/:date')
  @UseGuards(PatientRoleGuard)
  findOne(@Param('date') date: string, @Req() req: any): Promise<Diary> {
    return this.diaryService.findOne(req.user.id, date);
  }

  @Patch('update/:diaryId')
  @UseGuards(PatientOwnDiaryGuard)
  update(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
    @Req() req: any,
  ): Promise<Diary> {
    updateDiaryDto.patientId = req.user.id;
    return this.diaryService.update(diaryId, updateDiaryDto);
  }

  @Delete('delete/:diaryId')
  @UseGuards(PatientOwnDiaryGuard)
  remove(@Param('diaryId', ParseIntPipe) diaryId: number): Promise<void> {
    return this.diaryService.remove(diaryId);
  }

  @Get('pain-data')
  @UseGuards(PatientRoleGuard)
  async getMonthlyAveragePainScores(
    @Req() req: any,
  ): Promise<{ month: string; averagePain: number }[]> {
    const patientId = req.user.id;
    return this.diaryService.getAllTimeMonthlyAveragePainScores(patientId);
  }
}
