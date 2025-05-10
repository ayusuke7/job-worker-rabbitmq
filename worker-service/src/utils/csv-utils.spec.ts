import * as fs from 'fs';
import { CsvUtils } from './csv-utils';

jest.mock('fs');

describe('CsvUtils', () => {
  describe('dataToCSV', () => {
    it('should return an empty array when data is empty', () => {
      const result = CsvUtils.dataToCSV([]);
      expect(result).toEqual([]);
    });

    it('should convert data to CSV format without custom headers', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];
      const result = CsvUtils.dataToCSV(data);
      expect(result).toEqual(['name,age', 'Alice,25', 'Bob,30']);
    });

    it('should convert data to CSV format with custom headers', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];
      const customHeaders = [
        { key: 'name', label: 'Full Name' },
        { key: 'age', label: 'Age (Years)' },
      ];
      const result = CsvUtils.dataToCSV(data, customHeaders);
      expect(result).toEqual(['Full Name,Age (Years)', 'Alice,25', 'Bob,30']);
    });

    it('should handle special characters in data', () => {
      const data = [
        { name: 'Alice, "The Great"', age: 25 },
        { name: 'Bob\nSmith', age: 30 },
      ];
      const result = CsvUtils.dataToCSV(data);
      expect(result).toEqual([
        'name,age',
        '"Alice, ""The Great""",25',
        '"Bob\nSmith",30',
      ]);
    });
  });

  describe('saveToCSVFile', () => {
    it('should save CSV rows to a file with .csv extension', () => {
      const filepath = 'test';
      const csvRows = ['name,age', 'Alice,25', 'Bob,30'];
      const writeFileSyncMock = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation(() => {});

      const result = CsvUtils.saveToCSVFile(filepath, csvRows);

      expect(writeFileSyncMock).toHaveBeenCalledWith(
        'test.csv',
        'name,age\nAlice,25\nBob,30',
      );
      expect(result).toBe(true);
    });

    it('should handle errors when saving to a file', () => {
      const filepath = 'test';
      const csvRows = ['name,age', 'Alice,25', 'Bob,30'];
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
        throw new Error('File system error');
      });

      const result = CsvUtils.saveToCSVFile(filepath, csvRows);

      expect(result).toBe(false);
    });
  });
});
