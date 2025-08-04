import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './proposal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  // 내가 제안한 내역
  async getApply(userId: number): Promise<Proposal[]> {
    return this.proposalRepository.find({
      where: { proposer: { id: userId } },
      relations: ['receiver'],
      order: { createdAt: 'DESC' },
    });
  }

  // 내가 제안받은 내역
  async getReceived(userId: number): Promise<Proposal[]> {
    return this.proposalRepository.find({
      where: { receiver: { id: userId } },
      relations: ['proposer'],
      order: { createdAt: 'DESC' },
    });
  }
}
