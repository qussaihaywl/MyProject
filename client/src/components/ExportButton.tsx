import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { handleExport, EXPORT_OPTIONS } from '@/lib/export-utils';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  filename: string;
  sheetName?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function ExportButton({
  data,
  filename,
  sheetName = 'البيانات',
  variant = 'outline',
  size = 'default',
  showLabel = true,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async (format: 'csv' | 'excel' | 'xlsx' | 'json') => {
    try {
      setIsExporting(true);

      if (!data || data.length === 0) {
        toast.error('لا توجد بيانات للتصدير');
        return;
      }

      await handleExport(data, filename, format, sheetName);
      toast.success(`تم تصدير البيانات بنجاح إلى ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('حدث خطأ أثناء التصدير');
    } finally {
      setIsExporting(false);
    }
  };

  const getIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileText size={16} />;
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet size={16} />;
      case 'json':
        return <FileJson size={16} />;
      default:
        return <Download size={16} />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isExporting || !data || data.length === 0}
          className="gap-2"
        >
          <Download size={16} />
          {showLabel && 'تصدير البيانات'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>اختر صيغة التصدير</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {EXPORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleExportClick(option.value as any)}
            disabled={isExporting}
            className="gap-2 cursor-pointer"
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportButton;
