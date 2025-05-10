import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Seller } from '../entities/seller.entity';
import { SellerApiService } from './seller-api.service';

const MOCK_API_URL = 'https://api.example.com';

const mockSellers: Seller[] = [
  { id: '1', nome: 'Seller 1', telefone: '123456789' },
  { id: '2', nome: 'Seller 2', telefone: '123456789' },
];

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(() => MOCK_API_URL),
};

describe('[SellerApiService]', () => {
  let service: SellerApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerApiService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SellerApiService>(SellerApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of sellers', async () => {
    const mockResponse = {
      config: { url: `${MOCK_API_URL}/vendedores` } as any,
      headers: {},
      status: 200,
      statusText: 'OK',
      data: mockSellers,
    } as AxiosResponse;
    mockHttpService.get.mockReturnValue(of(mockResponse));

    const result = await service.getSellers();

    expect(result).toEqual(mockSellers);
    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/vendedores', {
      baseURL: MOCK_API_URL,
    });
  });

  it('should throw an error when the HTTP request fails', async () => {
    const mockError = new Error('HTTP Request Failed');
    mockHttpService.get.mockReturnValue({
      pipe: jest.fn().mockImplementation(() => {
        throw mockError;
      }),
      toPromise: jest.fn().mockRejectedValue(mockError),
    });

    await expect(service.getSellers()).rejects.toThrow();

    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/vendedores', {
      baseURL: MOCK_API_URL,
    });
  });
});
