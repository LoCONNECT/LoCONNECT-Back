import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Influencer } from './entity/influencer.entity';
import { InfluencerIntro } from './entity/influencer.intro.entity';
import { InfluencerService } from './influencer.service';
import { InfluencerController } from './influencer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Influencer, InfluencerIntro])],
  providers: [InfluencerService],
  controllers: [InfluencerController],
  exports: [InfluencerService],
})
export class InfluencerModule {}
