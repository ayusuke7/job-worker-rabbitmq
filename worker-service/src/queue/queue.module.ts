import { Module } from '@nestjs/common';
import { ReportModule } from 'src/modules/report/report.module';
import { QueueController } from './queue.controller';
import { QueueService } from './services/queue.service';

@Module({
  imports: [ReportModule],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
