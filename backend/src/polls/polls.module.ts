import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption])],
  providers: [PollsService],
  controllers: [PollsController],
})
export class PollsModule {}
