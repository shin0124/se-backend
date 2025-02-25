import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Diary } from '../diary/diary.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Diary, (diary) => diary.image)
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @Column()
  label: string;

  @Column()
  type: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
