import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JobModule } from 'src/queue/queue.module';
import { SellerController } from './seller.controller';
import { SellerApiService } from './services/seller-api.service';
import { SellerService } from './services/seller.service';

@Module({
  imports: [HttpModule, JobModule],
  controllers: [SellerController],
  providers: [SellerService, SellerApiService],
  exports: [SellerService, SellerApiService],
})
export class SellerModule {}
