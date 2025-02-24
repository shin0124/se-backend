import {
  Controller,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Logger,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFoodImageDto } from './dto/create-food-image.dto';
import { UpdateFoodImageDto } from './dto/update-food-image.dto';
import { FoodImageService } from './food-image.service';

@Controller('food-images')
export class FoodImageController {
  private readonly logger = new Logger(FoodImageController.name);

  constructor(private readonly foodImageService: FoodImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFoodImage(
    @Body() createFoodImageDto: CreateFoodImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const foodImage = await this.foodImageService.createFoodImage(
        createFoodImageDto,
        file,
      );
      return foodImage;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Patch(':id')
  async updateFoodImage(
    @Param('id') id: number,
    @Body() updateFoodImageDto: UpdateFoodImageDto,
  ) {
    try {
      const foodImage = await this.foodImageService.updateFoodImage(
        id,
        updateFoodImageDto,
      );
      return foodImage;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Delete(':diaryId/:mealType/:foodImageId')
  async deleteFoodImage(
    @Param('diaryId') diaryId: number,
    @Param('mealType') mealType: number,
    @Param('foodImageId') foodImageId: number,
  ) {
    return this.foodImageService.deleteFoodImage(
      diaryId,
      mealType,
      foodImageId,
    );
  }

  @Get(':diaryId')
  async getFoodImages(@Param('diaryId') diaryId: number) {
    return this.foodImageService.getFoodImages(diaryId);
  }
}
