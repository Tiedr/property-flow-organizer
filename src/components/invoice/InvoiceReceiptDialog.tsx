
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceReceipt from "./InvoiceReceipt";
import { Invoice, InvoiceItem, ClientDetails } from "@/types";

interface InvoiceReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  client?: ClientDetails;
  estateName?: string;
  invoiceItems?: InvoiceItem[];
}

const InvoiceReceiptDialog: React.FC<InvoiceReceiptDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  client,
  estateName,
  invoiceItems,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 200);
  };

  // Add print-specific styles when printing
  useEffect(() => {
    if (isPrinting) {
      document.body.classList.add("printing");
    } else {
      document.body.classList.remove("printing");
    }
    
    return () => {
      document.body.classList.remove("printing");
    };
  }, [isPrinting]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent print:shadow-none print:max-w-none">
        <InvoiceReceipt 
          invoice={invoice}
          client={client}
          estateName={estateName}
          items={invoiceItems}
          onClose={onClose}
          onPrint={handlePrint}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceReceiptDialog;
