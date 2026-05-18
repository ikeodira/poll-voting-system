import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from '../votes/vote.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  optionText: string;

  @ManyToOne(() => Poll, (poll) => poll.options, { onDelete: 'CASCADE' })
  poll: Poll;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];
}
