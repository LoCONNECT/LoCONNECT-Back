import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { MyPageController } from './mypage.controller';
import { MyPageService } from './mypage.service';
import { ProposalModule } from '../proposal/proposal.module';

@Module({
  imports: [PaymentModule, ProposalModule],
  providers: [MyPageService],
  controllers: [MyPageController],
  exports: [MyPageService],
})
export class MyPageModule {}
