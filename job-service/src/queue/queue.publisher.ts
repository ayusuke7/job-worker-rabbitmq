import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class QueuePublisher {
  private readonly logger = new Logger(QueuePublisher.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publish(pattern: string, data: any): Promise<void> {
    await firstValueFrom(
      this.client.emit(pattern, data).pipe(
        catchError((err) => {
          this.logger.error(err);
          return throwError(
            () => new Error(`Erro publishin in pattern: ${pattern}`),
          );
        }),
      ),
    );
  }
}
