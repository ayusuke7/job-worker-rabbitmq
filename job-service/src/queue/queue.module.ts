import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
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
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class JobModule {}
