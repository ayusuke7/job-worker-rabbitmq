import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './modules/seller/seller.module';
import { JobModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SellerModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
