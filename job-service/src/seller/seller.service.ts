import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { QueueService } from '../queue/queue.service';
import { Seller } from './seller.entity';

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_API_URL');
  }

  async processSellers() {
    try {
      const sellers = await this.getSellers();
      this.logger.debug(`found ${sellers.length} sellers`);

      for (const seller of sellers) {
        await this.queueService.publish('seller.process', seller);
        this.logger.debug(`Seller ${seller.nome} publish in queue`);
      }
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to process sellers`);
    }
  }

  private async getSellers(): Promise<Seller[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Seller[]>('/vendedores', {
        baseURL: this.baseUrl,
      }),
    );
    return data;
  }
}
