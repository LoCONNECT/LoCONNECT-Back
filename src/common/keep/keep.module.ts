import { Module } from '@nestjs/common';
import { KeepService } from './keep.service';
import { KeepController } from './keep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keep } from './keep.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keep]), UsersModule],
  providers: [KeepService],
  controllers: [KeepController],
  exports: [KeepService],
})
export class KeepModule {}
