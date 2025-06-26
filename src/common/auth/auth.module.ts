import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { MediaStaff } from 'src/media_staff/media_staff.entity';
import { Influencer } from 'src/influencer/influencer.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreOwner, MediaStaff, Influencer]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService],
  exports: [HashService],
})
export class AuthModule {}
