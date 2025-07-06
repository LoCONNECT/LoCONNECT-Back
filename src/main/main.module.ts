import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { MediaStaff } from 'src/media_staff/media_staff.entity';
import { Influencer } from 'src/influencer/influencer.entity';
import { User } from 'src/common/users/users.entity';
import { MainService } from './main.service';
import { MainController } from './main.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreOwner, MediaStaff, Influencer]),
  ],
  providers: [MainService],
  controllers: [MainController],
  exports: [MainService],
})
export class MainModule {}
