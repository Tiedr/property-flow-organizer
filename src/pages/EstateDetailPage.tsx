
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generateMockEstateData } from "@/services/estateData";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import EstateForm from "@/components/forms/EstateForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const EstateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [estate, setEstate] = useState<Estate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this estate from an API
    // For now, we'll generate the mock data and find the estate by id
    const allEstates = generateMockEstateData(15);
    const foundEstate = allEstates.find(e => e.id === id);
    
    if (foundEstate) {
      setEstate(foundEstate);
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEstateUpdate = (updatedEstateData: Omit<Estate, "id">) => {
    if (!estate) return;
    
    const updatedEstate: Estate = {
      id: estate.id,
      ...updatedEstateData
    };
    
    setEstate(updatedEstate);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Estate Updated",
      description: `Estate ${updatedEstate.uniqueId} has been updated successfully.`
    });
  };

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Estate Deleted",
      description: `Estate ${estate?.uniqueId} has been deleted successfully.`
    });
    
    // Go back to the estates list
    navigate("/");
  };

  if (!estate) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Estate not found</p>
          <Button onClick={handleBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleBack} variant="ghost" className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Estate: {estate.uniqueId}</h1>
            <p className="text-muted-foreground">Client: {estate.clientName}</p>
          </div>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-1/3 font-semibold">Field</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Client Name</TableCell>
              <TableCell>{estate.clientName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Unique ID</TableCell>
              <TableCell>{estate.uniqueId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Representative</TableCell>
              <TableCell>{estate.representative || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Plot Numbers</TableCell>
              <TableCell>{estate.plotNumbers.join(", ") || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Amount</TableCell>
              <TableCell>₹{estate.amount.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Amount Paid</TableCell>
              <TableCell>₹{estate.amountPaid.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Documents Received</TableCell>
              <TableCell>{estate.documentsReceived.length > 0 ? estate.documentsReceived.join(", ") : "None"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Phone Number</TableCell>
              <TableCell>{estate.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell>{estate.email || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Address</TableCell>
              <TableCell>{estate.address || "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Status</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  estate.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                  estate.paymentStatus === "Partial" ? "bg-amber-100 text-amber-800" :
                  estate.paymentStatus === "Overdue" ? "bg-red-100 text-red-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {estate.paymentStatus}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Next Due Date</TableCell>
              <TableCell>{estate.nextDueDate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Edit Estate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Estate</DialogTitle>
            <DialogDescription>
              Make changes to the estate information below.
            </DialogDescription>
          </DialogHeader>
          <EstateForm
            estate={estate}
            onSubmit={handleEstateUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete estate {estate.uniqueId}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateDetailPage;
