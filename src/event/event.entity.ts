import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  id: number;

  @Column({ nullable: false })
  patientId: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  event: string;
}
