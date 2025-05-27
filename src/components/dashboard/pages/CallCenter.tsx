
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Download,
  FileText,
  Bot,
  User,
  Headphones
} from "lucide-react";

export const CallCenter = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const activeCalls = [
    {
      id: 1,
      debtorName: "John Smith",
      debtorPhone: "+1 (555) 123-4567",
      amount: 2500,
      agent: "AI Assistant",
      duration: "02:45",
      status: "in-progress",
      type: "ai",
      notes: "Customer is responsive, discussing payment plan options"
    },
    {
      id: 2,
      debtorName: "Sarah Johnson",
      debtorPhone: "+1 (555) 987-6543",
      amount: 1200,
      agent: "Mike Wilson",
      duration: "05:12",
      status: "on-hold",
      type: "human",
      notes: "Waiting for customer to check bank balance"
    },
    {
      id: 3,
      debtorName: "Robert Davis",
      debtorPhone: "+1 (555) 456-7890",
      amount: 3400,
      agent: "AI Assistant",
      duration: "01:23",
      status: "connecting",
      type: "ai",
      notes: "Outbound call initiated"
    }
  ];

  const callLogs = [
    {
      id: 1,
      debtorName: "Emma Wilson",
      phone: "+1 (555) 111-2222",
      agent: "Sarah Collins",
      duration: "08:45",
      outcome: "paid",
      amount: 750,
      timestamp: "2024-01-27 14:30",
      notes: "Full payment agreed, will pay by end of week"
    },
    {
      id: 2,
      debtorName: "Michael Brown",
      phone: "+1 (555) 333-4444",
      agent: "AI Assistant",
      duration: "03:22",
      outcome: "callback",
      amount: 1500,
      timestamp: "2024-01-27 13:15",
      notes: "Customer requested callback next week"
    },
    {
      id: 3,
      debtorName: "Lisa Anderson",
      phone: "+1 (555) 555-6666",
      agent: "Mike Wilson",
      duration: "12:18",
      outcome: "plan",
      amount: 2200,
      timestamp: "2024-01-27 11:45",
      notes: "Agreed to 6-month payment plan"
    },
    {
      id: 4,
      debtorName: "David Garcia",
      phone: "+1 (555) 777-8888",
      agent: "AI Assistant",
      duration: "00:45",
      outcome: "no-answer",
      amount: 980,
      timestamp: "2024-01-27 10:30",
      notes: "No answer, voicemail left"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'connecting': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'plan': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'callback': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no-answer': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'refused': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = [
    { label: "Active Calls", value: activeCalls.length, icon: Phone, color: "text-green-600" },
    { label: "Calls Today", value: 47, icon: PhoneCall, color: "text-blue-600" },
    { label: "Avg Duration", value: "6:32", icon: Clock, color: "text-purple-600" },
    { label: "Success Rate", value: "68%", icon: CheckCircle, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-600">Monitor and manage all call activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white shadow-sm">
            <Bot className="h-4 w-4 mr-2" />
            Launch AI Campaign
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
            <PhoneCall className="h-4 w-4 mr-2" />
            Manual Call
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Calls */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Active Calls
              </CardTitle>
              <CardDescription>Currently ongoing calls and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCalls.map((call) => (
                  <div key={call.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {call.type === 'ai' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{call.debtorName}</h4>
                          <p className="text-sm text-gray-500">{call.debtorPhone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${getStatusColor(call.status)}`}>
                          {call.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-sm font-medium">${call.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{call.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {call.type === 'ai' ? <Bot className="h-4 w-4 text-blue-500" /> : <Headphones className="h-4 w-4 text-green-500" />}
                          <span className="text-sm text-gray-600">{call.agent}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <Mic className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <Volume2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" className="h-8 bg-red-600 hover:bg-red-700 text-white">
                          <PhoneOff className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {call.notes && (
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">{call.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call Logs */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Call Logs
              </CardTitle>
              <CardDescription>History of completed calls and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callLogs.map((log) => (
                  <div key={log.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Phone className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{log.debtorName}</h4>
                          <p className="text-xs text-gray-500">{log.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-1 text-xs ${getOutcomeColor(log.outcome)}`}>
                          {log.outcome.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-500">{log.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Duration: {log.duration}</span>
                        <span className="text-gray-600">Agent: {log.agent}</span>
                        <span className="font-medium">${log.amount.toLocaleString()}</span>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {log.notes && (
                      <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Controls & Queue */}
        <div className="space-y-6">
          {/* Quick Dial */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Quick Dial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
                  <Button key={num} variant="outline" className="h-12 bg-white hover:bg-gray-50">
                    {num}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="bg-white">
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call Queue */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Call Queue
              </CardTitle>
              <CardDescription>Debtors scheduled for callback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Alex Thompson", time: "14:30", amount: 1200, priority: "high" },
                  { name: "Maria Rodriguez", time: "15:00", amount: 850, priority: "medium" },
                  { name: "James Wilson", time: "15:30", amount: 2100, priority: "high" },
                  { name: "Linda Davis", time: "16:00", amount: 650, priority: "low" }
                ].map((callback, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{callback.name}</p>
                      <p className="text-xs text-gray-500">{callback.time} • ${callback.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={callback.priority === 'high' ? 'destructive' : callback.priority === 'medium' ? 'secondary' : 'outline'}>
                        {callback.priority}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <PhoneCall className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4 bg-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule More Calls
              </Button>
            </CardContent>
          </Card>

          {/* Call Outcomes */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Outcomes</CardTitle>
              <CardDescription>Mark call outcomes quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Payment Agreed
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Callback
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <Clock className="h-4 w-4 mr-2" />
                No Answer
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white">
                <XCircle className="h-4 w-4 mr-2" />
                Refused to Pay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
