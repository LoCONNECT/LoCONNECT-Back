import { Controller, Get, Param } from '@nestjs/common';
import { StoreOwnerService } from './store_owner.service';

@Controller('store-owner')
export class StoreOwnerController {
  constructor(private readonly storeOwnerService: StoreOwnerService) {}

  @Get(':id/menu')
  async getMenus(@Param('id') id: string) {
    return this.storeOwnerService.getMenus(Number(id));
  }
}
