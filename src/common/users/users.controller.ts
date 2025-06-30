import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from './users.entity';
import { UserProfileResponseDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 유저 프로필
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 조회' })
  @ApiOkResponse({ type: UserProfileResponseDto })
  async getProfile(@Req() req: Request) {
    const userId = req.user['id'];
    const { user, extraInfo } = await this.usersService.findDataByRole(userId);

    return {
      ...user,
      extraInfo,
    };
  }
}
