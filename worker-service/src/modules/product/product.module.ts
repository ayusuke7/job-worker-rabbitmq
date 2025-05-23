import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';

@Module({
  imports: [HttpModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
