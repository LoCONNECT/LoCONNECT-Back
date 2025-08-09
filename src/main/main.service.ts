import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/users/entity/users.entity';
import { UserRole } from '../common/users/entity/users.entity';

import { Influencer } from '../influencer/entity/influencer.entity';
import { InfluencerIntro } from 'src/influencer/entity/influencer.intro.entity';
import { MediaStaff } from '../media_staff/entity/media_staff.entity';
import { MediaIntro } from 'src/media_staff/entity/media_intro.entity';
import { StoreOwner } from '../store_owner/entity/store_owners.entity';
import { StoreIntro } from 'src/store_owner/entity/store_intro.entity';
import { IntroApply } from 'src/common/users/entity/intro.entity';

import { IntroType } from 'src/common/users/entity/intro.entity';
import { CreateIntroDto } from './dto/intro.dto';

import { Repository } from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,

    @InjectRepository(MediaStaff)
    private mediaRepo: Repository<MediaStaff>,

    @InjectRepository(Influencer)
    private influRepo: Repository<Influencer>,

    @InjectRepository(StoreIntro)
    private storeIntroRepo: Repository<StoreIntro>,

    @InjectRepository(MediaIntro)
    private mediaIntroRepo: Repository<MediaIntro>,

    @InjectRepository(InfluencerIntro)
    private influencerIntroRepo: Repository<InfluencerIntro>,

    @InjectRepository(IntroApply)
    private introApplyRepo: Repository<IntroApply>,
  ) {}

  async getMainData(type: string) {
    if (type === 'restaurant') {
      const restaurants = await this.storeOwnerRepo.find({
        relations: ['storeIntros'],
      });

      const region = [
        { value: 'all', label: '전체' },
        { value: 'Chungbuk', label: '충북' },
        { value: 'Chungju', label: '충주' },
        { value: 'Cheongju', label: '청주' },
      ];

      const restaurantData = restaurants.map((r) => ({
        id: r.id,
        bizName: r.bizName,
        bizAddress: r.bizAddress,
        price: r.price,
        intro: r.storeIntros[0]?.introduction || '',
        menuImg: r.storeIntros[0]?.images[0] || '',
        img: r.storeIntros[0]?.images[1] || '',
        // scraping: r.scraps.map((s) => ({
        //   id: s.id,
        //   scrapImg: s.scrapImg,
        //   scrapTitle: s.scrapTitle,
        //   scrapSubTitle: s.scrapSubTitle,
        //   scrapLink: s.scrapLink,
        // })),
      }));

      return { region, restaurant: restaurantData };
    }

    if (type === 'media') {
      const mediaStaffs = await this.mediaRepo.find({
        relations: ['user'],
      });

      const influencers = await this.influRepo.find({
        relations: ['user'],
      });

      // MediaStaff 매핑
      const mediaStaffData = mediaStaffs.map((m) => ({
        id: m.id,
        userId: m.user.id,
        userName: m.user.name,
        programName: m.programName,
        title: m.programName,
        price: m.price,
        type: m.type,
        image: m.image,
        programIntro: m.purpose,
        subTitle: m.department,
        channelPR: '채널 소개 준비중입니다.',
      }));

      // Influencer 매핑
      const influencerData = influencers.map((i) => ({
        id: i.id,
        userId: i.user.id,
        userName: i.user.name,
        programName: i.representativeName,
        title: i.representativeName,
        price: 0,
        type: 'influencer',
        image: i.promoUrl,
        programIntro: i.influPurpose,
        subTitle: i.influDepartment,
        channelPR: '인플루언서 채널입니다.',
      }));

      const media = [...mediaStaffData, ...influencerData];

      return { media };
    }

    return { message: '유효하지 않은 타입입니다.' };
  }

  //신청 여부 확인하는 함수
  async getAppliedCheck(
    type: string,
    introId: number,
    userId: number,
  ): Promise<{ result: boolean; message: string }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['storeOwner', 'mediaStaff', 'influencer'],
    });

    if (!user) return { result: false, message: '유저를 찾을 수 없습니다.' };

    let result = false;

    if (type === 'restaurant' && user.storeOwner) {
      const intros = await this.storeIntroRepo.find({
        where: {
          id: introId,
          storeOwner: { id: user.storeOwner.id },
        },
      });

      result = intros.length > 0;
    }

    if (type === 'media' && user.mediaStaff) {
      const intros = await this.mediaIntroRepo.find({
        where: {
          id: introId,
          mediaStaff: { id: user.mediaStaff.id },
        },
      });

      result = intros.length > 0;
    }

    if (type === 'influ' && user.influencer) {
      const intros = await this.influencerIntroRepo.find({
        where: {
          id: introId,
          influencer: { id: user.influencer.id },
        },
      });

      result = intros.length > 0;
    }

    return { result, message: '신청 여부 확인 완료' };
  }

  async applyToIntro(type: string, introId: number, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    // 중복 신청 방지
    const alreadyApplied = await this.introApplyRepo.findOne({
      where: { user: { id: userId }, introType: type as IntroType, introId },
    });

    if (alreadyApplied) throw new Error('이미 신청한 소개글입니다.');

    const apply = this.introApplyRepo.create({
      user,
      introType: type as 'restaurant' | 'media' | 'influ',
      introId,
    });

    await this.introApplyRepo.save(apply);

    return { success: true, message: '신청 완료' };
  }

  // 소개글 작성 폼 API
  async createMyIntro(userId: number, dto: CreateIntroDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['storeOwner', 'mediaStaff', 'influencer'],
    });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const images = (dto.images ?? []).map((s) => s.trim()).filter(Boolean);
    const introBase = {
      introduction: dto.introduction ?? null,
      images: images.length ? images : null,
    };

    switch (user.role) {
      case UserRole.BIZ: {
        if (!user.storeOwner)
          throw new NotFoundException('가게 사장 프로필이 없습니다.');
        // (선택) 한 계정당 1개 제한하려면 아래 주석 해제
        // const exists = await this.storeIntroRepo.findOne({ where: { storeOwner: { id: user.storeOwner.id } }});
        // if (exists) throw new ConflictException('이미 등록한 소개글이 있습니다.');

        const created = this.storeIntroRepo.create({
          storeOwner: user.storeOwner,
          ...introBase,
        });
        return await this.storeIntroRepo.save(created);
      }

      case UserRole.MEDIA: {
        if (!user.mediaStaff)
          throw new NotFoundException('방송국 프로필이 없습니다.');
        const created = this.mediaIntroRepo.create({
          mediaStaff: user.mediaStaff,
          ...introBase,
        });
        return await this.mediaIntroRepo.save(created);
      }

      case UserRole.INFLUENCER: {
        if (!user.influencer)
          throw new NotFoundException('인플루언서 프로필이 없습니다.');
        const created = this.influencerIntroRepo.create({
          influencer: user.influencer,
          ...introBase,
        });
        return await this.influencerIntroRepo.save(created);
      }

      default:
        throw new ForbiddenException(
          '해당 권한은 소개글을 작성할 수 없습니다.',
        );
    }
  }
}
