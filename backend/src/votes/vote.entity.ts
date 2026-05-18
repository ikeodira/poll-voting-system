import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../polls/poll-option.entity';

@Entity('votes')
@Unique(['user', 'poll']) // one vote per user per poll
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Poll, (poll) => poll.votes)
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes)
  option: PollOption;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;
}
