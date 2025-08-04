import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaStaff } from './entity/media_staff.entity';
import { MediaIntro } from './entity/media_intro.entity';
import { MediaStaffService } from './media_staff.service';
import { MediaStaffController } from './media_staff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MediaStaff, MediaIntro])],
  providers: [MediaStaffService],
  controllers: [MediaStaffController],
  exports: [MediaStaffService],
})
export class MediaStaffModule {}
