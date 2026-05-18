import {
  Controller, Post, Get, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from './votes.service';

@Controller('votes')
@UseGuards(AuthGuard('jwt'))
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post()
  castVote(
    @Body() body: { pollId: string; optionId: string },
    @Request() req: any,
  ) {
    return this.votesService.castVote(
      req.user.id,
      body.pollId,
      body.optionId,
      req.user.state ?? 'Unknown',
    );
  }

  @Get('poll/:pollId/my-vote')
  getMyVote(@Param('pollId') pollId: string, @Request() req: any) {
    return this.votesService.getUserVote(req.user.id, pollId);
  }
}
