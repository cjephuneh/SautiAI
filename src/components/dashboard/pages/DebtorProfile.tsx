import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  FileText,
  Bot,
  CreditCard,
  Clock,
  MapPin,
  User,
  Building,
  Edit,
  Download,
  AlertTriangle,
  CheckCircle,
  Plus,
  Loader2
} from "lucide-react";
import { contactsApi, agentsApi, callsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { SelectAgentModal } from "../modals/SelectAgentModal";

interface DebtorProfileProps {
  debtorId: string | null;
  onBack: () => void;
}

interface Debtor {
  id: string;
  name: string;
  email?: string;
  phone_number: string;
  debt_amount: number;
  due_date: string;
  payment_status: string;
  original_creditor: string;
  account_number: string;
  last_payment: string;
  contact_attempts: number;
  created_at: string;
  // UI specific fields
  address?: string;
  company?: string;
  riskLevel?: string;
  creditScore?: number;
  assignedCollector?: string;
  notes?: string;
  paymentPlan?: boolean;
  // Derived fields
  status?: string;
  phone?: string;
}

export const DebtorProfile = ({ debtorId, onBack }: DebtorProfileProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [initiatingCall, setInitiatingCall] = useState(false);
  const [showSelectAgentModal, setShowSelectAgentModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (debtorId) {
      fetchDebtorDetails();
      fetchAgents();
    }
  }, [debtorId]);

  const fetchDebtorDetails = async () => {
    if (!debtorId) return;
    
    setLoading(true);
    try {
      const data = await contactsApi.getContact(Number(debtorId));
      
      // Transform API response to fit our component's data structure
      const transformedData = {
        ...data,
        id: data.id.toString(),
        status: data.payment_status,
        phone: data.phone_number,
        amountOwed: data.debt_amount,
        originalDebt: data.debt_amount, // Use the same amount if original is not provided
        lastContact: new Date(data.created_at).toLocaleDateString(),
        // Calculate estimated risk level based on payment status
        riskLevel: data.payment_status === 'overdue' ? 'high' : 
                  data.payment_status === 'partial' ? 'medium' : 'low',
        // Default values for fields not provided by API
        creditScore: 650, // Mock value
        company: data.original_creditor, // Using creditor as company name
        address: "Address information not available", // Default value
        assignedCollector: "Not assigned", // Default value
        notes: "",
        paymentPlan: data.payment_status === 'partial'
      };
      
      setDebtor(transformedData);
    } catch (error) {
      console.error("Failed to fetch debtor details:", error);
      toast({
        title: "Error",
        description: "Failed to load debtor information. Please try again.",
        variant: "destructive",
      });
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
      console.error("Failed to fetch AI agents:", error);
      setAgents([]); // Set empty array on error
    }
  };

  const handleInitiateCall = async () => {
    if (!debtor) return;
    const savedAgentId = localStorage.getItem('default_agent_id');
    if (savedAgentId) {
      await handleAgentSelectedAndCall(Number(savedAgentId));
      return;
    }
    setShowSelectAgentModal(true);
  };

  const handleAgentSelectedAndCall = async (agentId: number) => {
    if (!debtor) return;
    setInitiatingCall(true);
    try {
      const callResult = await callsApi.makeOutboundCall(Number(debtorId), agentId);
      toast({ title: "Call Initiated", description: `AI agent is now calling ${debtor.name}.` });
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
      setInitiatingCall(false);
      setShowSelectAgentModal(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate mock timeline data since API doesn't provide it
  const timeline = debtor ? [
    {
      id: 1,
      type: "debt_created",
      title: "Debt Created",
      description: `Initial debt of $${debtor.debt_amount} created`,
      amount: debtor.debt_amount,
      date: new Date(debtor.created_at).toLocaleDateString(),
      status: "completed"
    },
    {
      id: 2,
      type: "communication",
      title: "Account Created",
      description: "Debtor added to system",
      date: new Date(debtor.created_at).toLocaleDateString(),
      status: "completed"
    },
    ...(debtor.last_payment ? [
      {
        id: 3,
        type: "payment",
        title: "Payment Received",
        description: "Partial payment received",
        amount: -500, // Mock value
        date: new Date(debtor.last_payment).toLocaleDateString(),
        status: "completed"
      }
    ] : []),
    {
      id: 4,
      type: "communication",
      title: "AI Call Attempt Planned",
      description: "Scheduled for follow-up",
      date: new Date().toLocaleDateString(),
      status: "in_progress"
    }
  ] : [];

  // Mock payment plan data
  const paymentPlan = debtor?.paymentPlan ? {
    totalAmount: debtor.debt_amount,
    installments: [
      { id: 1, amount: debtor.debt_amount / 5, dueDate: new Date(debtor.due_date).toLocaleDateString(), status: "pending" },
      { id: 2, amount: debtor.debt_amount / 5, dueDate: new Date(new Date(debtor.due_date).setMonth(new Date(debtor.due_date).getMonth() + 1)).toLocaleDateString(), status: "pending" },
      { id: 3, amount: debtor.debt_amount / 5, dueDate: new Date(new Date(debtor.due_date).setMonth(new Date(debtor.due_date).getMonth() + 2)).toLocaleDateString(), status: "pending" },
      { id: 4, amount: debtor.debt_amount / 5, dueDate: new Date(new Date(debtor.due_date).setMonth(new Date(debtor.due_date).getMonth() + 3)).toLocaleDateString(), status: "pending" },
      { id: 5, amount: debtor.debt_amount / 5, dueDate: new Date(new Date(debtor.due_date).setMonth(new Date(debtor.due_date).getMonth() + 4)).toLocaleDateString(), status: "pending" }
    ]
  } : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Loading debtor profile...</p>
      </div>
    );
  }

  if (!debtor) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-600" />
        <p className="mt-4 text-gray-600">Debtor information not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{debtor.name}</h1>
          <p className="text-gray-600">Debtor Profile • ID: {debtor.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white shadow-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            disabled={initiatingCall || agents.length === 0}
            onClick={handleInitiateCall}
          >
            {initiatingCall ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bot className="h-4 w-4 mr-2" />
            )}
            AI Actions
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Amount Owed</p>
                <p className="text-2xl font-bold text-red-600">Ksh{debtor.debt_amount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Overdue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {debtor.status === 'overdue' ? 
                    Math.floor((new Date().getTime() - new Date(debtor.due_date).getTime()) / (1000 * 3600 * 24)) : 
                    0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credit Score</p>
                <p className="text-2xl font-bold text-blue-600">{debtor.creditScore || 'N/A'}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <Badge className={`mt-1 ${getRiskColor(debtor.riskLevel || 'medium')}`}>
                  {(debtor.riskLevel || 'medium').toUpperCase()}
                </Badge>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Details */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.email || 'No email provided'}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto" disabled={!debtor.email}>
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.phone_number}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.address || 'No address on record'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.original_creditor}</span>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan */}
          {paymentPlan && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Payment Plan
                </CardTitle>
                <CardDescription>
                  {paymentPlan.installments.length} installments of ${(paymentPlan.totalAmount / paymentPlan.installments.length).toFixed(2)} each
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentPlan.installments.slice(0, 3).map((installment) => (
                    <div key={installment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">${installment.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{installment.dueDate}</p>
                      </div>
                      <Badge variant={installment.status === 'overdue' ? 'destructive' : 'outline'}>
                        {installment.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm">
                    View All Installments
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline & AI Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Assistant Actions
              </CardTitle>
              <CardDescription>
                Automate communication and follow-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={initiatingCall || !agents || agents.length === 0}
                  onClick={handleInitiateCall}
                >
                  {initiatingCall ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Phone className="h-4 w-4 mr-2" />
                  )}
                  Initiate AI Call
                  {(!agents || agents.length === 0) && (
                    <span className="text-xs ml-2">(No agents)</span>
                  )}
                </Button>
                <Button variant="outline" className="bg-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send WhatsApp
                </Button>
                <Button variant="outline" className="bg-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Reminder
                </Button>
                <Button variant="outline" className="bg-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="bg-white">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Propose Settlement
                </Button>
                <Button variant="outline" className="bg-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                Complete history of interactions and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(event.status)}
                      {index < timeline.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <span className="text-xs text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.amount && (
                        <span className={`text-sm font-medium ${event.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {event.amount > 0 ? '+' : ''}${Math.abs(event.amount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
