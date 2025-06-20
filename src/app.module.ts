import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// entity
import { Keep } from './common/keep/keep.entity';
import { Inquiry } from './common/inquiry/inquiry.entity';
import { Announcement } from './common/announcement/announcement.entity';
import { User } from './common/users/users.entity';
import { Payment } from './common/payment/payment.entity';
import { Proposal } from './common/proposal/proposal.entity';
import { Influencer } from './influencer/influencer.entity';
import { MediaStaff } from './media_staff/media_staff.entity';
import { StoreIntro } from './store_owner/entity/store_intro.entity';
import { StoreOwner } from './store_owner/entity/store_owners.entity';

// module
import { UsersModule } from './common/users/users.module';
import { AnnouncementModule } from './common/announcement/announcement.module';
import { AuthModule } from './common/auth/auth.module';
import { KeepModule } from './common/keep/keep.module';
import { NotificationModule } from './common/notification/notification.module';
import { SettlementModule } from './common/settlement/settlement.module';
import { ProposalModule } from './common/proposal/proposal.module';
import { InquiryModule } from './common/inquiry/inquiry.module';
import { PaymentModule } from './common/payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { InfluencerModule } from './influencer/influencer.module';
import { MediaStaffModule } from './media_staff/media_staff.module';
import { StoreOwnerModule } from './store_owner/store_owner.module';
import { MailModule } from './common/mail/mail.module';
import { Notification } from './common/notification/notification.entity';
import { AppService } from './app.service';
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
          Notification,
          Payment,
          Proposal,
          Influencer,
          MediaStaff,
          StoreIntro,
          StoreOwner,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AnnouncementModule,
    AuthModule,
    KeepModule,
    NotificationModule,
    SettlementModule,
    ProposalModule,
    InquiryModule,
    PaymentModule,
    StoreOwnerModule,
    AdminModule,
    InfluencerModule,
    MediaStaffModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
