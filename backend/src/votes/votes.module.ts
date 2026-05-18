import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { Poll } from '../polls/poll.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll])],
  providers: [VotesService],
  controllers: [VotesController],
})
export class VotesModule {}
