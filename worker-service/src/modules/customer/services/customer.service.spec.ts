import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Customer } from '../entities/customer.entity';
import { CustomerService } from './customer.service';

const mockBaseUrl = 'http://mock-api.com/clientes';

const mockCustomers: Customer[] = [
  {
    id: '1',
    nome: 'John Doe',
    email: 'W3Vh8@example.com',
    telefone: '(11) 1234-5678',
  },
];

const mockHttpService = {
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(() => mockBaseUrl),
};

describe('[CustomerService]', () => {
  let service: CustomerService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
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
      data: mockCustomers,
    } as AxiosResponse;

    mockHttpService.get.mockReturnValue(of(mockResponse));
    const result = await service.getCustomers();

    expect(result).toEqual(mockCustomers);
    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/clientes', {
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

    await expect(service.getCustomers()).rejects.toThrow();

    expect(configService.get).toHaveBeenCalledWith('BASE_API_URL');
    expect(httpService.get).toHaveBeenCalledWith('/clientes', {
      baseURL: mockBaseUrl,
    });
  });
});
