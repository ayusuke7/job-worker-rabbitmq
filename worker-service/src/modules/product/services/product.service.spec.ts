import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Product } from '../entities/product.entity';
import { ProductService } from './product.service';

const mockBaseUrl = 'http://mock-api.com/produtos';

const mockProducts: Product[] = [
  {
    id: '1',
    tipo: 'any_type',
    nome: 'any_name',
    preco: 'any_price',
    sku: 'any_sku',
    vendedor_id: '1',
  },
];

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(() => mockBaseUrl),
};

describe('[ProductService]', () => {
  let service: ProductService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
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
      data: mockProducts,
    } as AxiosResponse;

    mockHttpService.get.mockReturnValue(of(mockResponse));
    const result = await service.getProducts();

    expect(result).toEqual(mockProducts);
    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/produtos', {
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

    await expect(service.getProducts()).rejects.toThrow();

    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/produtos', {
      baseURL: mockBaseUrl,
    });
  });
});
