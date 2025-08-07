import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// entity
import { Keep } from './common/keep/keep.entity';
import { Inquiry } from './common/inquiry/inquiry.entity';
import { Announcement } from './common/announcement/announcement.entity';
import { User } from './common/users/entity/users.entity';
import { Payment } from './common/payment/payment.entity';
import { Proposal } from './common/proposal/proposal.entity';
import { InfluencerIntro } from './influencer/entity/influencer.intro.entity';
import { Influencer } from './influencer/entity/influencer.entity';
import { MediaStaff } from './media_staff/entity/media_staff.entity';
import { MediaIntro } from './media_staff/entity/media_intro.entity';
import { StoreIntro } from './store_owner/entity/store_intro.entity';
import { StoreOwner } from './store_owner/entity/store_owners.entity';
import { Notice } from './common/notice/notice.entity';
import { IntroApply } from './common/users/entity/intro.entity';
import { Settlement } from './common/settlement/settlement.entity';

// module
import { UsersModule } from './common/users/users.module';
import { AnnouncementModule } from './common/announcement/announcement.module';
import { AuthModule } from './common/auth/auth.module';
import { KeepModule } from './common/keep/keep.module';
import { SettlementModule } from './common/settlement/settlement.module';
import { ProposalModule } from './common/proposal/proposal.module';
import { InquiryModule } from './common/inquiry/inquiry.module';
import { PaymentModule } from './common/payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { InfluencerModule } from './influencer/influencer.module';
import { MediaStaffModule } from './media_staff/media_staff.module';
import { StoreOwnerModule } from './store_owner/store_owner.module';
import { MailModule } from './common/mail/mail.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { NoticeModule } from './common/notice/notice.module';

// service
import { AppService } from './app.service';
import { MyPageModule } from './common/mypage/mypage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT')!, 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          User,
          Announcement,
          Inquiry,
          Keep,
          Payment,
          Proposal,
          Influencer,
          MediaStaff,
          StoreIntro,
          StoreOwner,
          Notice,
          InfluencerIntro,
          MediaIntro,
          IntroApply,
          Settlement,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AnnouncementModule,
    AuthModule,
    KeepModule,
    SettlementModule,
    ProposalModule,
    InquiryModule,
    PaymentModule,
    StoreOwnerModule,
    AdminModule,
    InfluencerModule,
    MediaStaffModule,
    MailModule,
    SchedulerModule,
    NoticeModule,
    MyPageModule,
  ],
  providers: [AppService],
})
export class AppModule {}
