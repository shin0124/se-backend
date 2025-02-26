import { Patient } from '../patient/patient.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Consult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.consults)
  patient: Patient;

  @Column()
  consultId: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  reply: string;
}
