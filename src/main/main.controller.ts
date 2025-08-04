import { Controller, Get, Param } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get(':type')
  async getMainData(@Param('type') type: string) {
    return this.mainService.getMainData(type);
  }

  @Get('applied/:type/:id')
  async getApplied(@Param('type') type: string, @Param('id') id: string) {
    return this.mainService.getAppliedCheck(type, Number(id));
  }
}
