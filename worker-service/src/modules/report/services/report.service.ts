import { Injectable, Logger } from '@nestjs/common';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { ProductService } from '../../../modules/product/services/product.service';
import { SaleService } from '../../../modules/sale/services/sale.service';
import { CsvUtils } from '../../../utils/csv-utils';
import { Seller } from '../../shared/entities/seller.entity';
import { Report } from '../entities/report.entity';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
  ) {}

  async generateReport(seller: Seller): Promise<void> {
    const customers = await this.customerService.getCustomers();
    const products = await this.productService.getProducts();
    const sales = await this.saleService.getSales();

    const reports: Report[] = [];

    sales
      .filter((sale) => sale.vendedor_id === seller.id)
      .forEach((sale) => {
        const product = products.find((p) => p.id === sale.produto_id);
        const customer = customers.find((c) => c.id === sale.cliente_id);

        if (product && customer) {
          reports.push({
            seler_id: seller.id,
            seller_name: seller.nome,
            seller_phone: seller.telefone,
            product_id: product.id,
            product_name: product.nome,
            product_price: product.preco,
            product_sku: product.sku,
            customer_id: customer.id,
            customer_name: customer.nome,
            customer_email: customer.email,
            customer_phone: customer.telefone,
          });
        }
      });

    if (reports.length) {
      this.createCsvReport(reports, seller);
    }
  }

  private createCsvReport(reports: Report[], seller: Seller) {
    const csvRows = CsvUtils.dataToCSV(reports, [
      { key: 'seler_id', label: 'ID do Vendedor' },
      { key: 'seller_name', label: 'Nome do Vendedor' },
      { key: 'seller_phone', label: 'Telefone do Vendedor' },
      { key: 'customer_id', label: 'ID do Cliente' },
      { key: 'customer_name', label: 'Nome do Cliente' },
      { key: 'customer_email', label: 'Email do Cliente' },
      { key: 'customer_phone', label: 'Telefone do Cliente' },
      { key: 'product_id', label: 'ID do Produto' },
      { key: 'product_name', label: 'Nome do Produto' },
      { key: 'product_price', label: 'Preço do Produto' },
      { key: 'product_sku', label: 'SKU do Produto' },
    ]);
    CsvUtils.saveToCSVFile(`./reports/vendedor-${seller.id}.csv`, csvRows);
    this.logger.debug(`CSV Report generated for seller: ${seller.id}`);
  }
}
