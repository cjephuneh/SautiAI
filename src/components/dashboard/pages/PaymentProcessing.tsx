
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  Download
} from "lucide-react";

export const PaymentProcessing = () => {
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const payments = [
    {
      id: "pay_001",
      debtorName: "John Smith",
      amount: 1250,
      method: "M-Pesa",
      status: "completed",
      transactionId: "MPX123456789",
      timestamp: "2024-01-27 14:30",
      reference: "DEBT-001"
    },
    {
      id: "pay_002",
      debtorName: "Sarah Johnson",
      amount: 500,
      method: "Bank Transfer",
      status: "pending",
      transactionId: "BT987654321",
      timestamp: "2024-01-27 13:15",
      reference: "DEBT-002"
    },
    {
      id: "pay_003",
      debtorName: "Michael Brown",
      amount: 750,
      method: "M-Pesa",
      status: "failed",
      transactionId: "MPX555666777",
      timestamp: "2024-01-27 12:00",
      reference: "DEBT-003"
    }
  ];

  const paymentPlans = [
    {
      id: "plan_001",
      debtorName: "Emma Davis",
      totalAmount: 2000,
      installmentAmount: 400,
      frequency: "monthly",
      nextPayment: "2024-02-01",
      remainingPayments: 3,
      status: "active"
    },
    {
      id: "plan_002",
      debtorName: "David Wilson",
      totalAmount: 1500,
      installmentAmount: 250,
      frequency: "weekly",
      nextPayment: "2024-01-29",
      remainingPayments: 4,
      status: "active"
    }
  ];

  const handleSendPaymentLink = async () => {
    if (!mpesaNumber || !amount) {
      toast.error("Please enter both M-Pesa number and amount");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Payment link sent to ${mpesaNumber} for KES ${amount}`);
      setMpesaNumber("");
      setAmount("");
    } catch (error) {
      toast.error("Failed to send payment link");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
        <p className="text-gray-600">Manage payments, send links, and track transactions</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Payments</p>
                <p className="text-2xl font-bold text-green-600">KES 47,350</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Payments</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">87.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Payment Link */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Send Payment Link
          </CardTitle>
          <CardDescription>
            Send M-Pesa payment request to debtor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">M-Pesa Number</label>
              <Input
                placeholder="254700000000"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Amount (KES)</label>
              <Input
                placeholder="1000"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSendPaymentLink}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Payments and Plans */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Track all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {payment.method === 'M-Pesa' ? (
                            <Smartphone className="h-6 w-6 text-green-600" />
                          ) : (
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{payment.debtorName}</h3>
                          <p className="text-sm text-gray-500">{payment.method} • {payment.transactionId}</p>
                          <p className="text-sm text-gray-500">{payment.timestamp}</p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">KES {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Ref: {payment.reference}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Active Payment Plans</CardTitle>
              <CardDescription>Monitor installment payment schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.debtorName}</h3>
                          <p className="text-sm text-gray-500">{plan.frequency} payments • {plan.remainingPayments} remaining</p>
                          <p className="text-sm text-gray-500">Next: {plan.nextPayment}</p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">KES {plan.installmentAmount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">of KES {plan.totalAmount.toLocaleString()}</p>
                        </div>

                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Modify Plan
                          </Button>
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
