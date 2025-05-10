import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [HttpModule],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
