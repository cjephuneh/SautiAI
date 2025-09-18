import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, 
  MessageSquare, 
  ChevronRight, 
  Lightbulb, 
  AlertTriangle, 
  ExternalLink, 
  Home, 
  Send,
  FileText,
  BookOpen,
  Bug,
  Star,
  Clock,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Download,
  Share2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Zap,
  Globe,
  Shield,
  Settings,
  HelpCircle,
  Search,
  Filter,
  SortAsc,
  Bell,
  Archive,
  Trash2,
  Edit,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Volume2,
  DollarSign,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Ticket {
  id: string;
  type: 'feature' | 'bug';
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  type: 'text' | 'file' | 'link' | 'action';
  metadata?: any;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'tickets' | 'docs'>('home');
  const [messageInput, setMessageInput] = useState('');
  const [ticketForm, setTicketForm] = useState({
    type: 'feature' as 'feature' | 'bug',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    tags: [] as string[]
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to SautiAI Support! 👋 How can I help you today?',
      sender: 'agent',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICKET-001',
      type: 'feature',
      title: 'Add Swahili voice support',
      description: 'Request to add more Swahili voices for better customer engagement in East Africa',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      assignedTo: 'Voice Team',
      tags: ['voice', 'multilingual', 'africa']
    },
    {
      id: 'TICKET-002',
      type: 'bug',
      title: 'Web call audio cutting out',
      description: 'Users reporting audio cutting out during web calls after 5 minutes',
      status: 'open',
      priority: 'urgent',
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      tags: ['web-call', 'audio', 'bug']
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me help you with that! 🤖",
        "That's a great question! Here's what I can tell you... 💡",
        "I've noted your request. Our team will look into this. 📝",
        "Thanks for reaching out! I'm here to assist you. ✨",
        "Let me connect you with the right resources for this. 🔗",
        "I can help you troubleshoot this issue step by step. 🛠️",
        "That's an interesting feature request! I'll pass it along. ⭐",
        "I'm checking our knowledge base for the best solution... 🔍"
      ];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCreateTicket = () => {
    if (!ticketForm.title || !ticketForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and description for the ticket.",
        variant: "destructive",
      });
      return;
    }

    const newTicket: Ticket = {
      id: `TICKET-${String(tickets.length + 1).padStart(3, '0')}`,
      type: ticketForm.type,
      title: ticketForm.title,
      description: ticketForm.description,
      status: 'open',
      priority: ticketForm.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ticketForm.tags
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketForm({
      type: 'feature',
      title: '',
      description: '',
      priority: 'medium',
      tags: []
    });

    toast({
      title: "Ticket Created! 🎉",
      description: `Your ${ticketForm.type === 'feature' ? 'feature request' : 'bug report'} has been submitted.`,
    });

    setActiveTab('tickets');
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      'agent-setup': 'I can help you set up your AI agent! Let me guide you through the process.',
      'voice-selection': 'Great choice! I can help you find the perfect voice for your needs.',
      'web-call-test': 'Let me help you test your web call functionality.',
      'api-integration': 'I can assist you with API integration and documentation.',
      'billing': 'I can help you with billing questions and account management.',
      'troubleshooting': 'Let me help you troubleshoot any issues you\'re experiencing.'
    };

    const message: Message = {
      id: Date.now().toString(),
      content: quickMessages[action as keyof typeof quickMessages] || 'How can I help you with that?',
      sender: 'agent',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setActiveTab('messages');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderHomeTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 mb-2">Hi there 👋</div>
        <div className="text-2xl font-bold text-gray-700">How can we help?</div>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full justify-between h-16 text-left bg-gray-50 hover:bg-gray-100 border-0"
          onClick={() => setActiveTab('messages')}
        >
          <span className="text-lg font-medium">Send us a message</span>
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Create a ticket</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-16 justify-between"
              onClick={() => {
                setTicketForm(prev => ({ ...prev, type: 'feature' }));
                setActiveTab('tickets');
              }}
            >
              <span>Feature request</span>
              <Lightbulb className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="h-16 justify-between"
              onClick={() => {
                setTicketForm(prev => ({ ...prev, type: 'bug' }));
                setActiveTab('tickets');
              }}
            >
              <span>Bug report</span>
              <AlertTriangle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">How-to / Docs</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between h-12"
              onClick={() => handleQuickAction('agent-setup')}
            >
              <span>How to create agents</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-between h-12"
              onClick={() => handleQuickAction('api-integration')}
            >
              <span>Refer API Docs</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('voice-selection')}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Voice Help
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('web-call-test')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Web Call
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('billing')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Billing
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('troubleshooting')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Troubleshoot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search messages..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
        {messages.filter(msg => 
          searchQuery === '' || 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-900 border'
            }`}>
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Type your message..." 
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copy Chat
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Support Tickets</h3>
        <Button onClick={() => setSelectedTicket(null)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {selectedTicket ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{selectedTicket.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Created</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Updated</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedTicket.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedTicket.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedTicket.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex gap-2 mt-1">
                    <Button 
                      variant={ticketForm.type === 'feature' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTicketForm(prev => ({ ...prev, type: 'feature' }))}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Feature
                    </Button>
                    <Button 
                      variant={ticketForm.type === 'bug' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTicketForm(prev => ({ ...prev, type: 'bug' }))}
                    >
                      <Bug className="h-4 w-4 mr-2" />
                      Bug
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={ticketForm.priority} 
                    onValueChange={(value: any) => setTicketForm(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="Brief description of the issue or request"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button onClick={handleCreateTicket} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h4 className="font-medium">Recent Tickets</h4>
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">{ticket.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDocsTab = () => (
    <div className="space-y-4">
      <div className="text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <h3 className="text-lg font-semibold mb-2">Documentation & Guides</h3>
        <p className="text-gray-600">Find answers and learn how to use SautiAI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-500" />
              <div>
                <h4 className="font-medium">Agent Setup Guide</h4>
                <p className="text-sm text-gray-600">Learn how to create and configure AI agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-8 w-8 text-purple-500" />
              <div>
                <h4 className="font-medium">Voice Configuration</h4>
                <p className="text-sm text-gray-600">Configure voices and audio settings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">Web Call Testing</h4>
                <p className="text-sm text-gray-600">Test and troubleshoot web calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-orange-500" />
              <div>
                <h4 className="font-medium">API Documentation</h4>
                <p className="text-sm text-gray-600">Complete API reference and examples</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Quick Links</h4>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-3" />
            Getting Started
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-3" />
            Configuration
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-3" />
            Security & Privacy
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Zap className="h-4 w-4 mr-3" />
            Performance Tips
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SAUTIAI
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex h-[70vh]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'home' && renderHomeTab()}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'tickets' && renderTicketsTab()}
            {activeTab === 'docs' && renderDocsTab()}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-center gap-8">
            <Button 
              variant={activeTab === 'home' ? 'default' : 'ghost'} 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => setActiveTab('home')}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'} 
              className="flex flex-col items-center gap-1 h-auto py-2 relative"
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Messages</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">1</span>
              </div>
            </Button>
            <Button 
              variant={activeTab === 'tickets' ? 'default' : 'ghost'} 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => setActiveTab('tickets')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">Tickets</span>
            </Button>
            <Button 
              variant={activeTab === 'docs' ? 'default' : 'ghost'} 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => setActiveTab('docs')}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Docs</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
