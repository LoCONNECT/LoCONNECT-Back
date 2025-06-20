import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Influencer } from './influencer.entity';
import { InfluencerService } from './influencer.service';
import { InfluencerController } from './influencer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Influencer])],
  providers: [InfluencerService],
  controllers: [InfluencerController],
  exports: [InfluencerService],
})
export class InfluencerModule {}
