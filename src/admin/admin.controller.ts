import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { UserAccept } from 'src/common/users/users.entity';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 모든 유저 조회
  @Get('users')
  @ApiOperation({ summary: '모든 유저 조회' })
  async getUsers(@Req() req: Request) {
    const users = await this.adminService.getAllUsers();
    return { users };
  }

  // 유저 권한 승인
  @Patch('users/:id/accept-status')
  async updateUserAcceptStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Body('status') status: string,
  ) {
    if (status !== UserAccept.ACCEPT && status !== UserAccept.REJECT) {
      throw new Error(
        '유효하지 않은 상태 값입니다. accept 또는 reject만 가능합니다.',
      );
    }

    const updatedUser = await this.adminService.updateUserAcceptStatus(
      userId,
      status as UserAccept.ACCEPT | UserAccept.REJECT,
    );

    return {
      message: `유저 acceptStatus가 ${status}로 변경되었습니다.`,
      user: updatedUser,
    };
  }
}
