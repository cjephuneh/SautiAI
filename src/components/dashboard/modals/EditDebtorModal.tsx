import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { contactsApi } from "@/services/api";
import { Loader2 } from "lucide-react";

interface EditDebtorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debtorId: string | null;
  onSuccess: () => void;
}

interface DebtorData {
  name: string;
  phone_number: string;
  email: string;
  debt_amount: number;
  original_creditor: string;
  account_number: string;
  due_date: string;
  last_payment: string;
  payment_status: string;
}

export const EditDebtorModal = ({ open, onOpenChange, debtorId, onSuccess }: EditDebtorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState<DebtorData>({
    name: "",
    phone_number: "",
    email: "",
    debt_amount: 0,
    original_creditor: "",
    account_number: "",
    due_date: "",
    last_payment: "",
    payment_status: "active"
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && debtorId) {
      fetchDebtorData();
    }
  }, [open, debtorId]);

  const fetchDebtorData = async () => {
    if (!debtorId) return;
    
    setFetchingData(true);
    try {
      const data = await contactsApi.getContact(Number(debtorId));
      setFormData({
        name: data.name || "",
        phone_number: data.phone_number || "",
        email: data.email || "",
        debt_amount: data.debt_amount || 0,
        original_creditor: data.original_creditor || "",
        account_number: data.account_number || "",
        due_date: data.due_date ? data.due_date.split('T')[0] : "",
        last_payment: data.last_payment ? data.last_payment.split('T')[0] : "",
        payment_status: data.payment_status || "active"
      });
    } catch (error) {
      console.error("Failed to fetch debtor data:", error);
      toast({
        title: "Error",
        description: "Failed to load debtor information.",
        variant: "destructive",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtorId) return;

    setLoading(true);
    try {
      await contactsApi.updateContact(Number(debtorId), {
        ...formData,
        debt_amount: Number(formData.debt_amount)
      });
      
      toast({
        title: "Success",
        description: "Debtor updated successfully",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update debtor:", error);
      toast({
        title: "Error",
        description: "Failed to update debtor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DebtorData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Debtor</DialogTitle>
        </DialogHeader>

        {fetchingData ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading debtor information...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debtAmount">Debt Amount (KSh) *</Label>
                <Input
                  id="debtAmount"
                  type="number"
                  step="0.01"
                  value={formData.debt_amount}
                  onChange={(e) => handleInputChange("debt_amount", parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select value={formData.payment_status} onValueChange={(value) => handleInputChange("payment_status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditor">Original Creditor</Label>
              <Input
                id="creditor"
                value={formData.original_creditor}
                onChange={(e) => handleInputChange("original_creditor", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                value={formData.account_number}
                onChange={(e) => handleInputChange("account_number", e.target.value)}
                placeholder="****1234"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange("due_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastPayment">Last Payment Date</Label>
                <Input
                  id="lastPayment"
                  type="date"
                  value={formData.last_payment}
                  onChange={(e) => handleInputChange("last_payment", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Debtor
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
