import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryColumn()
  email: string;

  @Column({ nullable: false })
  password: string;
}
