import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Diary } from '../diary/diary.entity';

@Entity()
export class FoodImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Diary, (diary) => diary.foodImage)
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @Column()
  mealType: number; // '0: breakfast', '1: lunch', '2: dinner'

  @Column()
  type: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
