import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Poll, PollStatus } from '../polls/poll.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
  ) {}

  async castVote(
    userId: string,
    pollId: string,
    optionId: string,
    state: string,
  ) {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) throw new BadRequestException('Poll not found');
    if (poll.status === PollStatus.CLOSED)
      throw new BadRequestException('This poll is closed');

    const existing = await this.voteRepo.findOne({
      where: { user: { id: userId }, poll: { id: pollId } },
    });
    if (existing) throw new ConflictException('You have already voted on this poll');

    const vote = this.voteRepo.create({
      user: { id: userId },
      poll: { id: pollId },
      option: { id: optionId },
      state,
    });
    return this.voteRepo.save(vote);
  }

  async getUserVote(userId: string, pollId: string) {
    return this.voteRepo.findOne({
      where: { user: { id: userId }, poll: { id: pollId } },
      relations: ['option'],
    });
  }
}
