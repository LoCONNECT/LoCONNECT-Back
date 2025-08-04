import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { MediaStaff } from 'src/media_staff/entity/media_staff.entity';
import { Influencer } from 'src/influencer/entity/influencer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreOwner, MediaStaff, Influencer]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
