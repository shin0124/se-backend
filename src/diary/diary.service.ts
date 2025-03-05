import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    private readonly minioClientService: MinioClientService,
    private readonly patientService: PatientService,
  ) {}

  async create(createDiaryDto: CreateDiaryDto, patientId): Promise<Diary> {
    const existingDiary = await this.diaryRepository.findOne({
      where: {
        patientId,
        date: createDiaryDto.date,
      },
    });

    if (existingDiary) {
      throw new NotFoundException(
        `Diary entry for patient ID ${patientId} on date ${createDiaryDto.date} already exists`,
      );
    }

    // Convert food array to individual boolean fields
    const foodItems = createDiaryDto.food || [];
    const foodBooleans = this.mapFoodArrayToBooleans(foodItems);

    const diary = this.diaryRepository.create({
      ...createDiaryDto,
      patientId,
      ...foodBooleans, // Spread food boolean properties
    });

    const savedDiary = await this.diaryRepository.save(diary);
    return this.transformDiary(savedDiary); // Ensure transformed output
  }

  async findAll(): Promise<Array<Diary & { food: boolean[] }>> {
    const diaries = await this.diaryRepository.find();
    return diaries.map(this.transformDiary.bind(this));
  }
  async findByDate(
    date: string,
    token: string,
  ): Promise<Array<Diary & { food: boolean[] }>> {
    const diaries = await this.diaryRepository.find({
      where: { date },
    });

    if (!diaries || diaries.length === 0) {
      throw new NotFoundException(`No diary entries found for date ${date}`);
    }

    const diariesWithPatientName = await Promise.all(
      diaries.map(async (diary) => {
        const patient = await this.patientService.findOneByCitizenID(
          diary.patientId,
          token,
        );

        const patientName = patient.name;

        return {
          ...diary,
          patientName,
        };
      }),
    );

    return diariesWithPatientName.map((diary) => this.transformDiary(diary));
  }

  async findByPatientId(
    patientId: string,
    token: string,
  ): Promise<Array<Diary & { food: boolean[] }>> {
    const diaries = await this.diaryRepository.find({
      where: { patientId },
    });

    if (!diaries || diaries.length === 0) {
      throw new NotFoundException(
        `No diary entries found for patient ID ${patientId}`,
      );
    }

    const diariesWithPatientName = await Promise.all(
      diaries.map(async (diary) => {
        const patient = await this.patientService.findOneByCitizenID(
          diary.patientId,
          token,
        );

        const patientName = patient.name;
        const patientAge = patient.age;
        const patientHN = patient.HN;

        return {
          ...diary,
          patientName,
          patientAge,
          patientHN,
        };
      }),
    );

    return diariesWithPatientName.map(this.transformDiary.bind(this));
  }

  async findById(
    id: number,
    citizenID: string,
    role: string,
  ): Promise<Diary & { food: boolean[] }> {
    const diary = await this.diaryRepository.findOne({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException(`No diary entries found`);
    }

    if (role !== 'doctor' && diary.patientId !== citizenID) {
      throw new ForbiddenException('Access denied');
    }

    return this.transformDiary(diary);
  }

  async findOne(
    patientId: string,
    date: string,
  ): Promise<Diary & { food: boolean[] }> {
    const diary = await this.diaryRepository.findOne({
      where: { patientId, date },
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
    patientId: string,
  ): Promise<Diary> {
    const existingDiary = await this.diaryRepository.findOne({ where: { id } });

    if (!existingDiary) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }

    if (existingDiary.patientId !== patientId) {
      throw new ForbiddenException('Access denied');
    }

    const foodItems = updateDiaryDto.food || [];
    const foodBooleans = this.mapFoodArrayToBooleans(foodItems);

    this.diaryRepository.merge(existingDiary, updateDiaryDto, foodBooleans);
    const updatedDiary = await this.diaryRepository.save({
      patientId,
      ...existingDiary,
    });
    return this.transformDiary(updatedDiary);
  }

  async remove(id: number, patientId: string): Promise<void> {
    // Fetch the diary entry to ensure it exists and belongs to the patient
    const existingDiary = await this.diaryRepository.findOne({
      where: { id },
    });

    if (!existingDiary) {
      throw new NotFoundException(`Diary with ID ${id} not found`);
    }

    if (existingDiary.patientId !== patientId) {
      throw new ForbiddenException('Access denied');
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
