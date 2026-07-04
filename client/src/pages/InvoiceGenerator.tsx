import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Send,
  Eye,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function InvoiceGenerator() {
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Fetch invoices
  const { data: invoicesData } = trpc.invoices.getByUser.useQuery();

  // Generate invoice mutation
  const generateInvoiceMutation = trpc.invoices.generate.useMutation({
    onSuccess: () => {
      toast.success("تم توليد الفاتورة بنجاح!");
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل توليد الفاتورة");
    },
  });

  // Send invoice mutation
  const sendInvoiceMutation = trpc.invoices.send.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال الفاتورة بنجاح!");
    },
    onError: (error: any) => {
      toast.error(error.message || "فشل إرسال الفاتورة");
    },
  });

  const invoices = invoicesData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "pending":
        return "قيد الانتظار";
      case "overdue":
        return "متأخر";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            الفواتير الإلكترونية
          </h1>
          <p className="text-slate-600">
            إدارة وتحميل الفواتير الخاصة بك
          </p>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">لا توجد فواتير حتى الآن</p>
              </CardContent>
            </Card>
          ) : (
            invoices.map((invoice: any) => (
              <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          فاتورة #{invoice.invoiceNumber}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {new Date(invoice.createdAt).toLocaleDateString("ar-JO")}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(invoice.status)}
                        {getStatusLabel(invoice.status)}
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-600">المبلغ الإجمالي</p>
                      <p className="text-lg font-bold text-slate-900">
                        {invoice.totalAmount?.toFixed(2)} د.ا
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">المبلغ المدفوع</p>
                      <p className="text-lg font-bold text-green-600">
                        {invoice.paidAmount?.toFixed(2)} د.ا
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">المبلغ المتبقي</p>
                      <p className="text-lg font-bold text-amber-600">
                        {(invoice.totalAmount - invoice.paidAmount)?.toFixed(2)} د.ا
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          عرض
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>فاتورة #{invoice.invoiceNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="bg-white p-8 rounded-lg">
                          {/* Invoice Preview */}
                          <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-slate-900">
                              فاتورة
                            </h2>
                            <p className="text-slate-600">
                              #{invoice.invoiceNumber}
                            </p>
                          </div>

                          {/* Invoice Details */}
                          <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                              <p className="text-sm text-slate-600">من:</p>
                              <p className="font-semibold text-slate-900">
                                Rose Online
                              </p>
                              <p className="text-sm text-slate-600">
                                عمّان، الأردن
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">إلى:</p>
                              <p className="font-semibold text-slate-900">
                                {user?.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          {/* Items Table */}
                          <table className="w-full mb-8">
                            <thead>
                              <tr className="border-b-2 border-slate-300">
                                <th className="text-right py-2 text-slate-900">
                                  البند
                                </th>
                                <th className="text-center py-2 text-slate-900">
                                  الكمية
                                </th>
                                <th className="text-center py-2 text-slate-900">
                                  السعر
                                </th>
                                <th className="text-left py-2 text-slate-900">
                                  المجموع
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.items?.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-slate-200">
                                  <td className="text-right py-3">
                                    {item.description}
                                  </td>
                                  <td className="text-center py-3">
                                    {item.quantity}
                                  </td>
                                  <td className="text-center py-3">
                                    {item.price?.toFixed(2)}
                                  </td>
                                  <td className="text-left py-3">
                                    {(item.quantity * item.price)?.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Totals */}
                          <div className="flex justify-end mb-8">
                            <div className="w-64 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-600">المجموع الفرعي:</span>
                                <span className="text-slate-900">
                                  {invoice.subtotal?.toFixed(2)} د.ا
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">الضريبة:</span>
                                <span className="text-slate-900">
                                  {invoice.tax?.toFixed(2)} د.ا
                                </span>
                              </div>
                              <div className="flex justify-between border-t-2 border-slate-300 pt-2 font-bold">
                                <span className="text-slate-900">المجموع:</span>
                                <span className="text-slate-900">
                                  {invoice.totalAmount?.toFixed(2)} د.ا
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.print()}
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              طباعة
                            </Button>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              تحميل PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        sendInvoiceMutation.mutate({ invoiceId: invoice.id })
                      }
                      disabled={sendInvoiceMutation.isPending}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      إرسال
                    </Button>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
