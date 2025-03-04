// import { Chat } from 'src/chat/chat.entity';
// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'text' })
//   text: string;

//   @Column()
//   user: string;

//   @ManyToOne(() => Chat, (chat) => chat.id)
//   @JoinColumn()
//   chatId: number;

//   @Column()
//   timestamp: string;

//   @Column({ nullable: true })
//   replyTo?: number | null;
// }
