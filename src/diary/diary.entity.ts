import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SymtomPic } from '../symtom-pic/symtom-pic.entity';
import { Patient } from '../patient/patient.entity'; // Import Patient

@Entity()
export class Diary {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.diaries) // ManyToOne to Patient
  @JoinColumn({ name: 'patientId' }) // Specify the foreign key column name
  patient: Patient;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  activity: string;

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Create timestamp columns
  createdAt: string;

  @Column({ type: 'boolean', default: false }) // Create a new column isRead for the read status
  isRead: boolean;

  @OneToMany(() => SymtomPic, (symtomPic) => symtomPic.diary)
  symptomPic: SymtomPic[];
}
