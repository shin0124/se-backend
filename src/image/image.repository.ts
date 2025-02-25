import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  // Add custom repository methods here if needed
}
