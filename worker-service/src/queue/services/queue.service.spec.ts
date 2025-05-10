import { RmqContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../modules/report/services/report.service';
import { Seller } from '../../modules/shared/entities/seller.entity';
import { QueueService } from './queue.service';

const mockSeller: Seller = {
  id: '1',
  nome: 'Seller 1',
  telefone: '123456789',
};

const mockReportService = {
  generateReport: jest.fn(),
};

const mockContext = {
  getChannelRef: jest.fn().mockReturnValue({
    ack: jest.fn(),
    nack: jest.fn(),
  }),
  getMessage: jest.fn().mockReturnValue({}),
} as unknown as RmqContext;

describe('[QueueService]', () => {
  let queueService: QueueService;
  let reportService: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: ReportService, useValue: mockReportService },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
    reportService = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  it('should acknowledge the message if report generation succeeds', async () => {
    jest.spyOn(reportService, 'generateReport').mockResolvedValue(undefined);
    const ackSpy = jest.spyOn(mockContext.getChannelRef(), 'ack');

    await queueService.handleMessage(mockSeller, mockContext);

    expect(reportService.generateReport).toHaveBeenCalledWith(mockSeller);
    expect(ackSpy).toHaveBeenCalledWith(mockContext.getMessage());
  });

  it('should nack the message if report generation fails', async () => {
    const error = new Error('Report generation failed');
    jest.spyOn(reportService, 'generateReport').mockRejectedValue(error);

    const nackSpy = jest.spyOn(mockContext.getChannelRef(), 'nack');
    await queueService.handleMessage(mockSeller, mockContext);

    expect(reportService.generateReport).toHaveBeenCalledWith(mockSeller);
    expect(nackSpy).toHaveBeenCalledWith(
      mockContext.getMessage(),
      false,
      false,
    );
  });
});
