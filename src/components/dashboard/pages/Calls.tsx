import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Search, 
  Filter, 
  Plus,
  PhoneCall,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
import { callsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export const Calls = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callsApi.getCallsWithFilters(1, {});
      setCalls(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Failed to load calls.");
      toast({
        title: "Error",
        description: "Failed to load calls.",
        variant: "destructive",
      });
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'missed': return 'destructive';  
      case 'scheduled': return 'secondary';
      default: return 'outline';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'payment_arranged': return 'text-green-600';
      case 'partial_payment': return 'text-blue-600';
      case 'no_answer': return 'text-gray-500';
      case 'callback_requested': return 'text-orange-600';
      default: return 'text-gray-500';
    }
  };

  // Map API call fields to UI fields
  const mappedCalls = calls.map((call) => ({
    id: call.call_id || call.id,
    contact: call.contact_name || call.contact || "Unknown",
    phone: call.phone_number || call.phone || "",
    status: call.status,
    outcome: call.outcome || "",
    duration: call.duration || "",
    timestamp: call.start_time || call.timestamp || "",
    amount: call.amount ? (typeof call.amount === "number" ? `${call.amount.toLocaleString()}` : call.amount) : "",
    notes: call.notes || call.summary || "",
  }));

  const filteredCalls = mappedCalls.filter(call =>
    call.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Call Management</h2>
          <p className="text-gray-600">Manage and track all your collection calls</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Call
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search calls by contact name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchCalls}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold">{calls.length}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {mappedCalls.filter(call => call.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missed</p>
                <p className="text-2xl font-bold text-red-600">
                  {mappedCalls.filter(call => call.status === "missed").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mappedCalls.filter(call => call.status === "scheduled").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>View and manage your call history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span>Loading calls...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Calls</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="missed">Missed</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {filteredCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Phone className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{call.contact}</h3>
                            <p className="text-sm text-gray-500">{call.phone}</p>
                            <p className="text-sm text-gray-500">{call.timestamp}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{call.amount}</p>
                            <p className={`text-sm ${getOutcomeColor(call.outcome)}`}>
                              {call.outcome.replace('_', ' ')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(call.status)}>
                              {call.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {call.duration}
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      {call.notes && (
                        <div className="mt-3 pl-16">
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {call.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
