import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramService } from './program/program.service';
import { ProgramController } from './program/program.controller';
import { ProgramModule } from './program/program.module';
import { ProposalService } from './proposal/proposal.service';
import { ProposalController } from './proposal/proposal.controller';
import { ProposalModule } from './proposal/proposal.module';
import { InquiryModule } from './common/inquiry/inquiry.module';
import { InquiryController } from './common/inquiry/inquiry.controller';
import { InquiryService } from './common/inquiry/inquiry.service';
import { UsersController } from './common/user/users.controller';
import { UsersService } from './common/user/users.service';
import { PaymentService } from './common/payment/payment.service';
import { PaymentModule } from './common/payment/payment.module';

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
    ProgramModule,
    ProposalModule,
    InquiryModule,
    PaymentModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ProgramController,
    ProposalController,
    InquiryController,
  ],
  providers: [
    AppService,
    UsersService,
    ProgramService,
    ProposalService,
    InquiryService,
    PaymentService,
  ],
})
export class AppModule {}
