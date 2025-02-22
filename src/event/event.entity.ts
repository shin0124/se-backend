import { Patient } from 'src/patient/patient.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.events)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'date' })
  date: string;

  @Column()
  event: string;
}
