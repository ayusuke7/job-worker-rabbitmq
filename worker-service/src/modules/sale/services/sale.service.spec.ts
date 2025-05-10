import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Sale } from '../entities/sale.entity';
import { SaleService } from './sale.service';

const mockBaseUrl = 'http://mock-api.com/vendas';

const mockSales: Sale[] = [
  {
    id: '1',
    cliente_id: '1',
    produto_id: '1',
    vendedor_id: '1',
  },
];

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(() => mockBaseUrl),
};

describe('[SaleService]', () => {
  let service: SaleService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of customers', async () => {
    const mockResponse = {
      config: { url: mockBaseUrl } as any,
      headers: {},
      status: 200,
      statusText: 'OK',
      data: mockSales,
    } as AxiosResponse;

    mockHttpService.get.mockReturnValue(of(mockResponse));
    const result = await service.getSales();

    expect(result).toEqual(mockSales);
    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/vendas', {
      baseURL: mockBaseUrl,
    });
  });

  it('should throw an error if the request fails', async () => {
    const mockError = new Error('HTTP Request Failed');
    mockHttpService.get.mockReturnValue({
      pipe: jest.fn().mockImplementation(() => {
        throw mockError;
      }),
      toPromise: jest.fn().mockRejectedValue(mockError),
    });

    await expect(service.getSales()).rejects.toThrow();

    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/vendas', {
      baseURL: mockBaseUrl,
    });
  });
});
