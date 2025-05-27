import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AIConfigModal } from "../modals/AIConfigModal";
import { AddDebtorModal } from "../modals/AddDebtorModal";
import { QuickCampaignModal } from "../modals/QuickCampaignModal";
import { 
  Bot,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Calendar,
  Settings,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Smile,
  Frown,
  Meh,
  Shield,
  Volume2,
  FileText,
  User,
  Plus,
  Download,
  Mic,
  Play,
  Pause
} from "lucide-react";

export const AIAssistant = () => {
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [showAddDebtor, setShowAddDebtor] = useState(false);
  const [showQuickCampaign, setShowQuickCampaign] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);

  const callTranscriptions = [
    {
      id: 1,
      debtorName: "John Smith",
      callId: "call_001",
      duration: "05:23",
      timestamp: "2024-01-27 14:30",
      outcome: "payment_agreed",
      confidence: 0.98,
      transcription: `AI: Hello, this is calling regarding your account with ABC Collections. Am I speaking with John Smith?

John: Yes, this is John.

AI: Thank you for confirming, John. I'm calling about your outstanding balance of $2,500 that was due on January 15th. We want to work with you to resolve this matter. Can you tell me about your current situation?

John: Look, I've been having some financial difficulties since I lost my job last month. I want to pay, but I just don't have the full amount right now.

AI: I understand that can be challenging, John. We appreciate your honesty and willingness to work with us. Would you be interested in setting up a payment plan that works with your current budget?

John: Yes, that would be helpful. What kind of options do you have?

AI: We can offer a 6-month payment plan of approximately $417 per month, or if that's still too high, we can discuss an 8-month plan for about $312 per month. Which would work better for you?

John: The 8-month plan sounds more manageable. Can we set that up today?

AI: Absolutely! I can set up the 8-month payment plan starting with your first payment on February 15th. Would you like to make that first payment today to get started?

John: Yes, I can do that. Let me get my card.

AI: Perfect! I'll transfer you to our secure payment system to process that first payment and finalize the agreement.`,
      sentiment: "positive",
      keywords: ["payment plan", "financial difficulties", "willing to pay", "8-month plan"]
    },
    {
      id: 2,
      debtorName: "Sarah Johnson",
      callId: "call_002", 
      duration: "03:45",
      timestamp: "2024-01-27 13:15",
      outcome: "callback_requested",
      confidence: 0.92,
      transcription: `AI: Hello, this is calling from XYZ Collections regarding your account. Is this Sarah Johnson?

Sarah: Yes, but I'm at work right now and can't really talk.

AI: I understand you're busy, Sarah. This will just take a moment. I'm calling about your outstanding balance of $1,200. When would be a good time to call you back to discuss this?

Sarah: Can you call me tonight after 7 PM? I'll be home then and can talk properly.

AI: Of course! I'll schedule a callback for tonight at 7:15 PM. We'll discuss payment options that work for your situation. Is this the best number to reach you at?

Sarah: Yes, this number is fine. Thank you for being understanding.

AI: You're welcome, Sarah. We look forward to speaking with you tonight at 7:15 PM. Have a good rest of your day at work.

Sarah: Thank you, bye.`,
      sentiment: "neutral",
      keywords: ["work", "callback", "7 PM", "understanding"]
    }
  ];

  const templates = {
    whatsapp: [
      {
        id: "reminder_friendly",
        title: "Friendly Payment Reminder",
        content: "Hi {name}! This is a gentle reminder about your outstanding payment of ${amount}. We're here to help if you need to discuss payment options. 😊"
      },
      {
        id: "reminder_firm",
        title: "Firm Payment Notice", 
        content: "Dear {name}, your payment of ${amount} is now overdue. Please contact us immediately to avoid further action."
      },
      {
        id: "settlement_offer",
        title: "Settlement Proposal",
        content: "Hi {name}, we'd like to offer you a settlement option for your outstanding balance. Let's discuss a payment plan that works for you."
      }
    ],
    sms: [
      {
        id: "sms_reminder",
        title: "SMS Reminder",
        content: "Payment reminder: ${amount} due. Call us at (555) 123-4567 to discuss options. Reply STOP to opt out."
      },
      {
        id: "sms_urgent",
        title: "Urgent Notice",
        content: "URGENT: ${amount} payment overdue. Contact us today to avoid collection action."
      }
    ],
    email: [
      {
        id: "email_formal",
        title: "Formal Payment Request",
        content: "Dear {name},\n\nThis letter serves as a formal request for payment of your outstanding balance of ${amount}, which was due on {due_date}.\n\nPlease remit payment immediately or contact our office to discuss payment arrangements.\n\nSincerely,\nCollections Department"
      },
      {
        id: "email_friendly",
        title: "Friendly Follow-up",
        content: "Hi {name},\n\nI hope this email finds you well. I wanted to reach out regarding your account balance of ${amount}.\n\nIf you're experiencing financial difficulties, we're here to work with you on a payment plan.\n\nBest regards,\n{collector_name}"
      }
    ]
  };

  const aiPersonalities = [
    {
      id: "friendly",
      name: "Friendly",
      icon: Smile,
      description: "Warm and understanding approach",
      color: "text-green-600 bg-green-100"
    },
    {
      id: "firm",
      name: "Firm", 
      icon: Meh,
      description: "Professional and direct",
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      id: "legal",
      name: "Legal",
      icon: Shield,
      description: "Formal and compliance-focused",
      color: "text-red-600 bg-red-100"
    }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Monthly Reminder Campaign",
      type: "whatsapp",
      sent: 245,
      responded: 82,
      collected: 15400,
      status: "active",
      lastRun: "2 hours ago"
    },
    {
      id: 2,
      name: "Overdue SMS Blast",
      type: "sms",
      sent: 156,
      responded: 23, 
      collected: 7800,
      status: "completed",
      lastRun: "1 day ago"
    },
    {
      id: 3,
      name: "Settlement Email Series",
      type: "email",
      sent: 89,
      responded: 34,
      collected: 12600,
      status: "active",
      lastRun: "4 hours ago"
    }
  ];

  const quickActions = [
    { icon: MessageSquare, label: "WhatsApp Blast", count: 156, color: "text-green-600" },
    { icon: Phone, label: "AI Voice Calls", count: 89, color: "text-blue-600" },
    { icon: Mail, label: "Email Campaign", count: 234, color: "text-purple-600" },
    { icon: Calendar, label: "Schedule Follow-up", count: 45, color: "text-orange-600" }
  ];

  const openTranscriptionModal = (call: any) => {
    setSelectedCall(call);
    setShowTranscription(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600">Automate communications and manage debtor interactions</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="bg-white shadow-sm"
            onClick={() => setShowAIConfig(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button 
            variant="outline" 
            className="bg-white shadow-sm"
            onClick={() => setShowAddDebtor(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Debtor
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            onClick={() => setShowQuickCampaign(true)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Campaign
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card key={action.label} className="border-0 shadow-md bg-white/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{action.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{action.count}</p>
                  <p className="text-xs text-gray-500">available actions</p>
                </div>
                <action.icon className={`h-8 w-8 ${action.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Composer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Message Composer
              </CardTitle>
              <CardDescription>
                Create personalized messages for your debtors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Personality Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">AI Personality</label>
                <div className="grid grid-cols-3 gap-3">
                  {aiPersonalities.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => setSelectedTone(personality.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTone === personality.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${personality.color}`}>
                        <personality.icon className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-sm">{personality.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{personality.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Message Type & Template */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Message Type</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="voice">AI Voice Call</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Template</label>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select template...</option>
                    {templates.whatsapp.map((template) => (
                      <option key={template.id} value={template.id}>{template.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Composer */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here or select a template..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <Badge variant="outline">Variables: {"{name}"}, {"{amount}"}, {"{due_date}"}</Badge>
                    <Button size="sm" variant="ghost">
                      <Volume2 className="h-4 w-4 mr-1" />
                      Preview Audio
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">{message.length}/160 characters</span>
                </div>
              </div>

              {/* Send Options */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Selected Debtors (12)
                </Button>
                <Button variant="outline" className="bg-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Campaign
                </Button>
                <Button variant="outline" className="bg-white">
                  <Target className="h-4 w-4 mr-2" />
                  Test Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call Transcriptions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Recent Call Transcriptions
              </CardTitle>
              <CardDescription>
                AI-generated transcriptions of recent debt collection calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callTranscriptions.map((call) => (
                  <div key={call.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{call.debtorName}</h4>
                          <p className="text-sm text-gray-500">{call.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${
                          call.outcome === 'payment_agreed' ? 'bg-green-100 text-green-800' :
                          call.outcome === 'callback_requested' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {call.outcome.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-sm font-medium">Duration: {call.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Confidence: {Math.round(call.confidence * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full ${
                            call.sentiment === 'positive' ? 'bg-green-500' :
                            call.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                          <span className="text-sm text-gray-600 capitalize">{call.sentiment}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8"
                          onClick={() => openTranscriptionModal(call)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <strong>Keywords:</strong> {call.keywords.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recent Campaigns
              </CardTitle>
              <CardDescription>
                Track performance of your automated campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {campaign.type === 'whatsapp' && <MessageSquare className="h-5 w-5 text-green-600" />}
                          {campaign.type === 'sms' && <Phone className="h-5 w-5 text-blue-600" />}
                          {campaign.type === 'email' && <Mail className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                          <p className="text-sm text-gray-500">Last run {campaign.lastRun}</p>
                        </div>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'outline'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{campaign.sent}</p>
                        <p className="text-xs text-gray-500">Sent</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{campaign.responded}</p>
                        <p className="text-xs text-gray-500">Responded</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">${campaign.collected.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Collected</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-purple-600">{Math.round((campaign.responded / campaign.sent) * 100)}%</p>
                        <p className="text-xs text-gray-500">Response Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Auto-Reminders */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Auto-Reminders
              </CardTitle>
              <CardDescription>
                Automated follow-up sequences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="text-sm font-medium">7-Day Overdue</p>
                  <p className="text-xs text-gray-500">WhatsApp + Email</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="text-sm font-medium">30-Day Final Notice</p>
                  <p className="text-xs text-gray-500">All channels</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Payment Plan Reminder</p>
                  <p className="text-xs text-gray-500">SMS + Call</p>
                </div>
                <Badge variant="outline">Paused</Badge>
              </div>
              
              <Button variant="outline" className="w-full bg-white">
                <Settings className="h-4 w-4 mr-2" />
                Configure Rules
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Messages Sent</span>
                </div>
                <span className="font-semibold">1,247</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Responses</span>
                </div>
                <span className="font-semibold">89</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Failed Deliveries</span>
                </div>
                <span className="font-semibold">23</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection Rate</span>
                <span className="font-bold text-green-600">7.1%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AIConfigModal open={showAIConfig} onOpenChange={setShowAIConfig} />
      <AddDebtorModal open={showAddDebtor} onOpenChange={setShowAddDebtor} />
      <QuickCampaignModal open={showQuickCampaign} onOpenChange={setShowQuickCampaign} />

      {/* Transcription Modal */}
      {selectedCall && (
        <Dialog open={showTranscription} onOpenChange={setShowTranscription}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Call Transcription - {selectedCall.debtorName}
              </DialogTitle>
              <DialogDescription>
                Full conversation transcript with AI analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Call Duration</p>
                  <p className="font-semibold">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <p className="font-semibold">{Math.round(selectedCall.confidence * 100)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <Badge className={`${
                    selectedCall.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    selectedCall.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCall.sentiment}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg">
                <h4 className="font-semibold mb-3">Full Transcript</h4>
                <div className="whitespace-pre-wrap text-sm">{selectedCall.transcription}</div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Transcript
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
