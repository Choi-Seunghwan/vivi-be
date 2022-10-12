import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: String;

  @Column({ nullable: false })
  host: User;

  @Column({
    nullable: true,
  })
  startDate: Date;

  @Column({
    nullable: true,
  })
  endDate: Date;

  @Column({ default: () => Date.now() })
  creationDate: Date;
}
