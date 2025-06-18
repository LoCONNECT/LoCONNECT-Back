import { Module } from '@nestjs/common';
import { KeepService } from './keep.service';
import { KeepController } from './keep.controller';

@Module({
  providers: [KeepService],
  controllers: [KeepController]
})
export class KeepModule {}
