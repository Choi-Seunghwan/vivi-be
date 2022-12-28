import { Room } from 'src/rooms/room.entity';
import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  message: string;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;

  @CreateDateColumn()
  createdDate: Date;
}
