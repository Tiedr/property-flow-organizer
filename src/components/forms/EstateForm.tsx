import { useState, useEffect } from "react";
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
import { findClientsByUniqueId } from "@/services/clientData";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Check, Search, UserPlus } from "lucide-react";

interface EstateFormProps {
  entry?: EstateEntry | null;
  onSubmit: (entry: Omit<EstateEntry, "id">) => void;
  onCancel: () => void;
}

const EstateForm = ({ entry, onSubmit, onCancel }: EstateFormProps) => {
  const [formData, setFormData] = useState({
    clientName: entry?.clientName || "",
    uniqueId: entry?.uniqueId || "",
    representative: entry?.representative || "",
    plotNumbers: entry?.plotNumbers?.join(", ") || "",
    amount: entry?.amount || 0,
    amountPaid: entry?.amountPaid || 0,
    documentsReceived: entry?.documentsReceived?.join(", ") || "",
    phoneNumber: entry?.phoneNumber || "",
    email: entry?.email || "",
    address: entry?.address || "",
    paymentStatus: entry?.paymentStatus || "Pending",
    nextDueDate: entry?.nextDueDate || new Date().toISOString().split('T')[0],
    clientId: entry?.clientId || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSearchResults, setClientSearchResults] = useState<Array<{id: string, name: string, uniqueId: string}>>([]);
  const [isSearchingClients, setIsSearchingClients] = useState(false);
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
    
    // If uniqueId is changed, search for clients
    if (name === "uniqueId" && value.length >= 3) {
      searchClients(value);
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

  const searchClients = async (query: string) => {
    if (query.length < 3) return;
    
    setIsSearchingClients(true);
    try {
      const clients = await findClientsByUniqueId(query);
      setClientSearchResults(clients.map(client => ({
        id: client.id,
        name: client.name,
        uniqueId: client.uniqueId
      })));
    } catch (error) {
      console.error("Error searching clients:", error);
    } finally {
      setIsSearchingClients(false);
    }
  };

  const selectClient = (client: {id: string, name: string, uniqueId: string}) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
      uniqueId: client.uniqueId,
    }));
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
      const entryData: Omit<EstateEntry, "id"> = {
        ...formData,
        plotNumbers: formData.plotNumbers.split(",").map(plot => plot.trim()).filter(plot => plot !== ""),
        documentsReceived: formData.documentsReceived.split(",").map(doc => doc.trim()).filter(doc => doc !== ""),
        amount: Number(formData.amount),
        amountPaid: Number(formData.amountPaid),
        paymentStatus: formData.paymentStatus as "Paid" | "Partial" | "Pending" | "Overdue",
        clientId: formData.clientId || undefined
      };
      
      onSubmit(entryData);
      toast({
        title: entry ? "Entry updated" : "Entry created",
        description: `${formData.clientName} has been ${entry ? "updated" : "created"} successfully.`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="uniqueId">Client Unique ID</Label>
            {formData.clientId && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Input
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                className={errors.uniqueId ? "border-red-500" : ""}
                placeholder="Enter unique client ID"
              />
              {errors.uniqueId && (
                <p className="text-sm text-red-500 mt-1">{errors.uniqueId}</p>
              )}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" size="icon" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Find Existing Client</h4>
                  <p className="text-sm text-muted-foreground">
                    Search for an existing client by unique ID
                  </p>
                </div>
                <div className="p-4">
                  <Input 
                    placeholder="Search clients..."
                    onChange={(e) => searchClients(e.target.value)}
                  />
                  
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {isSearchingClients ? (
                      <div className="text-center py-2 text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : clientSearchResults.length > 0 ? (
                      clientSearchResults.map(client => (
                        <div 
                          key={client.id}
                          className="py-2 px-2 hover:bg-accent rounded-md cursor-pointer flex justify-between items-center"
                          onClick={() => selectClient(client)}
                        >
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">{client.uniqueId}</div>
                          </div>
                          <Button type="button" size="sm" variant="ghost">
                            Select
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-sm text-muted-foreground">
                        No clients found
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.clientId ? 
              "This entry will be linked to an existing client" : 
              "If a client with this ID exists, the entry will be linked automatically"}
          </p>
        </div>

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
          {entry ? "Update Entry" : "Create Entry"}
        </Button>
      </div>
    </form>
  );
};

export default EstateForm;
