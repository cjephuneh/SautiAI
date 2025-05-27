
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  MoreVertical
} from "lucide-react";

export const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contacts = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      totalDebt: 1250,
      lastContact: "2024-01-15",
      priority: "high",
      paymentHistory: "3/5 payments made"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "s.johnson@email.com", 
      phone: "+1 (555) 987-6543",
      status: "pending",
      totalDebt: 890,
      lastContact: "2024-01-10",
      priority: "medium",
      paymentHistory: "1/3 payments made"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "m.brown@email.com",
      phone: "+1 (555) 456-7890", 
      status: "active",
      totalDebt: 2100,
      lastContact: "2024-01-14",
      priority: "high",
      paymentHistory: "2/4 payments made"
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 321-0987",
      status: "resolved",
      totalDebt: 0,
      lastContact: "2024-01-12", 
      priority: "low",
      paymentHistory: "Fully paid"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
          <p className="text-gray-600">Manage your debt collection contacts and their information</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-green-600">1,923</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">284</p>
              </div>
              <Badge className="h-8 w-8 bg-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-600">640</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>View and manage all your contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Last contact: {contact.lastContact}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                            <DollarSign className="h-4 w-4" />
                            {contact.totalDebt.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-500">{contact.paymentHistory}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                          <Badge variant={getPriorityColor(contact.priority)}>
                            {contact.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
