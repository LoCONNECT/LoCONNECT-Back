import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { regions } from 'src/common/constants/resion';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron('0 0 * * *') // 매일 자정
  async handleCron() {
    this.logger.log('스케쥴러 시작 - 지역별 크롤링 요청 전송');

    for (const region of regions) {
      try {
        await axios.get(`http://localhost:8000/restaurants`, {
          params: { keyword: region },
        });

        this.logger.log(`${region} 요청`);
      } catch (err) {
        this.logger.error(`${region} 요청 실패: ${err.message}`);
      }
    }

    this.logger.log('스케쥴러 종료');
  }
}
