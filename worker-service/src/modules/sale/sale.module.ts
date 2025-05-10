import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SaleService } from './services/sale.service';

@Module({
  imports: [HttpModule],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
