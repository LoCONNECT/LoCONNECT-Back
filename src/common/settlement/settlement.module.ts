import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { Settlement } from './settlement.entity';
import { Payment } from '../payment/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settlement, Payment])],
  providers: [SettlementService],
  controllers: [SettlementController],
  exports: [SettlementService],
})
export class SettlementModule {}
