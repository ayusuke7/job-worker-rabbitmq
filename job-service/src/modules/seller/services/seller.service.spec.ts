import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QueuePublisher } from '../../../queue/queue.publisher';
import { Seller } from '../entities/seller.entity';
import { SellerApiService } from './seller-api.service';
import { SellerService } from './seller.service';

const mockSellers: Seller[] = [
  { id: '1', nome: 'Seller 1', telefone: '123456789' },
  { id: '2', nome: 'Seller 2', telefone: '123456789' },
];

describe('[SellerService]', () => {
  let service: SellerService;
  let queueService: QueuePublisher;
  let configService: ConfigService;
  let sellerApiService: SellerApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerService,
        {
          provide: QueuePublisher,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-routing-key'),
          },
        },
        {
          provide: SellerApiService,
          useValue: {
            getSellers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SellerService>(SellerService);
    queueService = module.get<QueuePublisher>(QueuePublisher);
    configService = module.get<ConfigService>(ConfigService);
    sellerApiService = module.get<SellerApiService>(SellerApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process sellers and publish them to the queue', async () => {
    jest.spyOn(sellerApiService, 'getSellers').mockResolvedValue(mockSellers);
    jest.spyOn(queueService, 'publish').mockResolvedValue(undefined);

    const result = await service.processSellers();

    expect(sellerApiService.getSellers).toHaveBeenCalled();
    expect(queueService.publish).toHaveBeenCalledTimes(mockSellers.length);
    expect(queueService.publish).toHaveBeenCalledWith(
      'test-routing-key',
      mockSellers[0],
    );
    expect(queueService.publish).toHaveBeenCalledWith(
      'test-routing-key',
      mockSellers[1],
    );
    expect(result).toEqual({
      message: 'Sellers processed successfully',
      count: mockSellers.length,
    });
  });

  it('should log an error and throw if processing fails', async () => {
    const error = new Error('Test error');
    jest.spyOn(sellerApiService, 'getSellers').mockRejectedValue(error);
    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation();

    await expect(service.processSellers()).rejects.toThrow(
      'Failed to process sellers',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(error);
  });
});
