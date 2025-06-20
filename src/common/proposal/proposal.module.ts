import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { Proposal } from './proposal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  providers: [ProposalService],
  controllers: [ProposalController],
  exports: [ProposalService],
})
export class ProposalModule {}
