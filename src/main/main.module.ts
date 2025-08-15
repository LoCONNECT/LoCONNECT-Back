import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { StoreIntro } from 'src/store_owner/entity/store_intro.entity';
import { MediaStaff } from 'src/media_staff/entity/media_staff.entity';
import { MediaIntro } from 'src/media_staff/entity/media_intro.entity';
import { Influencer } from 'src/influencer/entity/influencer.entity';
import { InfluencerIntro } from 'src/influencer/entity/influencer.intro.entity';
import { IntroApply } from 'src/common/users/entity/intro.entity';
import { User } from 'src/common/users/entity/users.entity';
import { MainService } from './main.service';
import { MainController } from './main.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      StoreOwner,
      StoreIntro,
      MediaStaff,
      MediaIntro,
      Influencer,
      InfluencerIntro,
      IntroApply,
    ]),
  ],
  providers: [MainService],
  controllers: [MainController],
  exports: [MainService],
})
export class MainModule {}
