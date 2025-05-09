import { parse } from '@fast-csv/parse';
import { EOL } from 'os';

/**
 * Converte uma lista de objetos em um array de strings representando um CSV
 * @param data Array de objetos a serem convertidos para CSV
 * @returns Array de strings onde cada string é uma linha do CSV
 */
export function dataToCSV<T extends Record<string, any>>(data: T[]): string[] {
  if (data.length === 0) {
    return [];
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [headers.join(',')];

  data.forEach((item) => {
    const values = headers.map((header) => {
      const value =
        item[header] === null || item[header] === undefined
          ? ''
          : String(item[header]);

      // Se o valor contém vírgula, aspas ou quebra de linha, coloca entre aspas duplas
      // E escapa aspas duplas dentro do valor duplicando-as
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });

    csvRows.push(values.join(','));
  });

  return csvRows;
}

export function saveToCSVFile(filepath: string, csvRows: string[]) {
  const stream = parse({ headers: true })
    .on('error', (error) => console.error(error))
    .on('data', (row) => console.log(row))
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

  stream.write(csvRows.join(EOL));
  stream.end();
}
