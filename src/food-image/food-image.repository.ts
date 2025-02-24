import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FoodImage } from './food-image.entity';

@Injectable()
export class FoodImageRepository extends Repository<FoodImage> {
  constructor(private dataSource: DataSource) {
    super(FoodImage, dataSource.createEntityManager());
  }

  // Add custom repository methods here if needed
}
