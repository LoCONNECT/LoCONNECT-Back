import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { KeepService } from './keep.service';
import { AuthRequest } from '../auth/auth.interface';
import { Keep } from './keep.entity';

@Controller('keep')
@UseGuards(JwtAuthGuard)
export class KeepController {
  constructor(private readonly keepService: KeepService) {}

  // 찜 기능
  @Post(':targetId')
  async toggleKeep(
    @Param('targetId') targetId: number,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    const { keeped } = await this.keepService.toggleKeep(userId, targetId);
    return {
      ok: true,
      keeped,
    };
  }

  // 찜 내역 확인
  @Get()
  async keeps(@Req() req: AuthRequest): Promise<{ keeps: Keep[] }> {
    const userId = req.user.id;
    const { keeps } = await this.keepService.findKeepsByUser(userId);
    return { keeps };
  }
}
