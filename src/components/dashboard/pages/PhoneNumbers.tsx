import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Shield,
  Clock,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PhoneNumber {
  id: string;
  number: string;
  country_code: string;
  provider: string;
  type: 'local' | 'toll_free' | 'international';
  status: 'active' | 'inactive' | 'suspended';
  capabilities: string[];
  monthly_cost: number;
  usage_count: number;
  last_used: string;
  created_at: string;
}

const PhoneNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    number: "",
    country_code: "+1",
    provider: "twilio",
    type: "local" as const,
    capabilities: [] as string[]
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData: PhoneNumber[] = [
        {
          id: "1",
          number: "+1234567890",
          country_code: "+1",
          provider: "twilio",
          type: "local",
          status: "active",
          capabilities: ["voice", "sms"],
          monthly_cost: 15.00,
          usage_count: 234,
          last_used: "2024-01-27T10:30:00Z",
          created_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          number: "+1800555123",
          country_code: "+1",
          provider: "twilio",
          type: "toll_free",
          status: "active",
          capabilities: ["voice", "sms", "mms"],
          monthly_cost: 25.00,
          usage_count: 156,
          last_used: "2024-01-26T15:45:00Z",
          created_at: "2024-01-05T00:00:00Z"
        },
        {
          id: "3",
          number: "+447700900123",
          country_code: "+44",
          provider: "vonage",
          type: "international",
          status: "inactive",
          capabilities: ["voice"],
          monthly_cost: 35.00,
          usage_count: 45,
          last_used: "2024-01-20T09:15:00Z",
          created_at: "2024-01-10T00:00:00Z"
        }
      ];
      
      setPhoneNumbers(mockData);
    } catch (error) {
      console.error("Failed to fetch phone numbers:", error);
      toast({
        title: "Error",
        description: "Failed to load phone numbers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNumber = async () => {
    try {
      // Mock API call - replace with actual implementation
      const newNumber: PhoneNumber = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        monthly_cost: formData.type === "toll_free" ? 25 : formData.type === "international" ? 35 : 15,
        usage_count: 0,
        last_used: "",
        created_at: new Date().toISOString()
      };

      setPhoneNumbers(prev => [...prev, newNumber]);
      setFormData({
        number: "",
        country_code: "+1",
        provider: "twilio",
        type: "local",
        capabilities: []
      });
      setShowAddModal(false);
      
      toast({
        title: "Success",
        description: "Phone number added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add phone number.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNumber = async (id: string) => {
    try {
      setPhoneNumbers(prev => prev.filter(num => num.id !== id));
      toast({
        title: "Success",
        description: "Phone number deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete phone number.",
        variant: "destructive",
      });
    }
  };

  const toggleNumberStatus = async (id: string) => {
    try {
      setPhoneNumbers(prev => prev.map(num => 
        num.id === id 
          ? { ...num, status: num.status === "active" ? "inactive" : "active" as const }
          : num
      ));
      
      toast({
        title: "Success",
        description: "Phone number status updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "inactive": return "text-gray-600 bg-gray-100";
      case "suspended": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "local": return "text-blue-600 bg-blue-100";
      case "toll_free": return "text-purple-600 bg-purple-100";
      case "international": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredNumbers = phoneNumbers.filter(number => {
    const matchesSearch = number.number.includes(searchTerm) || 
                         number.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || number.status === statusFilter;
    const matchesType = typeFilter === "all" || number.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCost = phoneNumbers.reduce((sum, num) => sum + num.monthly_cost, 0);
  const activeNumbers = phoneNumbers.filter(num => num.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="text-gray-600">Manage your phone numbers for outbound calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Number
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Numbers</p>
                <p className="text-2xl font-bold text-gray-900">{phoneNumbers.length}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Numbers</p>
                <p className="text-2xl font-bold text-green-600">{activeNumbers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-purple-600">${totalCost.toFixed(2)}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-orange-600">
                  {phoneNumbers.reduce((sum, num) => sum + num.usage_count, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search phone numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="toll_free">Toll Free</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Phone Numbers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
          <CardDescription>
            Showing {filteredNumbers.length} of {phoneNumbers.length} phone numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capabilities</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNumbers.map((number) => (
                    <TableRow key={number.id}>
                      <TableCell className="font-medium">{number.number}</TableCell>
                      <TableCell className="capitalize">{number.provider}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(number.type)}>
                          {number.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(number.status)}>
                          {number.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {number.capabilities.map((cap) => (
                            <Badge key={cap} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{number.usage_count}</TableCell>
                      <TableCell>${number.monthly_cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleNumberStatus(number.id)}
                          >
                            {number.status === "active" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNumber(number)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNumber(number.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Number Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Phone Number</DialogTitle>
            <DialogDescription>
              Add a new phone number for outbound calls
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="number">Phone Number</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="+1234567890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Select value={formData.country_code} onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1 (US/CA)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+254">+254 (KE)</SelectItem>
                    <SelectItem value="+27">+27 (ZA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="toll_free">Toll Free</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={formData.provider} onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">SautiAI</SelectItem>
                  <SelectItem value="vonage">Vonage</SelectItem>
                  <SelectItem value="plivo">Plivo</SelectItem>
                  <SelectItem value="bandwidth">Bandwidth</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>


                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddNumber} className="flex-1">
                Add Number
              </Button>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneNumbers;
