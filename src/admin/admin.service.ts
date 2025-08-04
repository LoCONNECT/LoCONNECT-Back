import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/common/mail/mail.service';
import { User, UserAccept } from 'src/common/users/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly mailService: MailService,
  ) {}

  // 유저 정보
  async getUsers(status?: string, searchType?: string, searchWord?: string) {
    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (status === 'pending') {
      queryBuilder.where(
        'user.acceptStatus = :pending OR user.acceptStatus = :reject',
        {
          pending: UserAccept.PENDING,
          reject: UserAccept.REJECT,
        },
      );
    } else if (status === 'approve') {
      queryBuilder.where('user.acceptStatus = :status', {
        status: UserAccept.ACCEPT,
      });

      if (searchType && searchWord) {
        if (searchType === 'name') {
          queryBuilder.andWhere('user.name LIKE :search', {
            search: `%${searchWord}%`,
          });
        } else if (searchType === 'role') {
          queryBuilder.andWhere('user.role = :role', { role: searchWord });
        }
      }
    }

    return await queryBuilder.getMany();
  }

  // 유저 승인
  async updateUserStatus(
    userId: number,
    status: UserAccept.ACCEPT | UserAccept.REJECT,
    reason?: string,
  ): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (user.acceptStatus !== UserAccept.PENDING) {
      throw new BadRequestException(
        `현재 상태가 PENDING이 아니므로 변경할 수 없습니다. 현재 상태: ${user.acceptStatus}`,
      );
    }

    user.acceptStatus = status;
    await this.userRepo.save(user);

    if (status === UserAccept.REJECT && reason) {
      // 이메일 발송 로직
      await this.mailService.sendRejectReasonEmail(user.email, reason);
    }

    return user;
  }
}
