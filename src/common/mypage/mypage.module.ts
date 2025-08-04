import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { MyPageController } from './mypage.controller';
import { MyPageService } from './mypage.service';

@Module({
  imports: [PaymentModule],
  providers: [MyPageService],
  controllers: [MyPageController],
  exports: [MyPageService],
})
export class MyPageModule {}
