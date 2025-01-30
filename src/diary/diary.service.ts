import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { UpdateDiaryDto } from './dto/create-diary.dto';
import { CreateDiaryDto } from './dto/update-diary.dto';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    private patientsService: PatientService, // Inject Patient service
  ) {}

  async create(createDiaryDto: CreateDiaryDto): Promise<Diary> {
    const patient = await this.patientsService.findOne(
      createDiaryDto.patientId,
    );
    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createDiaryDto.patientId} not found`,
      );
    }

    const diary = this.diaryRepository.create({
      ...createDiaryDto,
      patient: patient,
    });
    return this.diaryRepository.save(diary);
  }

  async findAll(): Promise<Diary[]> {
    return this.diaryRepository.find({ relations: ['patient', 'symptomPic'] }); // Load relations
  }

  async findOne(patientId: number, date: string): Promise<Diary> {
    const diaries = await this.diaryRepository.find({
      where: {
        patient: { id: patientId },
        date,
      },
      relations: ['patient', 'symptomPic'], // Load relations
    });

    if (!diaries || diaries.length === 0) {
      throw new NotFoundException(
        `No diary entries found for patient ID ${patientId} on date ${date}`,
      );
    }

    return diaries[0];
  }

  async update(id: number, updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    const existingDiary = await this.diaryRepository.findOne({ where: { id } });
    if (!existingDiary) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }

    if (updateDiaryDto.patientId) {
      const patient = await this.patientsService.findOne(
        updateDiaryDto.patientId,
      );
      if (!patient) {
        throw new NotFoundException(
          `Patient with ID ${updateDiaryDto.patientId} not found`,
        );
      }
      existingDiary.patient = patient;
    }

    this.diaryRepository.merge(existingDiary, updateDiaryDto);
    return this.diaryRepository.save(existingDiary);
  }

  async remove(id: number): Promise<void> {
    const result = await this.diaryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
  }
}
