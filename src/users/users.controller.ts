import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { RequestUser } from 'src/common/types/request-user.type';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user: RequestUser) {
    console.log(user);
    return user;
  }
}
