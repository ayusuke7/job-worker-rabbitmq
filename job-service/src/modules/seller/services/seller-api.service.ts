import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Seller } from '../entities/seller.entity';

@Injectable()
export class SellerApiService {
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('BASE_API_URL');
  }

  async getSellers(): Promise<Seller[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Seller[]>('/vendedores', {
        baseURL: this.baseUrl,
      }),
    );
    return data;
  }
}
