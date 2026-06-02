import { Controller, Get, UseGuards, Request, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "./user.entity";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @Get("me")
  async getProfile(@Request() req: any) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } });
    const { password, ...result } = user;
    return result;
  }

  @Get("make-admin/:email")
  async makeAdmin(@Param("email") email: string) {
    await this.userRepo.update({ email }, { role: UserRole.ADMIN });
    return { message: "Done" };
  }
}
