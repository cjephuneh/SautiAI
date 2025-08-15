import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Phone,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { contactsApi, callsApi, agentsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { AddDebtorModal } from "../modals/AddDebtorModal";
import { EditDebtorModal } from "../modals/EditDebtorModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectAgentModal } from "../modals/SelectAgentModal";

interface DebtorsProps {
  onSelectDebtor: (id: string) => void;
}

interface Contact {
  id: string | number;
  name: string;
  email?: string;
  phone_number: string;
  debt_amount: number;
  due_date: string;
  payment_status: string;
  last_payment?: string;
  original_creditor?: string;
  account_number?: string;
  region?: string;
  contact_attempts?: number;
  created_at?: string;
  lastContact?: string;
}

export const Debtors = ({ onSelectDebtor }: DebtorsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
  const [debtors, setDebtors] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddDebtorModal, setShowAddDebtorModal] = useState(false);
  const [showEditDebtorModal, setShowEditDebtorModal] = useState(false);
  const [selectedDebtorForEdit, setSelectedDebtorForEdit] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [initiatingCall, setInitiatingCall] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [showSelectAgentModal, setShowSelectAgentModal] = useState(false);
  const [debtorIdForCall, setDebtorIdForCall] = useState<string | null>(null);
  const [debtorNameForCall, setDebtorNameForCall] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDebtors();
    fetchAgents();
  }, []);

  const fetchDebtors = async () => {
    setLoading(true);
    try {
      const response = await contactsApi.getContacts();
      console.log("API Response:", response); // Debug log
      
      // Handle different response structures
      const contactsArray = Array.isArray(response) ? response : response.data || response.contacts || [];
      
      if (!Array.isArray(contactsArray)) {
        console.error("Expected array but got:", typeof contactsArray, contactsArray);
        throw new Error("Invalid response format: expected array of contacts");
      }

      setDebtors(contactsArray.map((contact: any) => ({
        ...contact,
        id: contact.id.toString(),
        // Map API fields to our component fields
        status: contact.payment_status,
        amountOwed: contact.debt_amount,
        lastContact: contact.created_at ? new Date(contact.created_at).toLocaleDateString() : "N/A",
        region: contact.region || "Unknown",
        // Default values for fields not provided by API
        paymentPlan: contact.payment_status === 'partial'
      })));
    } catch (error) {
      console.error("Failed to fetch debtors:", error);
      toast({
        title: "Error",
        description: "Failed to load debtors. Please check your connection and try again.",
        variant: "destructive",
      });
      // Set empty array on error instead of mock data
      setDebtors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await agentsApi.getAgents();
      console.log("Agents API response:", response); // Debug log
      
      // Handle different response structures
      const agentsArray = Array.isArray(response) ? response : response.data || response.agents || [];
      setAgents(agentsArray);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      setAgents([]); // Set empty array on error
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error", 
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const result = await contactsApi.uploadContactsCSV(file);
      
      toast({
        title: "Success",
        description: `Successfully imported ${result.imported_count || 'multiple'} contacts from CSV.`,
      });
      
      fetchDebtors(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to import CSV:", error);
      
      let errorMessage = "Failed to import contacts. Please check your file format and try again.";
      
      if (error.response?.status === 400) {
        errorMessage = "Invalid CSV format. Please ensure your file has the required columns: name, phone_number, debt_amount.";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please reduce file size and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleEditDebtor = (debtorId: string) => {
    setSelectedDebtorForEdit(debtorId);
    setShowEditDebtorModal(true);
  };

  const handleDeleteDebtor = async (debtorId: string, debtorName: string) => {
    if (!confirm(`Are you sure you want to delete ${debtorName}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(debtorId);
    try {
      await contactsApi.deleteContact(Number(debtorId));
      toast({
        title: "Success",
        description: `${debtorName} has been deleted successfully.`,
      });
      fetchDebtors(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete debtor:", error);
      toast({
        title: "Error",
        description: "Failed to delete debtor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleInitiateCall = async (debtorId: string, debtorName: string) => {
    setDebtorIdForCall(debtorId);
    setDebtorNameForCall(debtorName);
    // Always open modal; it will preselect default agent and allow clearing
    setShowSelectAgentModal(true);
  };

  const handleAgentSelectedAndCall = async (agentId: number) => {
    if (!debtorIdForCall || !debtorNameForCall) return;
    setInitiatingCall(debtorIdForCall);
    try {
      const callResult = await callsApi.makeOutboundCall(Number(debtorIdForCall), agentId);
      toast({
        title: "Call Initiated",
        description: `AI agent is now calling ${debtorNameForCall}.`,
      });
      console.log("Call initiated:", callResult);
    } catch (error: any) {
      console.error("Failed to initiate call:", error);
      let errorMessage = "Failed to initiate call. Please try again.";
      if (error.response?.status === 404) {
        errorMessage = "Contact or agent not found. Please refresh the page and try again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid call parameters. Please check the contact details.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setInitiatingCall(null);
      setShowSelectAgentModal(false);
      setDebtorIdForCall(null);
      setDebtorNameForCall(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDebtors = debtors.filter(debtor => {
    const matchesSearch = debtor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || debtor.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedDebtors.length === filteredDebtors.length) {
      setSelectedDebtors([]);
    } else {
      setSelectedDebtors(filteredDebtors.map(d => d.id.toString()));
    }
  };

  const handleSelectDebtor = (id: string) => {
    setSelectedDebtors(prev => 
      prev.includes(id) 
        ? prev.filter(debtorId => debtorId !== id)
        : [...prev, id]
    );
  };

  const stats = [
    { 
      label: "Total Debtors", 
      value: debtors.length, 
      icon: Users, 
      color: "text-blue-600" 
    },
    { 
      label: "Overdue", 
      value: debtors.filter(d => d.payment_status === 'overdue').length, 
      icon: AlertTriangle, 
      color: "text-red-600" 
    },
    { 
      label: "Total Outstanding", 
      value: `KSh ${debtors.reduce((sum, d) => sum + d.debt_amount, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-purple-600" 
    },
    { 
      label: "In Payment Plans", 
      value: debtors.filter(d => d.payment_status === 'partial').length, 
      icon: Calendar, 
      color: "text-green-600" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Debtors Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Debtors Management</CardTitle>
              <CardDescription>Manage and track all your debtors and their payment status</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="bg-white shadow-sm" disabled={uploading}>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={handleImportCSV}
                />
                <label htmlFor="csv-upload" className="flex items-center cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Import CSV
                </label>
              </Button>
              <Button variant="outline" className="bg-white shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                onClick={() => setShowAddDebtorModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Debtor
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search debtors by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="partial">In Plan</option>
                <option value="paid">Paid</option>
              </select>
              
              <Button variant="outline" className="bg-white">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDebtors.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-900">
                {selectedDebtors.length} debtor(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-white">
                  <Mail className="h-4 w-4 mr-1" />
                  Email All
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  SMS All
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  Assign Collector
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading debtors...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedDebtors.length === filteredDebtors.length && filteredDebtors.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Debtor</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Amount Owed</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Region</TableHead>
                    <TableHead className="font-semibold">Last Contact</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebtors.map((debtor) => (
                    <TableRow 
                      key={debtor.id} 
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                      onClick={() => onSelectDebtor(debtor.id.toString())}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedDebtors.includes(debtor.id.toString())}
                          onChange={() => handleSelectDebtor(debtor.id.toString())}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {debtor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{debtor.name}</p>
                            <p className="text-sm text-gray-500">{debtor.email || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-600">{debtor.phone_number}</span>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInitiateCall(debtor.id.toString(), debtor.name);
                              }}
                              disabled={initiatingCall === debtor.id.toString()}
                              title={"Initiate AI Call"}
                            >
                              {initiatingCall === debtor.id.toString() ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Phone className="h-3 w-3" />
                              )}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Send Email">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Send SMS">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${debtor.debt_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          KSh {debtor.debt_amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{debtor.due_date}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs font-medium border", getStatusColor(debtor.payment_status))}>
                          {debtor.payment_status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{debtor.region}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{debtor.lastContact}</span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              {deleting === debtor.id.toString() ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleEditDebtor(debtor.id.toString())}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDebtor(debtor.id.toString(), debtor.name)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              disabled={deleting === debtor.id.toString()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Debtor Modal */}
      <AddDebtorModal 
        open={showAddDebtorModal} 
        onOpenChange={setShowAddDebtorModal} 
        onSuccess={fetchDebtors}
      />

      {/* Edit Debtor Modal */}
      <EditDebtorModal 
        open={showEditDebtorModal} 
        onOpenChange={setShowEditDebtorModal} 
        debtorId={selectedDebtorForEdit}
        onSuccess={fetchDebtors}
      />

      {/* Select Agent Modal for calling */}
      <SelectAgentModal
        open={showSelectAgentModal}
        onOpenChange={setShowSelectAgentModal}
        onAgentSelected={handleAgentSelectedAndCall}
        allowRememberChoice
        defaultAgentId={Number(localStorage.getItem('default_agent_id') || '') || null}
      />
    </div>
  );
};
