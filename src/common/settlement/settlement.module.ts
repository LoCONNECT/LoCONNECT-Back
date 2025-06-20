import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';

@Module({
  providers: [SettlementService],
  controllers: [SettlementController],
  exports: [SettlementService],
})
export class SettlementModule {}
