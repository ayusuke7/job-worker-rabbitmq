import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueuePublisher } from '../../../queue/queue.publisher';
import { SellerApiService } from './seller-api.service';

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);
  private routingKey: string | undefined;

  constructor(
    private readonly queueService: QueuePublisher,
    private readonly configService: ConfigService,
    private readonly sellerRepository: SellerApiService,
  ) {
    this.routingKey = this.configService.get<string>('RABBITMQ_ROUTING_KEY');
  }

  async processSellers() {
    try {
      const sellers = await this.sellerRepository.getSellers();
      this.logger.debug(`found ${sellers.length} sellers`);

      for (const seller of sellers) {
        await this.queueService.publish(`${this.routingKey}`, seller);
        this.logger.debug(`${seller.nome} publish in ${this.routingKey}`);
      }

      return {
        message: 'Sellers processed successfully',
        count: sellers.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to process sellers`);
    }
  }
}
