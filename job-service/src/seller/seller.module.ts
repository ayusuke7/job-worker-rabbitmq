import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JobModule } from 'src/queue/queue.module';
import { SellerController } from './seller.controller';
import { SellerRepository } from './seller.repository';
import { SellerService } from './seller.service';

@Module({
  imports: [HttpModule, JobModule],
  controllers: [SellerController],
  providers: [SellerService, SellerRepository],
  exports: [SellerService, SellerRepository],
})
export class SellerModule {}
