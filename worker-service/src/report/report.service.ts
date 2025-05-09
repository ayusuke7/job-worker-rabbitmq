import { Injectable, Logger } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { ProductService } from 'src/product/product.service';
import { SaleService } from 'src/sale/sale.service';
import { dataToCSV, saveToCSVFile } from 'src/share/csv-utils';

export class Seller {
  id: string;
  nome: string;
  telefone: string;
}

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
  ) {}

  async getReport(seller: Seller): Promise<void> {
    const customers = await this.customerService.getCustomers();
    const products = await this.productService.getProducts();
    const sales = await this.saleService.getSales();

    const reports: any[] = [];

    const salesBySeller = sales.filter(
      (sale) => sale.vendedor_id === seller.id,
    );

    for (const sale of salesBySeller) {
      const product = products.find(
        (product) => product.id === sale.product_id,
      );
      const customer = customers.find(
        (customer) => customer.id === sale.cliente_id,
      );

      reports.push({
        ...seller,
        ...product,
        ...customer,
      });
    }

    this.logger.log(`Report generated for seller: ${seller.id}`);

    await saveToCSVFile(`./${seller.id}.csv`, dataToCSV(reports));
  }
}
