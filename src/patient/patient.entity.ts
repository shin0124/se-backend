import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Diary } from '../diary/diary.entity';
import { Event } from '../event/event.entity';
import { Consult } from '../consult/consult.entity';

@Entity()
export class Patient {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  age: number;

  @OneToMany(() => Diary, (diary) => diary.patient)
  diaries: Diary[];

  @OneToMany(() => Event, (event) => event.patient)
  events: Event[];

  @OneToMany(() => Consult, (consult) => consult.patient)
  consults: Consult[];
}
