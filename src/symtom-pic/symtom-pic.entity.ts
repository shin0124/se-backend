import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Diary } from '../diary/diary.entity';

@Entity()
export class SymtomPic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  symptomPic: string;

  @ManyToOne(() => Diary, (diary) => diary.symptomPic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diaryId' }) // Specify the foreign key column name
  diary: Diary;
}
