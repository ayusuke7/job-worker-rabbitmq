import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { QueueModule } from './queue/queue.module';
import { ReportModule } from './report/report.module';
import { SaleModule } from './sale/sale.module';

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
