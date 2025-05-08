
import React from "react";
import { format } from "date-fns";
import { Invoice, InvoiceItem, ClientDetails } from "@/types";
import { MapPin, Phone, Mail } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvoiceReceiptProps {
  invoice: Invoice;
  client?: ClientDetails;
  estateName?: string;
  items?: InvoiceItem[];
  onClose?: () => void;
  onPrint?: () => void;
}

const InvoiceReceipt: React.FC<InvoiceReceiptProps> = ({
  invoice,
  client,
  estateName = "Ogbe Court",
  items = [],
  onClose,
  onPrint,
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0) || invoice.amount;
  const balance = totalAmount - invoice.amountPaid;
  
  // Format dates
  const formattedIssueDate = invoice.issuedDate ? format(new Date(invoice.issuedDate), "dd/MM/yyyy") : "";
  const formattedDueDate = invoice.dueDate ? format(new Date(invoice.dueDate), "dd/MM/yyyy") : "";
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white text-black print:shadow-none" id="invoice-receipt">
      {/* Red Header */}
      <div className="bg-red-600 text-white p-6 rounded-t-lg relative">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold tracking-wider">UGHORON</h1>
          <p className="text-xl mt-1">{estateName.toUpperCase()}</p>
        </div>
        {/* Diagonal cut effect */}
        <div className="absolute -bottom-6 left-0 w-full h-12 bg-white transform rotate-1 origin-bottom-left"></div>
      </div>

      {/* Receipt Title */}
      <div className="text-center pt-12 pb-4">
        <h2 className="text-4xl font-bold">Invoice Receipt</h2>
      </div>

      {/* Invoice Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 mx-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <span className="font-semibold">Invoice Date:</span> {formattedIssueDate}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Due Date:</span> {formattedDueDate}
            </div>
            <div>
              <span className="font-semibold">Invoice ID:</span> {invoice.id.slice(0, 5).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold">Estate Location:</span>
            </div>
            <div>{estateName}</div>
          </div>
        </div>
      </div>

      {/* Client Name */}
      <div className="bg-red-600 text-white rounded-full py-4 px-8 mx-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">Client Name:</span>
          <span className="text-xl">{client?.name || invoice.clientName}</span>
        </div>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mb-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Address:</h3>
          <p>{client?.address || "Address not provided"}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Phone Number:</h3>
          <p>{client?.phone || "Phone not provided"}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-gray-50 rounded-lg p-6 mx-4 mb-6">
        <h3 className="text-center bg-gray-300 py-2 rounded mb-4 font-semibold">Invoice Details</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Plot Numbers</th>
                <th className="pb-2">Qnt</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Facility</th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2">{item.plotDetails || "-"}</td>
                    <td className="py-2">1</td>
                    <td className="py-2">{formatCurrency(item.amount)}</td>
                    <td className="py-2">{formatCurrency(item.amount * 0.5)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2">-</td>
                  <td className="py-2">1</td>
                  <td className="py-2">{formatCurrency(invoice.amount)}</td>
                  <td className="py-2">{formatCurrency(invoice.amount * 0.5)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="flex justify-end px-4 mb-8">
        <div className="grid grid-cols-2 gap-4 text-right">
          <div className="font-bold">Paid</div>
          <div>{formatCurrency(invoice.amountPaid)}</div>
          
          <div className="font-bold">Balance</div>
          <div>{formatCurrency(balance)}</div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mb-6">
        <div>
          <p className="mb-1"><strong>Bank:</strong> Zenith Bank</p>
          <p className="mb-1"><strong>Account Number:</strong> 1228680953</p>
          <p><strong>Account Name:</strong> Ughoron Construction and Integrated Services.</p>
        </div>
        <div className="flex flex-col items-end justify-end">
          <div className="border-b border-black w-48 mb-2"></div>
          <p className="font-bold">Imasuen A Izoduwa</p>
          <p>Company CEO</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-red-600 text-white py-4 px-4 rounded-b-lg mt-6 print:fixed print:bottom-0 print:left-0 print:right-0">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center mb-2 md:mb-0">
            <Phone className="w-4 h-4 mr-2" />
            <span>0915 742 0320</span>
          </div>
          <div className="flex items-center mb-2 md:mb-0">
            <Mail className="w-4 h-4 mr-2" />
            <span>info@ughoron.com</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>185, Sapele Road, Benin City</span>
          </div>
        </div>
      </div>

      {/* Print & Close Buttons - Hide when printing */}
      <div className="flex justify-end mt-6 p-4 print:hidden">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md mr-2 hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
