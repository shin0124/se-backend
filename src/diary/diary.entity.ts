import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../patient/patient.entity'; // Import Patient
import { Image } from 'src/image/image.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.diaries) // ManyToOne to Patient
  @JoinColumn({ name: 'patientId' }) // Specify the foreign key column name
  patient: Patient;

  @Column({ type: 'date' })
  date: string;

  @Column()
  symptom: string;

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

  @OneToMany(() => Image, (image) => image.diary, { eager: true })
  image: Image[];
}
