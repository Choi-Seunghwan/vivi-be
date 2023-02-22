import { Room } from 'src/rooms/room.entity';
import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CHAT_MESSAGE_TYPE, CHAT_MESSAGE_TYPE_NORMAL } from './chat.constant';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  message: string;

  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: false, default: CHAT_MESSAGE_TYPE_NORMAL })
  type: CHAT_MESSAGE_TYPE;
}
