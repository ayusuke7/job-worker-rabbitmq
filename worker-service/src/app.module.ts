import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './modules/customer/customer.module';
import { ProductModule } from './modules/product/product.module';
import { ReportModule } from './modules/report/report.module';
import { SaleModule } from './modules/sale/sale.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
    SaleModule,
    ProductModule,
    ReportModule,
    QueueModule,
  ],
  providers: [],
})
export class AppModule {}
