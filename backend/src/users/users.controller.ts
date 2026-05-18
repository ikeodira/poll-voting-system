import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } });
    const { password, ...result } = user;
    return result;
  }
}
