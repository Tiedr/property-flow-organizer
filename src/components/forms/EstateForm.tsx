
import { useState } from "react";
import { EstateEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface EstateFormProps {
  estate?: EstateEntry;
  onSubmit: (estate: Omit<EstateEntry, "id">) => void;
  onCancel: () => void;
}

const EstateForm = ({ estate, onSubmit, onCancel }: EstateFormProps) => {
  const [formData, setFormData] = useState({
    clientName: estate?.clientName || "",
    uniqueId: estate?.uniqueId || "",
    representative: estate?.representative || "",
    plotNumbers: estate?.plotNumbers?.join(", ") || "",
    amount: estate?.amount || 0,
    amountPaid: estate?.amountPaid || 0,
    documentsReceived: estate?.documentsReceived?.join(", ") || "",
    phoneNumber: estate?.phoneNumber || "",
    email: estate?.email || "",
    address: estate?.address || "",
    paymentStatus: estate?.paymentStatus || "Pending",
    nextDueDate: estate?.nextDueDate || new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.uniqueId.trim()) {
      newErrors.uniqueId = "Unique ID is required";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      const estateData: Omit<EstateEntry, "id"> = {
        ...formData,
        plotNumbers: formData.plotNumbers.split(",").map(plot => plot.trim()).filter(plot => plot !== ""),
        documentsReceived: formData.documentsReceived.split(",").map(doc => doc.trim()).filter(doc => doc !== ""),
        amount: Number(formData.amount),
        amountPaid: Number(formData.amountPaid),
        paymentStatus: formData.paymentStatus as "Paid" | "Partial" | "Pending" | "Overdue",
      };
      
      onSubmit(estateData);
      toast({
        title: estate ? "Entry updated" : "Entry created",
        description: `${formData.clientName} has been ${estate ? "updated" : "created"} successfully.`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={errors.clientName ? "border-red-500" : ""}
          />
          {errors.clientName && (
            <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="uniqueId">Unique ID</Label>
          <Input
            id="uniqueId"
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleChange}
            className={errors.uniqueId ? "border-red-500" : ""}
          />
          {errors.uniqueId && (
            <p className="text-sm text-red-500 mt-1">{errors.uniqueId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="representative">Representative</Label>
          <Input
            id="representative"
            name="representative"
            value={formData.representative}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="plotNumbers">Plot Numbers (comma separated)</Label>
          <Input
            id="plotNumbers"
            name="plotNumbers"
            value={formData.plotNumbers}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="amountPaid">Amount Paid</Label>
          <Input
            id="amountPaid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="documentsReceived">Documents Received (comma separated)</Label>
          <Input
            id="documentsReceived"
            name="documentsReceived"
            value={formData.documentsReceived}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select
            value={formData.paymentStatus}
            onValueChange={(value) => handleSelectChange("paymentStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="nextDueDate">Next Due Date</Label>
          <Input
            id="nextDueDate"
            name="nextDueDate"
            type="date"
            value={formData.nextDueDate}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {estate ? "Update Estate" : "Create Estate"}
        </Button>
      </div>
    </form>
  );
};

export default EstateForm;
