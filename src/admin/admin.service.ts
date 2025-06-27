import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserAccept } from 'src/common/users/users.entity';
import { UsersService } from 'src/common/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // 유저 승인
  async updateUserAcceptStatus(
    userId: number,
    status: UserAccept.ACCEPT | UserAccept.REJECT,
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

    return await this.userRepo.save(user);
  }
}
