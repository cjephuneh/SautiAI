
import { useState } from "react";
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
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DebtorsProps {
  onSelectDebtor: (id: string) => void;
}

export const Debtors = ({ onSelectDebtor }: DebtorsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);

  const debtors = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      amountOwed: 2500,
      dueDate: "2024-01-15",
      status: "overdue",
      region: "North America",
      lastContact: "2024-01-10",
      paymentPlan: true
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 987-6543",
      amountOwed: 1200,
      dueDate: "2024-02-01",
      status: "active",
      region: "North America",
      lastContact: "2024-01-20",
      paymentPlan: false
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "m.brown@email.com",
      phone: "+1 (555) 456-7890",
      amountOwed: 850,
      dueDate: "2024-01-25",
      status: "in-plan",
      region: "Europe",
      lastContact: "2024-01-18",
      paymentPlan: true
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 321-0987",
      amountOwed: 0,
      dueDate: "2024-01-05",
      status: "cleared",
      region: "Asia",
      lastContact: "2024-01-05",
      paymentPlan: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-plan': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleared': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDebtors = debtors.filter(debtor => {
    const matchesSearch = debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || debtor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedDebtors.length === filteredDebtors.length) {
      setSelectedDebtors([]);
    } else {
      setSelectedDebtors(filteredDebtors.map(d => d.id));
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
    { label: "Total Debtors", value: debtors.length, icon: Users, color: "text-blue-600" },
    { label: "Overdue", value: debtors.filter(d => d.status === 'overdue').length, icon: AlertTriangle, color: "text-red-600" },
    { label: "Total Outstanding", value: `$${debtors.reduce((sum, d) => sum + d.amountOwed, 0).toLocaleString()}`, icon: DollarSign, color: "text-purple-600" },
    { label: "In Payment Plans", value: debtors.filter(d => d.paymentPlan).length, icon: Calendar, color: "text-green-600" }
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
              <Button variant="outline" className="bg-white shadow-sm">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" className="bg-white shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
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
                placeholder="Search debtors by name or email..."
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
                <option value="in-plan">In Plan</option>
                <option value="cleared">Cleared</option>
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
                    onClick={() => onSelectDebtor(debtor.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedDebtors.includes(debtor.id)}
                        onChange={() => handleSelectDebtor(debtor.id)}
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
                          <p className="text-sm text-gray-500">{debtor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-600">{debtor.phone}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${debtor.amountOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${debtor.amountOwed.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{debtor.dueDate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs font-medium border", getStatusColor(debtor.status))}>
                        {debtor.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{debtor.region}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{debtor.lastContact}</span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
