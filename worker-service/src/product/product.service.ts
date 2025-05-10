import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_API_URL');
  }

  async getProducts(): Promise<Product[]> {
    this.logger.debug('Finding products');
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Product[]>('/produtos', {
          baseURL: this.baseUrl,
        }),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Erro ao buscar produtos');
    }
  }
}
