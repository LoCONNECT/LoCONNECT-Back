import { Module } from '@nestjs/common';
import { KeepService } from './keep.service';
import { KeepController } from './keep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keep } from './keep.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keep])],
  providers: [KeepService],
  controllers: [KeepController],
  exports: [KeepService],
})
export class KeepModule {}
