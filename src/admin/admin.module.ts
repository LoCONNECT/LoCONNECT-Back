import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/common/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/common/mail/mail.module';
import { NoticeModule } from 'src/common/notice/notice.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule, NoticeModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
