import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { QueueService } from './services/queue.service';

@Controller()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @MessagePattern('seller.process')
  async handleMessage(@Payload() payload: any, @Ctx() context: RmqContext) {
    await this.queueService.handleMessage(payload, context);
  }
}
