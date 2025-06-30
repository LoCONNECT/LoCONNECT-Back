import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { MediaStaff } from 'src/media_staff/media_staff.entity';
import { Influencer } from 'src/influencer/influencer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(StoreOwner)
    private readonly storeOwnerRepo: Repository<StoreOwner>,

    @InjectRepository(MediaStaff)
    private readonly mediaRepo: Repository<MediaStaff>,

    @InjectRepository(Influencer)
    private readonly influRepo: Repository<Influencer>,
  ) {}

  // 관리자용 모든 유저 확인
  async findAllUser() {
    return await this.userRepository.find();
  }

  // 로그인용 아이디로 유저 찾기
  async findUserByLoginId(
    loginId: string,
    options?: { withPassword: boolean },
  ): Promise<User> {
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

  // id로 유저 찾기
  findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 유저 역할에 맞는 데이터 찾기
  async findDataByRole(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    let extraInfo = null;

    if (user.role === UserRole.BIZ) {
      extraInfo = await this.storeOwnerRepo.findOne({
        where: { user: { id: user.id } },
        relations: ['storeIntros'],
      });
    } else if (user.role === UserRole.MEDIA) {
      extraInfo = await this.mediaRepo.findOne({
        where: { user: { id: user.id } },
      });
    } else if (user.role === UserRole.INFLUENCER) {
      extraInfo = await this.influRepo.findOne({
        where: { user: { id: user.id } },
      });
    }

    return { user, extraInfo };
  }
}
