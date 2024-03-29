import { ChatMessage } from 'src/chat/chat-message.entity';
import { ROOM_STATUS } from 'src/constants/room.constant';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne, OneToMany, JoinTable } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => User, (user) => user.rooms)
  // @JoinColumn({ name: 'user_id' })
  host: User;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.room)
  @JoinTable()
  messages: ChatMessage[];

  @Column({ enum: [ROOM_STATUS.WAITING, ROOM_STATUS.IN_PROGRESS, ROOM_STATUS.CLOSED], default: ROOM_STATUS.WAITING })
  status: string;

  @Column({
    nullable: true,
  })
  startDate: Date;

  @Column({
    nullable: true,
  })
  endDate: Date;

  @CreateDateColumn()
  createdDate: Date;
}
