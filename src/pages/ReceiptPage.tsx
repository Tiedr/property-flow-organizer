
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Receipt from "@/components/receipt/Receipt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Invoice, ClientDetails } from "@/types";
import { getInvoiceById } from "@/services/invoiceData";
import { getClientById } from "@/services/clientData";
import { ArrowLeft } from "lucide-react";

const ReceiptPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceAndClient = async () => {
      if (!id) {
        toast({ 
          title: "Error", 
          description: "Invoice ID is missing",
          variant: "destructive" 
        });
        navigate("/dashboard");
        return;
      }

      try {
        setLoading(true);
        const invoiceData = await getInvoiceById(id);
        
        if (!invoiceData) {
          toast({
            title: "Not Found",
            description: "The requested invoice could not be found",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
        
        setInvoice(invoiceData);
        
        // Fetch client details if we have a client ID
        if (invoiceData.clientId) {
          try {
            const clientData = await getClientById(invoiceData.clientId);
            if (clientData) {
              setClient(clientData);
            }
          } catch (error) {
            console.error("Error fetching client:", error);
          }
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
        toast({
          title: "Error",
          description: "Failed to load invoice details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInvoiceAndClient();
  }, [id, toast, navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-white mb-6">Receipt Details</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading receipt...</p>
          </div>
        ) : invoice ? (
          <Receipt invoice={invoice} client={client || undefined} />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Receipt not found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReceiptPage;
