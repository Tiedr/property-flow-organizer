
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice, InvoiceItem, ClientDetails } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Printer, Save, Download } from "lucide-react";
import logo from "/lovable-uploads/2599a9a8-5e42-4df4-b098-b188c2704994.png";

interface ReceiptProps {
  invoice: Invoice;
  client?: ClientDetails;
  onClose?: () => void;
}

const Receipt = ({ invoice, client, onClose }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt-${invoice.id}`,
  });
  
  const handleSave = () => {
    handlePrint();
  };
  
  const formattedDate = invoice.issuedDate
    ? new Date(invoice.issuedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
    
  const formattedDueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <>
      <div className="mb-4 flex justify-end gap-2">
        <Button variant="outline" onClick={handleSave} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button onClick={handlePrint} className="flex items-center gap-1">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Card className="border border-gray-200 shadow-lg max-w-3xl mx-auto">
        <CardContent ref={receiptRef} className="p-8">
          <div className="receipt-container">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <img src={logo} alt="Company Logo" className="h-16 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RECEIPT</h1>
                  <p className="text-sm text-gray-500">Real Estate Management</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">Receipt #{invoice.id.substring(0, 8)}</p>
                <p className="text-gray-600">Date: {formattedDate}</p>
                {invoice.dueDate && (
                  <p className="text-gray-600">Due: {formattedDueDate}</p>
                )}
                <span className={`inline-block mt-2 py-1 px-2 rounded-full text-xs font-semibold ${
                    invoice.status === "Paid" ? "bg-green-100 text-green-800" :
                    invoice.status === "Partial" ? "bg-amber-100 text-amber-800" :
                    invoice.status === "Overdue" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Client Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="font-semibold text-gray-700">Bill To:</h2>
                  <p className="font-medium">{client?.name || invoice.clientName || "N/A"}</p>
                  <p>{client?.email || "N/A"}</p>
                  <p>{client?.phone || "N/A"}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-700">Payment Info:</h2>
                  <p>Method: Bank Transfer</p>
                  <p>Status: {invoice.status}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b">Description</th>
                    <th className="py-3 px-4 text-right font-semibold text-gray-700 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr key={item.id || index} className="border-b">
                        <td className="py-3 px-4">
                          {item.description}
                          {item.plotDetails && (
                            <div className="text-xs text-gray-500">Plot: {item.plotDetails}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b">
                      <td className="py-3 px-4">Payment</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(invoice.amountPaid)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Payment:</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Property Cost:</span>
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Balance:</span>
                <span>{formatCurrency(invoice.amount - invoice.amountPaid)}</span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2 text-gray-700">Notes:</h3>
                <p className="text-gray-600 p-3 bg-gray-50 rounded">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-12 pt-4 border-t">
              <p>Thank you for your business!</p>
              <p>For any inquiries, please contact our customer support.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Receipt;
