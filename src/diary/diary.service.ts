import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { PatientService } from 'src/patient/patient.service';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    private patientsService: PatientService, // Inject Patient service
    private readonly minioClientService: MinioClientService,
  ) {}

  async create(createDiaryDto: CreateDiaryDto, patientId): Promise<Diary> {
    const existingDiary = await this.diaryRepository.findOne({
      where: {
        patient: { id: patientId },
        date: createDiaryDto.date,
      },
    });

    if (existingDiary) {
      throw new NotFoundException(
        `Diary entry for patient ID ${patientId} on date ${createDiaryDto.date} already exists`,
      );
    }

    const patient = await this.patientsService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    // Convert food array to individual boolean fields
    const foodItems = createDiaryDto.food || [];
    const foodBooleans = this.mapFoodArrayToBooleans(foodItems);

    const diary = this.diaryRepository.create({
      ...createDiaryDto,
      patient: patient,
      ...foodBooleans, // Spread food boolean properties
    });

    const savedDiary = await this.diaryRepository.save(diary);
    return this.transformDiary(savedDiary); // Ensure transformed output
  }

  async findAll(): Promise<Array<Diary & { food: boolean[] }>> {
    const diaries = await this.diaryRepository.find({
      relations: ['patient'],
    });
    return diaries.map(this.transformDiary.bind(this));
  }

  async findByDate(date: string): Promise<Array<Diary & { food: boolean[] }>> {
    const diaries = await this.diaryRepository.find({
      where: { date },
      relations: ['patient'],
    });

    if (!diaries || diaries.length === 0) {
      throw new NotFoundException(`No diary entries found for date ${date}`);
    }

    return diaries.map((diary) => this.transformDiary(diary)); // Ensure mapping is correct
  }

  async findByID(id: number, patientId): Promise<Diary & { food: boolean[] }> {
    const diary = await this.diaryRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!diary) {
      throw new NotFoundException(`No diary entries found`);
    }

    if (patientId !== diary.patient.id) {
      throw new NotFoundException(
        "You are not authorized to access this patient's diary.",
      );
    }

    return this.transformDiary(diary);
  }

  async findOne(
    patientId: string,
    date: string,
  ): Promise<Diary & { food: boolean[] }> {
    const diary = await this.diaryRepository.findOne({
      where: { patient: { id: patientId }, date },
      relations: ['patient'],
    });

    if (!diary) {
      throw new NotFoundException(
        `No diary entry found for patient ID ${patientId} on ${date}`,
      );
    }

    return this.transformDiary(diary); // Use the transformation function
  }

  async update(
    id: number,
    updateDiaryDto: UpdateDiaryDto,
    patientId,
  ): Promise<Diary> {
    const existingDiary = await this.diaryRepository.findOne({ where: { id } });
    if (!existingDiary || !existingDiary.patient) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
    if (patientId !== existingDiary.patient.id) {
      throw new NotFoundException(
        "You are not authorized to access this patient's diary.",
      );
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

    // Convert food array to individual boolean fields
    const foodItems = updateDiaryDto.food || [];
    const foodBooleans = this.mapFoodArrayToBooleans(foodItems);

    this.diaryRepository.merge(existingDiary, updateDiaryDto, foodBooleans);
    const updatedDiary = await this.diaryRepository.save(existingDiary);
    return this.transformDiary(updatedDiary);
  }

  async remove(id: number, patientId: string): Promise<void> {
    // Fetch the diary entry to ensure it exists and belongs to the patient
    const existingDiary = await this.diaryRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!existingDiary || ! existingDiary.patient) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }

    if (existingDiary.patient.id !== patientId) {
      throw new NotFoundException(
        "You are not authorized to access this patient's diary.",
      );
    }

    // List all images in the diary folder
    const folderPath = `${id}/`;
    const imagePaths = await this.minioClientService.listFiles(folderPath);

    // Delete all images in the diary folder
    for (const imagePath of imagePaths) {
      await this.minioClientService.delete(imagePath, '');
    }

    // Proceed with deleting the diary entry
    const result = await this.diaryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }
  }

  private mapFoodArrayToBooleans(foodArray: boolean[]): Partial<Diary> {
    const foodKeys: (keyof Diary)[] = [
      'tea',
      'coffee',
      'coldWater',
      'cigarettes',
      'alcohol',
      'beer',
      'stickyRice',
      'fermentedFoods',
      'chickenEggs',
      'saltedFish',
      'fermentedFish',
      'chicken',
      'pork',
      'beef',
      'scalelessFish',
      'animalOrgans',
      'seafood',
      'noodles',
      'processedFoods',
      'instantNoodles',
      'cannedFish',
    ];

    const foodMap: Record<string, boolean> = {};

    foodKeys.forEach((key, index) => {
      foodMap[key] = foodArray[index] ?? false; // Default to false if missing
    });

    return foodMap;
  }

  private mapBooleansToFoodArray(diary: Diary): boolean[] {
    const foodKeys: (keyof Diary)[] = [
      'tea',
      'coffee',
      'coldWater',
      'cigarettes',
      'alcohol',
      'beer',
      'stickyRice',
      'fermentedFoods',
      'chickenEggs',
      'saltedFish',
      'fermentedFish',
      'chicken',
      'pork',
      'beef',
      'scalelessFish',
      'animalOrgans',
      'seafood',
      'noodles',
      'processedFoods',
      'instantNoodles',
      'cannedFish',
    ];

    return foodKeys.map((key) => (diary[key] as boolean) ?? false);
  }

  private transformDiary(diary: Diary): Diary & { food: boolean[] } {
    return {
      ...diary,
      food: this.mapBooleansToFoodArray(diary), // Add food array
    } as Diary & { food: boolean[] }; // Explicitly define return type
  }
}
