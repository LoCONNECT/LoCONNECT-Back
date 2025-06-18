import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProgramService } from './program/program.service';
import { ProgramController } from './program/program.controller';
import { ProgramModule } from './program/program.module';
import { ProposalService } from './proposal/proposal.service';
import { ProposalController } from './proposal/proposal.controller';
import { ProposalModule } from './proposal/proposal.module';
import { KeepModule } from './keep/keep.module';

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
    UsersModule,
    ProgramModule,
    ProposalModule,
    KeepModule,
  ],
  controllers: [AppController, UsersController, ProgramController, ProposalController],
  providers: [AppService, UsersService, ProgramService, ProposalService],
})
export class AppModule {}
