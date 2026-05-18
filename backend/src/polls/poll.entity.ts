import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { PollOption } from './poll-option.entity';
import { Vote } from '../votes/vote.entity';

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: PollStatus, default: PollStatus.ACTIVE })
  status: PollStatus;

  @ManyToOne(() => User, (user) => user.polls, { eager: false })
  createdBy: User;

  @OneToMany(() => PollOption, (option) => option.poll, {
    cascade: true,
    eager: true,
  })
  options: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
