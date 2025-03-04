import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  specialization: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ default: null })
  otpSecret: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires: Date;

  @Column({ default: 'doctor' })
  role: string;

  @Column({
    default:
      'https://res.cloudinary.com/diuj00bqm/image/upload/v1740391695/doctor_vbokxn.jpg',
  })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
