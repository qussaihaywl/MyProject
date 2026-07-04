import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Upload, Download, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function ImportUsers() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = trpc.users.importUsersFromFile.useMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('يرجى اختيار ملف CSV فقط');
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setIsLoading(true);
    try {
      const fileContent = await file.text();
      const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

      const result = await importMutation.mutateAsync({
        fileContent: base64Content,
        fileName: file.name,
        fileType: 'csv',
      });

      setResults(result);
      toast.success(`تم استيراد ${result.success} مستخدم بنجاح`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(error.message || 'خطأ في الاستيراد');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'العنوان', 'المدينة', 'الدور', 'الحالة'];
    const csv = headers.join(',') + '\n' +
      'أحمد محمد,ahmed@example.com,0778989135,شارع الملك,عمّان,user,active\n' +
      'فاطمة علي,fatima@example.com,0779876543,شارع النيل,الزرقاء,delegate,active';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-users.csv');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-2">استيراد المستخدمين</h1>
          <p className="text-red-700">قم بتحميل ملف CSV يحتوي على بيانات المستخدمين الجدد</p>
        </div>

        {/* Main Card */}
        <Card className="border-2 border-red-200 shadow-lg">
          <div className="p-8">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center hover:border-red-500 transition">
                <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-red-900 mb-2">اختر ملف CSV</p>
                <p className="text-red-700 mb-4">اسحب الملف هنا أو انقر لاختيار ملف</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  اختر الملف
                </Button>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">
                    ✓ تم اختيار الملف: <strong>{file.name}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Template Section */}
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">📋 تنسيق الملف المطلوب</h3>
              <p className="text-blue-700 mb-4">
                يجب أن يحتوي الملف على الأعمدة التالية (بالترتيب):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="bg-white p-2 rounded border border-blue-200">الاسم</div>
                <div className="bg-white p-2 rounded border border-blue-200">البريد الإلكتروني</div>
                <div className="bg-white p-2 rounded border border-blue-200">الهاتف</div>
                <div className="bg-white p-2 rounded border border-blue-200">العنوان</div>
                <div className="bg-white p-2 rounded border border-blue-200">المدينة</div>
                <div className="bg-white p-2 rounded border border-blue-200">الدور</div>
                <div className="bg-white p-2 rounded border border-blue-200">الحالة</div>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                تحميل نموذج الملف
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleImport}
                disabled={!file || isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  'استيراد المستخدمين'
                )}
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setResults(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                variant="outline"
                className="border-red-300 text-red-700"
              >
                إلغاء
              </Button>
            </div>

            {/* Results Section */}
            {results && (
              <div className="space-y-4">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-900">نتائج الاستيراد</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-700 text-sm">المستخدمون المستوردون بنجاح</p>
                      <p className="text-3xl font-bold text-green-600">{results.success}</p>
                    </div>
                    <div>
                      <p className="text-red-700 text-sm">المستخدمون الفاشلون</p>
                      <p className="text-3xl font-bold text-red-600">{results.failed}</p>
                    </div>
                  </div>
                </div>

                {/* Errors Section */}
                {results.errors.length > 0 && (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h3 className="font-semibold text-red-900">الأخطاء</h3>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.errors.map((error: string, index: number) => (
                        <p key={index} className="text-red-700 text-sm">
                          • {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 border-2 border-yellow-200 bg-yellow-50">
          <div className="p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">ℹ️ ملاحظات مهمة</h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• يجب أن يكون الملف بصيغة CSV (قيم مفصولة بفواصل)</li>
              <li>• البريد الإلكتروني والاسم مطلوبان لكل مستخدم</li>
              <li>• إذا كان البريد الإلكتروني موجوداً بالفعل، سيتم تخطي المستخدم</li>
              <li>• كلمة المرور الافتراضية هي اسم المستخدم قبل @ في البريد الإلكتروني</li>
              <li>• الأدوار المتاحة: user, delegate, supervisor, admin</li>
              <li>• الحالات المتاحة: active, inactive, suspended, pending</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
