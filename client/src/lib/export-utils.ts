/**
 * Utility functions for exporting data to Excel and CSV formats
 */

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';

  // Add headers
  csvContent += headers.map(h => `"${h}"`).join(',') + '\n';

  // Add rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '""';
      }
      
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      if (typeof value === 'boolean') {
        return value ? '"نعم"' : '"لا"';
      }
      
      if (value instanceof Date) {
        return `"${value.toLocaleDateString('ar-SA')}"`;
      }
      
      return `"${value}"`;
    });
    
    csvContent += values.join(',') + '\n';
  });

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel format (using simple HTML table approach)
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create HTML table
  let html = '<table border="1">';
  
  // Add headers
  html += '<tr>';
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr>';

  // Add rows
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      const value = row[header];
      let cellValue = '';
      
      if (value === null || value === undefined) {
        cellValue = '';
      } else if (typeof value === 'boolean') {
        cellValue = value ? 'نعم' : 'لا';
      } else if (value instanceof Date) {
        cellValue = value.toLocaleDateString('ar-SA');
      } else {
        cellValue = String(value);
      }
      
      html += `<td>${cellValue}</td>`;
    });
    html += '</tr>';
  });

  html += '</table>';

  // Create Excel file
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to XLSX format (more advanced Excel format)
 */
export async function exportToXLSX(data: any[], filename: string, sheetName: string = 'Sheet1') {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx');
    
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to XLSX:', error);
    // Fallback to Excel format
    exportToExcel(data, filename, sheetName);
  }
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to PDF format (requires pdf-lib or similar)
 */
export async function exportToPDF(data: any[], filename: string, title: string = '') {
  try {
    // This would require pdf-lib or jsPDF library
    // For now, we'll provide a basic implementation
    console.warn('PDF export requires additional library installation');
    // Fallback to Excel
    exportToExcel(data, filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
}

/**
 * Generate export options menu
 */
export const EXPORT_OPTIONS = [
  { label: 'تصدير إلى CSV', value: 'csv', icon: '📄' },
  { label: 'تصدير إلى Excel', value: 'excel', icon: '📊' },
  { label: 'تصدير إلى XLSX', value: 'xlsx', icon: '📈' },
  { label: 'تصدير إلى JSON', value: 'json', icon: '{}' },
];

/**
 * Handle export based on format
 */
export async function handleExport(
  data: any[],
  filename: string,
  format: 'csv' | 'excel' | 'xlsx' | 'json' = 'csv',
  sheetName?: string
) {
  switch (format) {
    case 'csv':
      exportToCSV(data, filename);
      break;
    case 'excel':
      exportToExcel(data, filename, sheetName);
      break;
    case 'xlsx':
      await exportToXLSX(data, filename, sheetName);
      break;
    case 'json':
      exportToJSON(data, filename);
      break;
    default:
      exportToCSV(data, filename);
  }
}
