import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from '../../../modules/customer/entities/customer.entity';
import { CustomerService } from '../../../modules/customer/services/customer.service';
import { Product } from '../../../modules/product/entities/product.entity';
import { ProductService } from '../../../modules/product/services/product.service';
import { Sale } from '../../../modules/sale/entities/sale.entity';
import { SaleService } from '../../../modules/sale/services/sale.service';
import { CsvUtils } from '../../../utils/csv-utils';
import { Seller } from '../../shared/entities/seller.entity';
import { ReportService } from './report.service';

jest.mock('../../../utils/csv-utils');

const mockSeller: Seller = {
  id: '1',
  nome: 'John Doe',
  telefone: '123456789',
};

const mockCustomers: Customer[] = [
  {
    id: '1',
    nome: 'Customer A',
    email: 'a@example.com',
    telefone: '111111111',
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    tipo: 'any_type',
    nome: 'any_name',
    preco: 'any_price',
    sku: 'any_sku',
    vendedor_id: '1',
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    cliente_id: '1',
    produto_id: '1',
    vendedor_id: '1',
  },
];

describe('[ReportService]', () => {
  let reportService: ReportService;
  let customerService: CustomerService;
  let productService: ProductService;
  let saleService: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: CustomerService,
          useValue: {
            getCustomers: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProducts: jest.fn(),
          },
        },
        {
          provide: SaleService,
          useValue: {
            getSales: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
    customerService = module.get<CustomerService>(CustomerService);
    productService = module.get<ProductService>(ProductService);
    saleService = module.get<SaleService>(SaleService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(reportService).toBeDefined();
  });

  it('should generate a CSV report for a seller', async () => {
    jest
      .spyOn(customerService, 'getCustomers')
      .mockResolvedValue(mockCustomers);

    jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);
    jest.spyOn(saleService, 'getSales').mockResolvedValue(mockSales);

    const saveToCSVFileSpy = jest.spyOn(CsvUtils, 'saveToCSVFile');

    await reportService.generateReport(mockSeller);

    expect(customerService.getCustomers).toHaveBeenCalled();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(saleService.getSales).toHaveBeenCalled();
    expect(saveToCSVFileSpy).toHaveBeenCalledWith(
      './reports/vendedor-1.csv',
      undefined,
    );
  });

  it('should not generate a report if no matching sales are found', async () => {
    jest.spyOn(customerService, 'getCustomers').mockResolvedValue([]);
    jest.spyOn(productService, 'getProducts').mockResolvedValue([]);
    jest.spyOn(saleService, 'getSales').mockResolvedValue([]);

    const saveToCSVFileSpy = jest.spyOn(CsvUtils, 'saveToCSVFile');

    await reportService.generateReport(mockSeller);

    expect(saveToCSVFileSpy).not.toHaveBeenCalled();
  });
});
