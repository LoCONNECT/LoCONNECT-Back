import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 관리자용 모든 유저 확인
  async findAllUser() {
    return await this.userRepository.find();
  }

  // 로그인용 아이디로 유저 찾기
  async findUserByLoginId(
    loginId: string,
    options?: { withPassword: boolean },
  ): Promise<User | null> {
    if (options?.withPassword) {
      return this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.loginId = :loginId', { loginId })
        .getOne();
    }
    return this.userRepository.findOne({ where: { loginId } });
  }

  // 전화번호로 유저 찾기
  findUserByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  // 유저 정보 수정
  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
