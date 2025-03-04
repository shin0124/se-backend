import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['citizenID'])
export class Patient {
  @PrimaryGeneratedColumn() // Use a generated ID as the primary key
  _id: number;

  @Column()
  citizenID: string;

  @Column()
  HN: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  birthDate: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  emergencyContact: string;

  @Column()
  relationship: string;

  @Column()
  bloodType: string;

  @Column()
  occupation: string;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  chronicDisease: string;

  @Column()
  allergicFood: string;

  @Column()
  allergicMedicine: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  imageUrl: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value) => value,
      from: (value) =>
        new Date(value).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    },
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP', // Ensures it updates on every update
    transformer: {
      to: (value) => value,
      from: (value) =>
        new Date(value).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    },
  })
  updatedAt: string; // Initialize to current timestamp as default
}
