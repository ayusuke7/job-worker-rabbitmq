import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Controller()
export class QueueController {
  constructor(private readonly workerService: QueueService) {}

  @MessagePattern('seller.process')
  async handleMessage(@Payload() payload: any, @Ctx() context: RmqContext) {
    await this.workerService.handleMessage(payload, context);
  }
}
