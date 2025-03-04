import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  id: number;

  @Column({ nullable: false })
  patientId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  activity: string;

  @Column()
  symptom: string;

  @Column({ nullable: true })
  symptomPic: string;

  @Column({ type: 'int' })
  painScore: number;

  @Column({ nullable: true })
  breakfast: string;

  @Column({ nullable: true })
  breakfastPic: string;

  @Column({ nullable: true })
  lunch: string;

  @Column({ nullable: true })
  lunchPic: string;

  @Column({ nullable: true })
  dinner: string;

  @Column({ nullable: true })
  dinnerPic: string;

  @Column({ nullable: true })
  tea: boolean;

  @Column({ nullable: true })
  coffee: boolean;

  @Column({ nullable: true })
  coldWater: boolean;

  @Column({ nullable: true })
  cigarettes: boolean;

  @Column({ nullable: true })
  alcohol: boolean;

  @Column({ nullable: true })
  beer: boolean;

  @Column({ nullable: true })
  stickyRice: boolean;

  @Column({ nullable: true })
  fermentedFoods: boolean;

  @Column({ nullable: true })
  chickenEggs: boolean;

  @Column({ nullable: true })
  saltedFish: boolean;

  @Column({ nullable: true })
  fermentedFish: boolean;

  @Column({ nullable: true })
  chicken: boolean;

  @Column({ nullable: true })
  pork: boolean;

  @Column({ nullable: true })
  beef: boolean;

  @Column({ nullable: true })
  scalelessFish: boolean;

  @Column({ nullable: true })
  animalOrgans: boolean;

  @Column({ nullable: true })
  seafood: boolean;

  @Column({ nullable: true })
  noodles: boolean;

  @Column({ nullable: true })
  processedFoods: boolean;

  @Column({ nullable: true })
  instantNoodles: boolean;

  @Column({ nullable: true })
  cannedFish: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value) => value,
      from: (value) =>
        new Date(value).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    },
  }) // Create timestamp columns with GMT+7
  createdAt: string;

  @Column({ type: 'boolean', default: false }) // Create a new column isRead for the read status
  isRead: boolean;
}
