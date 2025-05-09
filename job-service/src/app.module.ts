import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './queue/queue.module';
import { SellerModule } from './seller/seller.module';

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
