import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export class CsvUtils {
  /**
   * Convert list of objects to CSV pattern
   * @param data Array of objects to be converted
   * @returns Array de strings each string is a line of CSV
   */
  static dataToCSV<T extends Record<string, any>>(
    data: T[],
    customHeaders?: { key: string; label: string }[],
  ): string[] {
    if (data.length === 0) {
      return [];
    }

    const headers = Object.keys(data[0]);
    const csvHeaders: string[] = [...headers];
    const csvRows: string[] = [];

    if (customHeaders) {
      customHeaders.forEach(({ key, label }) => {
        const i = csvHeaders.indexOf(key);
        if (i > -1) csvHeaders.splice(i, 1, label);
      });
    }

    csvRows.push(csvHeaders.join(','));
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header] ? row[header].toString() : '';

        if (
          value.includes(',') ||
          value.includes('"') ||
          value.includes('\n')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows;
  }

  /**
   * Saves an array of strings to a CSV file
   * @param filepath Path to the CSV file
   * @param csvRows Array of strings where each string is a line in the CSV
   * @returns true if the file was saved successfully, false otherwise
   */
  static saveToCSVFile(filepath: string, csvRows: string[]) {
    if (filepath.lastIndexOf('.csv') === -1) {
      filepath += '.csv';
    }

    try {
      fs.writeFileSync(filepath, csvRows.join('\n'));
      return true;
    } catch (error) {
      Logger.error(error);
    }

    return false;
  }
}
