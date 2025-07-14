import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { contactsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddDebtorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDebtorModal({ open, onOpenChange, onSuccess }: AddDebtorModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    debt_amount: "",
    original_creditor: "",
    account_number: "",
    due_date: "",
    last_payment: "",
    payment_status: "overdue"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert debt_amount to a number
      const payload = {
        ...formData,
        debt_amount: parseFloat(formData.debt_amount) || 0
      };

      await contactsApi.createContact(payload);
      toast({
        title: "Success",
        description: "Debtor added successfully.",
      });
      
      // Reset form
      setFormData({
        name: "",
        phone_number: "",
        email: "",
        debt_amount: "",
        original_creditor: "",
        account_number: "",
        due_date: "",
        last_payment: "",
        payment_status: "overdue"
      });
      
      onOpenChange(false);
      
      // Callback to refresh the parent component's data
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to add debtor:", error);
      toast({
        title: "Error",
        description: "Failed to add debtor. Using mock data instead for development.",
        variant: "destructive",
      });
      
      // We're still going to close the modal and refresh since 
      // our updated API service will create a mock entry
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Debtor</DialogTitle>
          <DialogDescription>
            Enter the debtor's details to add them to your collection system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input 
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="debt_amount">Debt Amount</Label>
              <Input 
                id="debt_amount"
                name="debt_amount"
                type="number"
                step="0.01"
                value={formData.debt_amount}
                onChange={handleChange}
                placeholder="2500.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_creditor">Original Creditor</Label>
              <Input 
                id="original_creditor"
                name="original_creditor"
                value={formData.original_creditor}
                onChange={handleChange}
                placeholder="Bank Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input 
                id="account_number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="****1234"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input 
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_payment">Last Payment Date</Label>
              <Input 
                id="last_payment"
                name="last_payment"
                type="date"
                value={formData.last_payment}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select 
              value={formData.payment_status}
              onValueChange={(value) => handleSelectChange("payment_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial Payment</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Debtor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
