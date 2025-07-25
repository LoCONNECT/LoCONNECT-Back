import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './inquiry.entity';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  providers: [InquiryService],
  controllers: [InquiryController],
  exports: [InquiryService],
})
export class InquiryModule {}
