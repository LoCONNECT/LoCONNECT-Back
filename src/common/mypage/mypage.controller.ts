import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/auth.guard';
import { AuthRequest } from '../auth/auth.interface';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/payment.entity';

@Controller('mypage')
@UseGuards(JwtAuthGuard)
export class MyPageController {
  constructor(private readonly paymentService: PaymentService) {}

  // mypage 용 결제 내역 확인
  @Get('payments')
  async myPayments(@Req() req: AuthRequest): Promise<{ payments: Payment[] }> {
    const userId = req.user.id;
    const { payments } = await this.paymentService.getPaymentByUser(userId);
    return { payments };
  }
}
