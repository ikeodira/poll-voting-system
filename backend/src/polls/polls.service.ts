import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll, PollStatus } from './poll.entity';
import { PollOption } from './poll-option.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(PollOption) private optionRepo: Repository<PollOption>,
  ) {}

  async findAll() {
    return this.pollRepo.find({
      relations: ['createdBy', 'options'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const poll = await this.pollRepo.findOne({
      where: { id },
      relations: ['createdBy', 'options'],
    });
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  async create(
    dto: { title: string; description: string; options: string[] },
    userId: string,
  ) {
    const poll = this.pollRepo.create({
      title: dto.title,
      description: dto.description,
      createdBy: { id: userId },
    });
    const saved = await this.pollRepo.save(poll);
    const opts = dto.options.map((text) =>
      this.optionRepo.create({ optionText: text, poll: saved }),
    );
    await this.optionRepo.save(opts);
    return this.findOne(saved.id);
  }

  async update(
    id: string,
    dto: Partial<{ title: string; description: string; status: PollStatus }>,
  ) {
    await this.pollRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.pollRepo.delete(id);
    return { message: 'Poll deleted' };
  }

  async getResults(pollId: string, state?: string) {
    await this.findOne(pollId); // validate exists

    const qb = this.optionRepo
      .createQueryBuilder('option')
      .leftJoin('option.votes', 'vote', state ? 'vote.state = :state' : '1=1', state ? { state } : {})
      .where('option.pollId = :pollId', { pollId })
      .select([
        'option.id AS "optionId"',
        'option.optionText AS "optionText"',
        'COUNT(vote.id) AS "voteCount"',
      ])
      .groupBy('option.id')
      .orderBy('option.id');

    return qb.getRawMany();
  }
}
