import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Consult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  patientId: string;

  @Column()
  consultId: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  reply: string;
}
