import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { ReportService, Seller } from 'src/report/report.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(private readonly reportService: ReportService) {}

  async handleMessage(seller: Seller, context: RmqContext): Promise<void> {
    this.logger.debug(`Message received for seller: ${seller.id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.reportService.generateReport(seller);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(error);
      channel.nack(originalMessage, false, false);
    }
  }
}
