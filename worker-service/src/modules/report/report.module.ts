import { Module } from '@nestjs/common';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { ProductModule } from 'src/modules/product/product.module';
import { SaleModule } from 'src/modules/sale/sale.module';
import { ReportService } from './services/report.service';

@Module({
  imports: [CustomerModule, ProductModule, SaleModule],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
