import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class JobModule {}
