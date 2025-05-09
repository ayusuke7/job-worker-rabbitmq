import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Sale } from './sale.entity';

@Injectable()
export class SaleService {
  private logger = new Logger(SaleService.name);
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_API_URL');
  }

  async getSales(): Promise<Sale[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Sale[]>('/vendas', {
          baseURL: this.baseUrl,
        }),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Erro ao buscar vendas');
    }
  }
}
