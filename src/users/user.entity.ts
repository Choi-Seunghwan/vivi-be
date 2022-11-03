import { Room } from 'src/rooms/room.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(() => Room, (room) => room.host)
  rooms: Room[];
}
