import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  private logger = new Logger(CustomerService.name);
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_API_URL');
  }

  async getCustomers(): Promise<Customer[]> {
    this.logger.debug('Finding clients');
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Customer[]>('/clientes', {
          baseURL: this.baseUrl,
        }),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Erro ao buscar clientes');
    }
  }
}
