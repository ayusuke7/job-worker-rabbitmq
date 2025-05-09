import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/customer/customer.module';
import { ProductModule } from 'src/product/product.module';
import { SaleModule } from 'src/sale/sale.module';
import { ReportService } from './report.service';

@Module({
  imports: [CustomerModule, ProductModule, SaleModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
