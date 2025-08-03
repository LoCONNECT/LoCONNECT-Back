import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keep } from './keep.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class KeepService {
  constructor(
    @InjectRepository(Keep)
    private readonly keepRepository: Repository<Keep>,

    private readonly userService: UsersService,
  ) {}

  // 찜 토글 기능
  async toggleKeep(
    userId: number,
    targetId: number,
  ): Promise<{ keeped: boolean }> {
    const target = await this.userService.findUserById(targetId);

    if (!target) {
      throw new NotFoundException(`${targetId} not found`);
    }

    const existingKeep = await this.keepRepository.findOne({
      where: {
        user: { id: userId },
        target: { id: targetId },
      },
    });

    let keeped: boolean;

    if (existingKeep) {
      await this.keepRepository.remove(existingKeep);
      keeped = false;
    } else {
      const newLike = this.keepRepository.create({
        user: { id: userId },
        target: { id: targetId },
      });
      await this.keepRepository.save(newLike);
      keeped = true;
    }

    return {
      keeped,
    };
  }

  // 내가 찜한 내역
  async findKeepsByUser(userId: number): Promise<{ keeps: Keep[] }> {
    const keeps = await this.keepRepository.find({
      where: { user: { id: userId } },
      relations: ['target'],
    });
    return { keeps };
  }
}
