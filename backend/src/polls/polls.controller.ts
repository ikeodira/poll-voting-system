import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PollsService } from './polls.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PollStatus } from './poll.entity';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Get(':id/results')
  getResults(@Param('id') id: string, @Query('state') state?: string) {
    return this.pollsService.getResults(id, state);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(
    @Body() body: { title: string; description: string; options: string[] },
    @Request() req: any,
  ) {
    return this.pollsService.create(body, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description: string; status: PollStatus }>,
  ) {
    return this.pollsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}
