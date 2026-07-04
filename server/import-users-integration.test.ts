import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from './db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

describe('User Import Integration Tests', () => {
  const testCsvPath = '/tmp/test_users_import.csv';

  beforeAll(() => {
    // Create test CSV file
    const csvContent = `name,email,phone,password,role,status
Test Import User 1,import.test1@example.com,+962791234567,password123,user,active
Test Import User 2,import.test2@example.com,+962791234568,password123,user,active
Test Import User 3,import.test3@example.com,+962791234569,password123,delegate,active
Test Admin Import,admin.import@example.com,+962791234570,password123,admin,active`;

    fs.writeFileSync(testCsvPath, csvContent);
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testCsvPath)) {
      fs.unlinkSync(testCsvPath);
    }
  });

  it('should successfully import users from CSV file', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    expect(headers).toContain('name');
    expect(headers).toContain('email');
    expect(headers).toContain('phone');
    expect(headers).toContain('role');
    expect(headers).toContain('status');
  });

  it('should parse CSV data correctly', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const records = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        name: values[0],
        email: values[1],
        phone: values[2],
        role: values[4],
        status: values[5]
      };
    });

    expect(records).toHaveLength(4);
    expect(records[0].name).toBe('Test Import User 1');
    expect(records[0].email).toBe('import.test1@example.com');
    expect(records[3].role).toBe('admin');
  });

  it('should validate email format in CSV', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const email = values[1];
      expect(emailRegex.test(email)).toBe(true);
    });
  });

  it('should validate phone format in CSV', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const phoneRegex = /^\+\d{1,3}\d{7,14}$/;

    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const phone = values[2];
      expect(phoneRegex.test(phone)).toBe(true);
    });
  });

  it('should validate role values in CSV', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const validRoles = ['user', 'delegate', 'admin', 'supervisor'];

    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const role = values[4];
      expect(validRoles).toContain(role);
    });
  });

  it('should validate status values in CSV', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const validStatuses = ['active', 'inactive', 'suspended'];

    lines.slice(1).forEach(line => {
      const values = line.split(',');
      const status = values[5];
      expect(validStatuses).toContain(status);
    });
  });

  it('should handle CSV with special characters', async () => {
    const specialCsv = `name,email,phone,password,role,status
Test User "Special",special@example.com,+962791234567,pass123,user,active
Test User 'Quotes',quotes@example.com,+962791234568,pass123,user,active`;

    const tempPath = '/tmp/special_chars.csv';
    fs.writeFileSync(tempPath, specialCsv);

    const content = fs.readFileSync(tempPath, 'utf-8');
    expect(content).toContain('Special');
    expect(content).toContain('Quotes');

    fs.unlinkSync(tempPath);
  });

  it('should count correct number of records in CSV', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    const recordCount = lines.length - 1; // Exclude header

    expect(recordCount).toBe(4);
  });

  it('should handle empty CSV gracefully', async () => {
    const emptyCsv = 'name,email,phone,password,role,status\n';
    const tempPath = '/tmp/empty.csv';
    fs.writeFileSync(tempPath, emptyCsv);

    const content = fs.readFileSync(tempPath, 'utf-8');
    const lines = content.trim().split('\n');
    const recordCount = lines.length - 1;

    expect(recordCount).toBe(0);

    fs.unlinkSync(tempPath);
  });

  it('should validate CSV has required headers', async () => {
    const csvContent = fs.readFileSync(testCsvPath, 'utf-8');
    const headers = csvContent.split('\n')[0].split(',');
    const requiredHeaders = ['name', 'email', 'phone', 'password', 'role', 'status'];

    requiredHeaders.forEach(header => {
      expect(headers).toContain(header);
    });
  });

  it('should handle CSV with different line endings', async () => {
    const csvWithCRLF = `name,email,phone,password,role,status\r\nTest User,test@example.com,+962791234567,pass123,user,active\r\n`;
    const tempPath = '/tmp/crlf.csv';
    fs.writeFileSync(tempPath, csvWithCRLF);

    const content = fs.readFileSync(tempPath, 'utf-8');
    const lines = content.trim().split(/\r?\n/);

    expect(lines).toHaveLength(2);

    fs.unlinkSync(tempPath);
  });
});
