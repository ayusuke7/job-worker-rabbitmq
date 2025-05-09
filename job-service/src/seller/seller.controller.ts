import { Controller, Get } from '@nestjs/common';
import { SellerService } from './seller.service';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  async getSellers() {
    return this.sellerService.processSellers();
  }
}
