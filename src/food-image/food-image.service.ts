import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service'; // Minio client service
import { FoodImage } from './food-image.entity'; // Assuming you have the FoodImage entity
import { FoodImageRepository } from './food-image.repository'; // Your repository
import { CreateFoodImageDto } from './dto/create-food-image.dto'; // DTO for creating FoodImage
import { UpdateFoodImageDto } from './dto/update-food-image.dto'; // DTO for updating FoodImage
import { DiaryRepository } from '../diary/diary.repository'; // Assuming you have the Diary repository
import { AppMimeType, BufferedFile } from 'src/minio-client/file.model';
import * as path from 'path';

@Injectable()
export class FoodImageService {
  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly foodImageRepository: FoodImageRepository,
    private readonly diaryRepository: DiaryRepository, // To access Diary entity
  ) {}

  async createFoodImage(
    createFoodImageDto: CreateFoodImageDto,
    file: Express.Multer.File,
  ): Promise<FoodImage> {
    const diary = await this.diaryRepository.findOne({
      where: { id: createFoodImageDto.diaryId },
    });

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    const { mealType } = createFoodImageDto;
    const fileType = path.extname(file.originalname).substring(1); // Extract file extension
    const pathKey = `${diary.id}/${mealType}`;

    const bufferedFile: BufferedFile = {
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype as AppMimeType,
      fieldname: file.fieldname,
      size: file.size,
      encoding: '',
    };

    const foodImage = this.foodImageRepository.create({
      diary,
      mealType,
      type: fileType, // Assign extracted file type
      createdAt: new Date(),
    });

    await this.foodImageRepository.save(foodImage);

    await this.minioClientService.upload(
      bufferedFile,
      String(foodImage.id),
      pathKey,
    );

    return foodImage;
  }

  async updateFoodImage(
    foodImageId: number,
    updateFoodImageDto: UpdateFoodImageDto,
  ): Promise<FoodImage> {
    // Find the FoodImage by ID using the correct options
    const foodImage = await this.foodImageRepository.findOne({
      where: { id: foodImageId }, // Use `where` for options
    });

    if (!foodImage) {
      throw new HttpException('Food Image not found', HttpStatus.NOT_FOUND);
    }

    // Merge the updated properties
    const updatedFoodImage = Object.assign(foodImage, updateFoodImageDto);
    await this.foodImageRepository.save(updatedFoodImage);

    return updatedFoodImage;
  }

  async deleteFoodImage(
    diaryId: number,
    mealType: number,
    foodImageId: number,
  ) {
    // Find the food image
    const foodImage = await this.foodImageRepository.findOne({
      where: { diary: { id: diaryId }, mealType, id: foodImageId },
    });

    if (!foodImage) {
      throw new HttpException('Food image not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Delete file from MinIO
      await this.minioClientService.delete(
        `${foodImageId}.${foodImage.type}`,
        `${diaryId}/${mealType}`,
      );

      // Delete image record from database
      await this.foodImageRepository.remove(foodImage);

      return { message: 'Food image deleted successfully' };
    } catch (err) {
      throw new HttpException(
        `Error deleting food image from MinIO: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFoodImages(diaryId: number) {
    const foodImages = await this.foodImageRepository.find({
      where: { diary: { id: diaryId } },
    });

    if (foodImages.length === 0) {
      throw new HttpException(
        'No food images found for the given diary',
        HttpStatus.NOT_FOUND,
      );
    }

    // Map each food image to its URL
    const foodImagesWithUrls = await Promise.all(
      foodImages.map(async (image) => {
        const filePath = `${diaryId}/${image.mealType}/${image.id}.${image.type}`;
        const url = await this.minioClientService.getUrl(filePath);
        return {
          id: image.id,
          mealType: image.mealType,
          url,
        };
      }),
    );

    return foodImagesWithUrls;
  }
}
