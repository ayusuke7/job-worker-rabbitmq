import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const RabbitMQProvider = {
  provide: 'RABBITMQ_PROVIDER',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      name: 'RABBITMQ_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: [
          configService.get<string>('RABBITMQ_URL') ||
            'amqp://admin:admin@localhost:5672',
        ],
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
