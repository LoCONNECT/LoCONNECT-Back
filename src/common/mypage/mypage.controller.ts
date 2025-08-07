import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthRequest } from '../auth/auth.interface';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/payment.entity';
import { ProposalService } from '../proposal/proposal.service';
import { Proposal } from '../proposal/proposal.entity';
import { SettlementService } from '../settlement/settlement.service';
import { Settlement } from '../settlement/settlement.entity';
import { SettlementHistoryDto } from '../settlement/dto/settlement.res.dto';

@Controller('mypage')
@UseGuards(JwtAuthGuard)
export class MyPageController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly proposalService: ProposalService,
    private readonly settlementService: SettlementService,
  ) {}

  // 결제 내역 확인
  @Get('payments')
  async myPayments(@Req() req: AuthRequest): Promise<{ payments: Payment[] }> {
    const userId = req.user.id;
    const payments = await this.paymentService.getPaymentByUser(userId);
    return { payments };
  }

  // 정산 내역 확인
  @Get('settlement')
  async mySettlements(
    @Req() req: AuthRequest,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<SettlementHistoryDto[]> {
    const userId = req.user.id;
    return this.settlementService.getSettlementHistory(
      userId,
      Number(year),
      Number(month),
    );
  }

  // 신청 내역 확인
  @Get('apply')
  async myApplys(@Req() req: AuthRequest): Promise<{ applys: Proposal[] }> {
    const userId = req.user.id;
    const applys = await this.proposalService.getApply(userId);
    return { applys };
  }

  // 받은 신청 내역 확인
  @Get('received')
  async myReceived(@Req() req: AuthRequest): Promise<{ received: Proposal[] }> {
    const userId = req.user.id;
    const received = await this.proposalService.getReceived(userId);
    return { received };
  }
}
