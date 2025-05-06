
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types";

interface ClientFormProps {
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  initialData?: Partial<Client>;
}

const ClientForm = ({ onSubmit, onCancel, initialData }: ClientFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    type: initialData?.type || "Individual",
    status: initialData?.status || "Active",
    uniqueId: initialData?.uniqueId || generateUniqueId()
  });

  function generateUniqueId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      type: formData.type as "Individual" | "Company",
      status: formData.status as "Active" | "Inactive" | "Lead",
      uniqueId: formData.uniqueId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter client name"
          className="glass-input"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className="glass-input"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Enter company name (optional)"
          className="glass-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uniqueId">Unique ID</Label>
        <Input
          id="uniqueId"
          name="uniqueId"
          value={formData.uniqueId}
          onChange={handleChange}
          placeholder="Client unique identifier"
          className="glass-input"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Client Type</Label>
        <RadioGroup
          defaultValue={formData.type}
          onValueChange={(value) => handleSelectChange("type", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Individual" id="individual" />
            <Label htmlFor="individual">Individual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Company" id="company" />
            <Label htmlFor="company">Company</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          defaultValue={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="apple-button-secondary">
            Cancel
          </Button>
        )}
        <Button type="submit" className="apple-button">
          Save Client
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
