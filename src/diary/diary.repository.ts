import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Diary } from './diary.entity';

@Injectable()
export class DiaryRepository extends Repository<Diary> {
  constructor(private dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }
}
