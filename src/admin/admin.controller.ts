import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { UserAccept } from 'src/common/users/users.entity';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
