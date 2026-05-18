import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn,
} from 'typeorm';
import { Poll } from '../polls/poll.entity';
import { Vote } from '../votes/vote.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  state: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Poll, (poll) => poll.createdBy)
  polls: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
