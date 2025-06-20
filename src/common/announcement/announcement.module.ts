import { Module } from '@nestjs/common';
import { Announcement } from './announcement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
