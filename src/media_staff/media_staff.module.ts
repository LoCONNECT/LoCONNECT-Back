import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaStaff } from './media_staff.entity';
import { MediaStaffService } from './media_staff.service';
import { MediaStaffController } from './media_staff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MediaStaff])],
  providers: [MediaStaffService],
  controllers: [MediaStaffController],
  exports: [MediaStaffService],
})
export class MediaStaffModule {}
