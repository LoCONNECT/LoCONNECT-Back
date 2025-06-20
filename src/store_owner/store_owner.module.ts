import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreOwner } from './entity/store_owners.entity';
import { StoreOwnerService } from './store_owner.service';
import { StoreOwnerController } from './store_owner.controller';
import { StoreIntro } from './entity/store_intro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreOwner, StoreIntro])],
  providers: [StoreOwnerService],
  controllers: [StoreOwnerController],
  exports: [StoreOwnerService],
})
export class StoreOwnerModule {}
