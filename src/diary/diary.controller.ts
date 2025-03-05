import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { EncryptionService } from 'src/encryption/encryption.service';

@Controller('diaries')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post('create')
  create(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<Diary> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.create(createDiaryDto, citizenID);
  }

  @Get('all')
  findAll(@Headers('X-Role') encryptedRole: string): Promise<Diary[]> {
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'doctor') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.findAll();
  }

  @Get('details/:diaryId')
  findById(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<Diary> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    return this.diaryService.findById(diaryId, citizenID, role);
  }

  @Get('by-patient')
  findByPatientId(
    @Headers('X-Token') token: string,
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
  ): Promise<(Diary & { food: boolean[] })[]> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.findByPatientId(citizenID, token);
  }

  @Get('by-date/:date')
  findByDate(
    @Headers('X-Role') encryptedRole: string,
    @Headers('X-Token') token: string,
    @Param('date') date: string,
  ): Promise<Diary[]> {
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'doctor') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.findByDate(date, token);
  }

  @Get('by-month')
  async getEventsByMonthAndPatientID(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<Diary[]> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.getDiariesByMonthAndPatientID(
      citizenID,
      month,
      year,
    );
  }

  @Get('entry/:date')
  findOne(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('date') date: string,
  ): Promise<Diary> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.findOne(citizenID, date);
  }

  @Patch('update/:diaryId')
  update(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ): Promise<Diary> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.update(diaryId, updateDiaryDto, citizenID);
  }

  @Delete('delete/:diaryId')
  remove(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<void> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.diaryService.remove(diaryId, citizenID);
  }

  @Get('pain-data')
  async getMonthlyAveragePainScores(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
  ): Promise<{ month: string; averagePain: number }[]> {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    const patientId = citizenID;
    return this.diaryService.getAllTimeMonthlyAveragePainScores(patientId);
  }
}
