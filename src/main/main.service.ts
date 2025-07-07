import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/users/users.entity';
import { Influencer } from '../influencer/influencer.entity';
import { MediaStaff } from '../media_staff/media_staff.entity';
import { StoreOwner } from '../store_owner/entity/store_owners.entity';
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
}
