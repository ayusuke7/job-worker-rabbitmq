import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const RabbitMQProvider = {
  name: 'RABBITMQ_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')!],
        // queue: configService.get<string>('RABBITMQ_QUEUE'),
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
