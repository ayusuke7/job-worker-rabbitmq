import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { QueuePublisher } from './queue.publisher';

describe('[QueuePublisher]', () => {
  let queuePublisher: QueuePublisher;
  let clientProxyMock: jest.Mocked<ClientProxy>;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    clientProxyMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientProxy>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueuePublisher,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    queuePublisher = module.get<QueuePublisher>(QueuePublisher);
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(queuePublisher).toBeDefined();
  });

  it('should publish a message successfully', async () => {
    clientProxyMock.emit.mockReturnValue(of(null));

    await expect(
      queuePublisher.publish('test-pattern', { key: 'value' }),
    ).resolves.not.toThrow();

    expect(clientProxyMock.emit).toHaveBeenCalledWith('test-pattern', {
      key: 'value',
    });
    expect(clientProxyMock.emit).toHaveBeenCalledTimes(1);
  });

  it('should log an error and throw when publishing fails', async () => {
    const error = new Error('Test error');
    clientProxyMock.emit.mockReturnValue(throwError(() => error));

    await expect(
      queuePublisher.publish('test-pattern', { key: 'value' }),
    ).rejects.toThrow('Erro publishin in pattern: test-pattern');

    expect(clientProxyMock.emit).toHaveBeenCalledWith('test-pattern', {
      key: 'value',
    });
    expect(clientProxyMock.emit).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy).toHaveBeenCalledWith(error);
  });
});
