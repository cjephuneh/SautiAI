
import { useState } from "react";
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
  Plus
} from "lucide-react";

interface DebtorProfileProps {
  debtorId: string | null;
  onBack: () => void;
}

export const DebtorProfile = ({ debtorId, onBack }: DebtorProfileProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, this would be fetched based on debtorId
  const debtor = {
    id: debtorId || "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    company: "Tech Solutions Inc.",
    amountOwed: 2500,
    originalDebt: 3000,
    dueDate: "2024-01-15",
    status: "overdue",
    paymentPlan: true,
    riskLevel: "medium",
    creditScore: 650,
    lastPayment: "2023-12-01",
    lastContact: "2024-01-10",
    assignedCollector: "Sarah Wilson",
    notes: "Customer agreed to payment plan but missed last installment"
  };

  const timeline = [
    {
      id: 1,
      type: "debt_created",
      title: "Debt Created",
      description: "Initial debt of $3,000 created",
      amount: 3000,
      date: "2023-10-01",
      status: "completed"
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      description: "Partial payment received",
      amount: -500,
      date: "2023-12-01",
      status: "completed"
    },
    {
      id: 3,
      type: "communication",
      title: "AI Call Attempt",
      description: "Automated reminder call - No answer",
      date: "2024-01-05",
      status: "failed"
    },
    {
      id: 4,
      type: "communication",
      title: "Email Sent",
      description: "Payment reminder email sent",
      date: "2024-01-08",
      status: "completed"
    },
    {
      id: 5,
      type: "escalation",
      title: "Manual Follow-up",
      description: "Assigned to collector for personal contact",
      date: "2024-01-10",
      status: "in_progress"
    }
  ];

  const paymentPlan = {
    totalAmount: 2500,
    installments: [
      { id: 1, amount: 500, dueDate: "2024-01-15", status: "overdue" },
      { id: 2, amount: 500, dueDate: "2024-02-15", status: "pending" },
      { id: 3, amount: 500, dueDate: "2024-03-15", status: "pending" },
      { id: 4, amount: 500, dueDate: "2024-04-15", status: "pending" },
      { id: 5, amount: 500, dueDate: "2024-05-15", status: "pending" }
    ]
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
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <Bot className="h-4 w-4 mr-2" />
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
                <p className="text-2xl font-bold text-red-600">${debtor.amountOwed.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-orange-600">12</p>
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
                <p className="text-2xl font-bold text-blue-600">{debtor.creditScore}</p>
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
                <Badge className={`mt-1 ${getRiskColor(debtor.riskLevel)}`}>
                  {debtor.riskLevel.toUpperCase()}
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
                <span className="text-sm">{debtor.email}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.phone}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{debtor.company}</span>
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
          {debtor.paymentPlan && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Payment Plan
                </CardTitle>
                <CardDescription>
                  5 installments of $500 each
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentPlan.installments.slice(0, 3).map((installment) => (
                    <div key={installment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">${installment.amount}</p>
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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  Initiate AI Call
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
    </div>
  );
};
