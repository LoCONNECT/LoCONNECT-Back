import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeService } from './notice.service';
import { NoticesController } from './notice.controller';
import { Notice } from './notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticeService],
  controllers: [NoticesController],
  exports: [NoticeService],
})
export class NoticeModule {}
