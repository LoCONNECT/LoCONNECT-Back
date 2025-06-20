import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProposalModule } from './common/proposal/proposal.module';
import { InquiryModule } from './common/inquiry/inquiry.module';
import { PaymentModule } from './common/payment/payment.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { InfluencersController } from './influencer/influencer.controller';
import { InfluencerModule } from './influencer/influencer.module';
import { MediaStaffController } from './media_staff/media_staff.controller';
import { MediaStaffModule } from './media_staff/media_staff.module';
import { StoreOwnerModule } from './store_owner/store_owner.module';
import { MailService } from './common/mail/mail.service';
import { MailModule } from './common/mail/mail.module';

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
        entities: [],
        synchronize: true,
      }),
    }),
    ProposalModule,
    InquiryModule,
    PaymentModule,
    StoreOwnerModule,
    AdminModule,
    InfluencerModule,
    MediaStaffModule,
    MailModule,
  ],
  providers: [MailService],
})
export class AppModule {}
