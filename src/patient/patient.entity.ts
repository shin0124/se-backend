import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Diary } from '../diary/diary.entity';
import { Consult } from '../consult/consult.entity';

@Entity()
export class Patient {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  citizenID: string;

  @OneToMany(() => Diary, (diary) => diary.patient)
  diaries: Diary[];

  @OneToMany(() => Consult, (consult) => consult.patient)
  consults: Consult[];
}
