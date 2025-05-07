import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Estate, EstateEntry } from "@/types";
import { getEstateById } from "@/services/estateData";
import DataTable from "@/components/data/DataTable";
import { FilePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createClientInvoice } from "@/services/clientData";

const EstateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estate, setEstate] = useState<Estate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");

  useEffect(() => {
    const fetchEstate = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "Estate ID is missing",
            variant: "destructive",
          });
          return;
        }
        const estateData = await getEstateById(id);
        setEstate(estateData);
      } catch (error: any) {
        console.error("Error fetching estate:", error);
        toast({
          title: "Error",
          description: "Failed to load estate: " + (error.message || "Unknown error"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEstate();
    }
  }, [id, toast, user]);

  const handleGoBack = () => {
    navigate("/estates");
  };

  const handleCreateInvoice = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setIsCreateInvoiceDialogOpen(true);
  };

  const handleInvoiceSubmit = async () => {
    if (!selectedClientId) return;
    
    try {
      const amount = parseFloat(invoiceAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid amount greater than zero",
          variant: "destructive"
        });
        return;
      }
      
      await createClientInvoice(selectedClientId, {
        amount,
        status: "Pending",
      });
      
      setIsCreateInvoiceDialogOpen(false);
      setInvoiceAmount("");
      
      toast({
        title: "Invoice Created",
        description: `Invoice for ₦${amount.toLocaleString()} has been created for ${selectedClientName}.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Loading estate details...</p>
        </div>
      </Layout>
    );
  }

  if (!estate) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Estate not found</p>
          <Button onClick={handleGoBack} variant="outline" className="mt-4">
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const estateEntries = estate.entries || [];

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <Button onClick={handleGoBack} variant="ghost">
            ← Back to Estates
          </Button>
          <h1 className="text-3xl font-bold text-white mt-4">{estate.name}</h1>
          <p className="text-muted-foreground">{estate.description || "No description provided"}</p>
        </div>

        <div className="glass-card">
          <h2 className="text-2xl font-semibold mb-4 text-white">Estate Entries</h2>
          {estateEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No entries found for this estate.</p>
            </div>
          ) : (
            <DataTable
              data={estateEntries}
              columns={[
                { key: "clientName", header: "Client Name" },
                { key: "uniqueId", header: "Unique ID" },
                { key: "plotNumbers", header: "Plot Numbers" },
                { key: "amount", header: "Amount" },
                { key: "amountPaid", header: "Amount Paid" },
                { key: "paymentStatus", header: "Payment Status" },
                { key: "nextDueDate", header: "Next Due Date" },
              ]}
              actions={(entry) => (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateInvoice(entry.clientId || "", entry.clientName);
                  }}
                  className="apple-button-secondary"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Invoice
                </Button>
              )}
              onRowClick={(entry) => {
                navigate(`/clients/${entry.clientId}`);
              }}
            />
          )}
        </div>
      </div>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceDialogOpen} onOpenChange={setIsCreateInvoiceDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Create New Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for client {selectedClientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Invoice Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateInvoiceDialogOpen(false)}
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvoiceSubmit}
              className="apple-button"
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateDetailPage;
