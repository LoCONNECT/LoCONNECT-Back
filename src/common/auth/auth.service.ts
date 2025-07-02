import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/users.entity';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreOwner } from 'src/store_owner/entity/store_owners.entity';
import { MediaStaff } from 'src/media_staff/media_staff.entity';
import { Influencer } from 'src/influencer/influencer.entity';
import { HashService } from '../utils/hash.service';

type UserWithExtra =
  | (User & { extraInfo: StoreOwner | null })
  | (User & { extraInfo: MediaStaff | null })
  | (User & { extraInfo: Influencer | null });
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,

    @InjectRepository(MediaStaff)
    private mediaRepo: Repository<MediaStaff>,

    @InjectRepository(Influencer)
    private influRepo: Repository<Influencer>,

    private readonly hashService: HashService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // 회원가입 중복 검사
  async checkDuplicate(
    type: 'id' | 'phone',
    body: { id?: string; phone?: string },
  ): Promise<boolean> {
    if (type === 'id') {
      const user = await this.userService.findUserByLoginId(body.id!);
      return !!user;
    } else if (type === 'phone') {
      const user = await this.userService.findUserByPhone(body.phone!);
      return !!user;
    } else {
      throw new Error('지원하지 않는 타입입니다.');
    }
  }

  // 회원가입
  async signUp(type: 'biz' | 'media' | 'influ', body: any, files: any) {
    // 공통 회원 정보 생성

    if (!body.password) {
      throw new Error('비밀번호가 입력되지 않았습니다.');
    }

    const hashedPw = await this.hashService.hashPassword(body.password);

    const user = this.userRepo.create({
      role: type as UserRole,
      name: body.name,
      loginId: body.id,
      email: body.email,
      password: hashedPw,
      phone: body.phone,
      agreeRequired: body.agreeRequired === 'true',
      agreeOptional: body.agreeOptional === 'true',
    });
    const savedUser = await this.userRepo.save(user);

    // 타입별 추가 정보 저장
    if (type === 'biz') {
      const storeOwner = this.storeOwnerRepo.create({
        user: savedUser,
        bizName: body.bizName,
        bizLicense: files?.bizLicense?.[0]?.path || '',
        bizCategory: body.bizCategory,
        bizPostcode: body.bizPostcode,
        bizAddress: body.bizAddress,
        bizAddressDetail: body.bizAddressDetail,
        bizPhone: body.bizPhone,
      });
      await this.storeOwnerRepo.save(storeOwner);
    } else if (type === 'media') {
      const mediaStaff = this.mediaRepo.create({
        user: savedUser,
        companyName: body.companyName,
        programName: body.programName,
        proofFile: files?.proofFile?.[0]?.path || '',
        department: body.department,
        purpose: body.purpose,
      });
      await this.mediaRepo.save(mediaStaff);
    } else if (type === 'influ') {
      const influencer = this.influRepo.create({
        user: savedUser,
        representativeName: body.representativeName,
        influLicense: files?.influLicense?.[0]?.path || '',
        influDepartment: body.influDepartment,
        influType: body.influType,
        influPurpose: body.influPurpose,
        promoUrl: body.promoUrl,
      });
      await this.influRepo.save(influencer);
    }

    return {
      message: '회원가입이 완료되었습니다.',
    };
  }

  // 로그인
  async localLogin(
    loginId: string,
    password: string,
  ): Promise<{ user?: UserWithExtra; message?: string }> {
    const user = await this.userService.findUserByLoginId(loginId, {
      withPassword: true,
    });

    if (!user) {
      return {
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      };
    }

    const match = await bcrypt.compare(password, user.password!);

    if (!match) {
      return {
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      };
    }

    if (user.acceptStatus !== 'accept') {
      return {
        message: '승인 대기 또는 거절된 계정입니다.',
      };
    }

    let extraInfo = null;
    if (user.role === UserRole.BIZ) {
      extraInfo = await this.storeOwnerRepo.findOne({
        where: { user: { id: user.id } },
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

    const hashed = await bcrypt.hash('Admin1234!', 10);
    console.log(hashed);

    return {
      user: {
        ...user,
        extraInfo,
      },
    };
  }

  // access 토큰 및 refresh 토큰
  async issueTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        acceptStatus: user.acceptStatus,
      },
      this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY')!,
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );

    const refresh_token = jwt.sign(
      {},
      this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY')!,
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        audience: String(user.id),
      },
    );

    user.refresh_token = refresh_token;
    await this.userService.save(user);

    return {
      access_token,
      refresh_token,
    };
  }

  // 로그아웃
  async logout(userId: number): Promise<void> {
    const user = await this.userService.findUserById(userId);
    if (user) {
      user.refresh_token = null;
      await this.userService.save(user);
    }
  }
}
