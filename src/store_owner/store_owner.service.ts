import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreOwner } from './entity/store_owners.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class StoreOwnerService {
  constructor(
    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,
  ) {}

  private fromRegion(address: string): string {
    // 예: '충청남도 당진시 읍내동 123' → '당진'
    const match = address.match(/([가-힣]+)[시군구]/);
    return match ? match[1] : 'unknown';
  }

  async getMenus(id: number) {
    const storeOwner = await this.storeOwnerRepo.findOneBy({ id });

    if (!storeOwner) {
      throw new NotFoundException('해당 점주 정보를 찾을 수 없습니다.');
    }

    const { bizName, bizAddress } = storeOwner;
    const region = this.fromRegion(bizAddress); // 지역 추출

    try {
      const { data } = await axios.get(`/menus-${region}.json`);

      const found = data.find((item: any) => item.name === bizName);
      if (!found) {
        throw new NotFoundException(
          `'${region}' 지역에서 '${bizName}'의 메뉴 정보를 찾을 수 없습니다.`,
        );
      }

      return found.menus;
    } catch (error) {
      throw new NotFoundException(`메뉴 불러오기 실패 ${error.message}`);
    }
  }
}
