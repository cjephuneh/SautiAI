import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Phone,
  Play,
  Pause,
  Square,
  Users,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Settings,
  Loader2,
  PhoneCall,
  UserCheck,
  Target,
  BarChart3,
  Download,
  Upload,
  Mail,
  MessageSquare,
  MessageCircle,
  Send
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { contactsApi, agentsApi, callsApi } from "@/services/api";
import axios from "axios";

interface Contact {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  debt_amount: number;
  payment_status: string;
  last_contact_date?: string;
  priority: 'high' | 'medium' | 'low';
}

interface Agent {
  id: number;
  name: string;
  voice_id: string;
  is_active: boolean;
}

interface BatchCampaign {
  id: string;
  contact_id: number;
  agent_id?: number;
  channel: 'voice' | 'email' | 'sms' | 'whatsapp';
  status: 'pending' | 'sending' | 'calling' | 'completed' | 'failed' | 'delivered' | 'read';
  start_time?: string;
  end_time?: string;
  duration?: number;
  outcome?: string;
  contact: Contact;
  message_content?: string;
  delivery_status?: string;
}

const batchCallsApi = {
  startBatchVoiceCampaign: async (campaign_name: string, agent_id: number, contact_ids: number[]) => {
    const response = await axios.post("Call Centrelocalhost:5050/batch-calls/start", {
      campaign_name,
      agent_id,
      contact_ids,
    });
    return response.data;
  },
  getCampaignStatus: async (campaign_id: number) => {
    const response = await axios.get(`Call Centrelocalhost:5050/batch-calls/campaign/${campaign_id}/status`);
    return response.data;
  },
};

const BatchCalling = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<'voice' | 'email' | 'sms' | 'whatsapp' | string>('voice');
  const [batchCampaigns, setBatchCampaigns] = useState<BatchCampaign[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState<BatchCampaign | null>(null);
  const [defaultAgentId, setDefaultAgentId] = useState<number | null>(Number(localStorage.getItem('default_agent_id') || '') || null);
  
  // Message content states with default values
  const [emailSubject, setEmailSubject] = useState("Payment Reminder - {name}");
  const [emailContent, setEmailContent] = useState("Dear {name},\n\nWe hope this message finds you well. We're reaching out regarding your outstanding balance of ${debt_amount}.\n\nWe understand that financial situations can be challenging, and we're here to work with you to find a solution that works for both parties.\n\nPlease contact us at your earliest convenience to discuss payment options or to set up a payment plan.\n\nThank you for your attention to this matter.\n\nBest regards,\nSautiAI Collections Team");
  const [smsContent, setSmsContent] = useState("Hi {name}, this is a reminder about your ${debt_amount} balance. Please call us to discuss payment options.");
  const [whatsappContent, setWhatsappContent] = useState("Hello {name}! 👋\n\nWe hope you're doing well. We wanted to reach out about your ${debt_amount} balance.\n\nLet's work together to find a solution that works for you. Please reply to this message or give us a call.\n\nThank you! 🙏");

  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
    fetchAgents();
  }, []);

  useEffect(() => {
    // Sync default agent if changed elsewhere
    const id = Number(localStorage.getItem('default_agent_id') || '') || null;
    setDefaultAgentId(id);
  }, [selectedChannel]);

  const fetchContacts = async () => {
    try {
      const data = await contactsApi.getContacts();
      const processedContacts = (data.contacts || []).map((contact: any) => ({
        ...contact,
        priority: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        last_contact_date: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
      }));
      setContacts(processedContacts);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await agentsApi.getAgents();
      setAgents(Array.isArray(data) ? data.filter(agent => agent.is_active) : []);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };

  const handleContactSelect = (contactId: number, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const getChannelConfig = (channel: string) => {
    switch (channel) {
      case 'voice':
        return {
          icon: Phone,
          color: 'text-blue-600 bg-blue-100',
          label: 'Voice Calls',
          description: 'AI-powered voice calls with selected agent',
          requiresAgent: true
        };
      case 'email':
        return {
          icon: Mail,
          color: 'text-green-600 bg-green-100',
          label: 'Email Campaign',
          description: 'Send personalized email messages',
          requiresAgent: false
        };
      case 'sms':
        return {
          icon: MessageSquare,
          color: 'text-purple-600 bg-purple-100',
          label: 'SMS Campaign',
          description: 'Send text messages to mobile numbers',
          requiresAgent: false
        };
      case 'whatsapp':
        return {
          icon: MessageCircle,
          color: 'text-green-600 bg-green-100',
          label: 'WhatsApp Campaign',
          description: 'Send WhatsApp messages',
          requiresAgent: false
        };
      default:
        return {
          icon: Phone,
          color: 'text-gray-600 bg-gray-100',
          label: 'Unknown',
          description: '',
          requiresAgent: false
        };
    }
  };

  const startBatchCampaign = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one contact.",
        variant: "destructive",
      });
      return;
    }

    const channelConfig = getChannelConfig(selectedChannel);
    
    if (channelConfig.requiresAgent && !selectedAgent) {
      toast({
        title: "Error",
        description: "Please select an AI agent for voice calls.",
        variant: "destructive",
      });
      return;
    }

    // Validate message content for non-voice channels
    if (selectedChannel === 'email') {
      if (!emailSubject.trim()) {
        toast({
          title: "Error",
          description: "Please provide an email subject.",
          variant: "destructive",
        });
        return;
      }
      if (!emailContent.trim()) {
        toast({
          title: "Error",
          description: "Please provide email content.",
          variant: "destructive",
        });
        return;
      }
    }

    if (selectedChannel === 'sms') {
      if (!smsContent.trim()) {
        toast({
          title: "Error",
          description: "Please provide SMS message content.",
          variant: "destructive",
        });
        return;
      }
      if (smsContent.length > 160) {
        toast({
          title: "Error",
          description: "SMS message must be 160 characters or less.",
          variant: "destructive",
        });
        return;
      }
    }

    if (selectedChannel === 'whatsapp' && !whatsappContent.trim()) {
      toast({
        title: "Error",
        description: "Please provide WhatsApp message content.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(false);
    setIsActive(true);
    setIsPaused(false);
    setProgress(0);

    // Voice batch: use /batch-calls/start API
    if (selectedChannel === "voice") {
      try {
        const agentId = parseInt(selectedAgent);
        const contactIds = selectedContacts;
        const campaignName = "Batch Voice Campaign"; // You can make this user-editable

        // Call the batch voice API
        const batchResult = await batchCallsApi.startBatchVoiceCampaign(
          campaignName,
          agentId,
          contactIds
        );

        // Optionally, poll for campaign status using batchResult.campaign_id
        // For now, simulate local UI progress
        setBatchCampaigns(
          contactIds.map((contactId) => {
            const contact = contacts.find((c) => c.id === contactId)!;
            return {
              id: `batch_${batchResult.campaign_id}_${contactId}`,
              contact_id: contactId,
              agent_id: agentId,
              channel: "voice",
              status: "pending",
              contact,
              message_content: "",
            };
          })
        );

        // Simulate progress (or poll for real status)
        await processBatchCampaign(
          contactIds.map((contactId) => {
            const contact = contacts.find((c) => c.id === contactId)!;
            return {
              id: `batch_${batchResult.campaign_id}_${contactId}`,
              contact_id: contactId,
              agent_id: agentId,
              channel: "voice",
              status: "pending",
              contact,
              message_content: "",
            };
          })
        );
        return;
      } catch (error) {
        setIsActive(false);
        setProgress(0);
        toast({
          title: "Error",
          description: "Failed to start batch voice campaign.",
          variant: "destructive",
        });
        return;
      }
    }

    // Initialize batch campaigns
    const initialCampaigns: BatchCampaign[] = selectedContacts.map(contactId => {
      const contact = contacts.find(c => c.id === contactId)!;
      const messageContent = getMessageContent(contact);
      
      return {
        id: `batch_${Date.now()}_${contactId}`,
        contact_id: contactId,
        agent_id: selectedAgent ? parseInt(selectedAgent) : undefined,
        channel: selectedChannel as 'voice' | 'email' | 'sms' | 'whatsapp',
        status: 'pending',
        contact,
        message_content: messageContent
      };
    });

    setBatchCampaigns(initialCampaigns);

    // Start campaign process
    await processBatchCampaign(initialCampaigns);
  };

  const getMessageContent = (contact: Contact): string => {
    const variables: { [key: string]: string } = {
      name: contact.name,
      debt_amount: contact.debt_amount.toLocaleString(),
      phone_number: contact.phone_number
    };

    switch (selectedChannel) {
      case 'email':
        return emailContent.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
      case 'sms':
        return smsContent.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
      case 'whatsapp':
        return whatsappContent.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
      default:
        return '';
    }
  };

  const processBatchCampaign = async (campaigns: BatchCampaign[]) => {
    // For voice batch, skip API call per contact (already handled by batch API)
    if (selectedChannel === "voice") {
      for (let i = 0; i < campaigns.length; i++) {
        if (!isActive || isPaused) break;
        const campaign = campaigns[i];
        setCurrentItem(campaign);

        // Simulate status update
        setBatchCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaign.id
              ? {
                  ...c,
                  status: "calling",
                  start_time: new Date().toISOString(),
                }
              : c
          )
        );

        // Simulate call duration
        const processingDuration = Math.floor(Math.random() * 3000) + 1000;
        await new Promise((resolve) => setTimeout(resolve, processingDuration));

        // Simulate outcome
        const outcomes = getChannelOutcomes("voice");
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as { status: string; outcome: string; delivery_status?: string };
        const duration = Math.floor(processingDuration / 1000);

        setBatchCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaign.id
              ? {
                  ...c,
                  status: randomOutcome.status as any,
                  end_time: new Date().toISOString(),
                  duration: duration,
                  outcome: randomOutcome.outcome,
                  delivery_status: randomOutcome.delivery_status ?? undefined,
                }
              : c
          )
        );
        setProgress(((i + 1) / campaigns.length) * 100);
      }
      setIsActive(false);
      setCurrentItem(null);
      toast({
        title: "Campaign Complete",
        description: `Voice campaign completed for ${campaigns.length} contacts.`,
      });
      return;
    }

    for (let i = 0; i < campaigns.length; i++) {
      if (!isActive || isPaused) break;

      const campaign = campaigns[i];
      setCurrentItem(campaign);

      // Update status to sending/calling
      const sendingStatus = selectedChannel === 'voice' ? 'calling' : 'sending';
      setBatchCampaigns(prev => prev.map(c => 
        c.id === campaign.id ? { 
          ...c, 
          status: sendingStatus as any, 
          start_time: new Date().toISOString() 
        } : c
      ));

      try {
        let result;
        switch (selectedChannel) {
          case 'voice':
            // Use contactsApi.initiateCall for batch voice calls
            result = await contactsApi.initiateCall(campaign.contact_id, campaign.agent_id!);
            break;
          case 'email':
            result = await simulateEmailSend(campaign);
            break;
          case 'sms':
            result = await simulateSMSSend(campaign);
            break;
          case 'whatsapp':
            result = await simulateWhatsAppSend(campaign);
            break;
        }
        
        // Simulate processing duration
        const processingDuration = Math.floor(Math.random() * 3000) + 1000;
        await new Promise(resolve => setTimeout(resolve, processingDuration));

        // Simulate outcomes based on channel
        const outcomes = getChannelOutcomes(selectedChannel);
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as { status: string; outcome: string; delivery_status?: string };
        const duration = selectedChannel === 'voice' ? Math.floor(processingDuration / 1000) : undefined;

        // Update campaign result
        setBatchCampaigns(prev => prev.map(c => 
          c.id === campaign.id ? { 
            ...c, 
            status: randomOutcome.status as any,
            end_time: new Date().toISOString(),
            duration: duration,
            outcome: randomOutcome.outcome,
            delivery_status: randomOutcome.delivery_status
          } : c
        ));

      } catch (error) {
        console.error(`Failed to process ${selectedChannel} for ${campaign.contact.name}:`, error);
        
        setBatchCampaigns(prev => prev.map(c => 
          c.id === campaign.id ? { 
            ...c, 
            status: 'failed',
            end_time: new Date().toISOString()
          } : c
        ));
      }

      // Update progress
      setProgress(((i + 1) / campaigns.length) * 100);
    }

    // Finish batch campaign
    setIsActive(false);
    setCurrentItem(null);
    
    const channelConfig = getChannelConfig(selectedChannel);
    toast({
      title: "Campaign Complete",
      description: `${channelConfig.label} campaign completed for ${campaigns.length} contacts.`,
    });
  };

  const simulateEmailSend = async (campaign: BatchCampaign) => {
    // Simulate email API call
    return { message_id: `email_${Date.now()}`, status: 'sent' };
  };

  const simulateSMSSend = async (campaign: BatchCampaign) => {
    // Simulate SMS API call
    return { message_id: `sms_${Date.now()}`, status: 'sent' };
  };

  const simulateWhatsAppSend = async (campaign: BatchCampaign) => {
    // Simulate WhatsApp API call
    return { message_id: `wa_${Date.now()}`, status: 'sent' };
  };

  const getChannelOutcomes = (channel: string) => {
    switch (channel) {
      case 'voice':
        return [
          { status: 'completed', outcome: 'payment_agreed' },
          { status: 'completed', outcome: 'callback_requested' },
          { status: 'failed', outcome: 'no_answer' },
          { status: 'failed', outcome: 'busy' }
        ];
      case 'email':
        return [
          { status: 'delivered', outcome: 'delivered', delivery_status: 'delivered' },
          { status: 'delivered', outcome: 'opened', delivery_status: 'opened' },
          { status: 'failed', outcome: 'bounced', delivery_status: 'bounced' },
          { status: 'delivered', outcome: 'clicked', delivery_status: 'clicked' }
        ];
      case 'sms':
        return [
          { status: 'delivered', outcome: 'delivered', delivery_status: 'delivered' },
          { status: 'delivered', outcome: 'read', delivery_status: 'read' },
          { status: 'failed', outcome: 'failed', delivery_status: 'failed' }
        ];
      case 'whatsapp':
        return [
          { status: 'delivered', outcome: 'delivered', delivery_status: 'delivered' },
          { status: 'read', outcome: 'read', delivery_status: 'read' },
          { status: 'delivered', outcome: 'replied', delivery_status: 'replied' },
          { status: 'failed', outcome: 'failed', delivery_status: 'failed' }
        ];
      default:
        return [{ status: 'completed', outcome: 'completed' }];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'calling': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'no_answer': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-purple-600 bg-purple-100';
      case 'sending': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'read': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'calling': return <PhoneCall className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'busy': case 'no_answer': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-purple-500" />;
      case 'sending': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read': return <UserCheck className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone_number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || contact.payment_status === statusFilter;
    const matchesPriority = priorityFilter === "all" || contact.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const campaignStats = {
    total: batchCampaigns.length,
    completed: batchCampaigns.filter(c => c.status === 'completed' || c.status === 'delivered' || c.status === 'read').length,
    failed: batchCampaigns.filter(c => c.status === 'failed').length,
    pending: batchCampaigns.filter(c => c.status === 'pending').length,
    successful_outcomes: batchCampaigns.filter(c => 
      c.outcome === 'payment_agreed' || 
      c.outcome === 'delivered' || 
      c.outcome === 'read' || 
      c.outcome === 'clicked' || 
      c.outcome === 'replied'
    ).length
  };

  const channelConfig = getChannelConfig(selectedChannel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Communications</h1>
          <p className="text-gray-600">Send voice calls, emails, SMS, or WhatsApp messages to multiple contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import List
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Channel Selection */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <channelConfig.icon className="h-5 w-5" />
            Communication Channel
          </CardTitle>
          <CardDescription>
            Choose how you want to reach your contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {(['voice', 'email', 'sms', 'whatsapp'] as const).map((channel) => {
              const config = getChannelConfig(channel);
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  disabled={isActive}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedChannel === channel 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <div className={`p-3 rounded-full mx-auto mb-3 w-fit ${config.color}`}>
                    <config.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{config.label}</h3>
                  <p className="text-xs text-gray-600">{config.description}</p>
                </button>
              );
            })}
          </div>

          {/* Channel-specific Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              {channelConfig.requiresAgent && (
                <div>
                  <Label>Select AI Agent</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={isActive}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an AI agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            {agent.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {defaultAgentId && (
                    <div className="mt-2 p-2 rounded-md bg-blue-50 border border-blue-200 text-sm flex items-center justify-between">
                      <span>
                        Default agent: <strong>{agents.find(a => a.id === defaultAgentId)?.name || `#${defaultAgentId}`}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgent(String(defaultAgentId))}
                          disabled={isActive}
                        >
                          Use default
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { localStorage.removeItem('default_agent_id'); setDefaultAgentId(null); }}
                          disabled={isActive}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium text-gray-700">Selected Contacts</p>
                <p className="text-2xl font-bold text-blue-600">{selectedContacts.length}</p>
                <p className="text-xs text-gray-500">contacts ready for {channelConfig.label.toLowerCase()}</p>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              {selectedChannel === 'email' && (
                <>
                  <div>
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Payment Reminder - {name}"
                      disabled={isActive}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-content">Email Content</Label>
                    <Textarea
                      id="email-content"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Dear {name}, we're reaching out regarding your outstanding balance..."
                      rows={6}
                      disabled={isActive}
                    />
                    <p className="text-xs text-gray-500 mt-1">{emailContent.length} characters</p>
                  </div>
                </>
              )}

              {selectedChannel === 'sms' && (
                <div>
                  <Label htmlFor="sms-content">SMS Message</Label>
                  <Textarea
                    id="sms-content"
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                    placeholder="Hi {name}, this is a reminder about your ${debt_amount} balance..."
                    rows={3}
                    disabled={isActive}
                    maxLength={160}
                  />
                  <p className={`text-xs mt-1 ${smsContent.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                    {smsContent.length}/160 characters
                  </p>
                </div>
              )}

              {selectedChannel === 'whatsapp' && (
                <div>
                  <Label htmlFor="whatsapp-content">WhatsApp Message</Label>
                  <Textarea
                    id="whatsapp-content"
                    value={whatsappContent}
                    onChange={(e) => setWhatsappContent(e.target.value)}
                    placeholder="Hello {name}! 👋 We hope you're doing well..."
                    rows={5}
                    disabled={isActive}
                  />
                  <p className="text-xs text-gray-500 mt-1">{whatsappContent.length} characters</p>
                </div>
              )}

              {selectedChannel !== 'voice' && (
                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Available variables:</p>
                  <p>• <code>{'{name}'}</code> - Contact name</p>
                  <p>• <code>{'{debt_amount}'}</code> - Debt amount</p>
                  <p>• <code>{'{phone_number}'}</code> - Phone number</p>
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="space-y-4">
              {!isActive ? (
                <Button 
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={selectedContacts.length === 0 || (channelConfig.requiresAgent && !selectedAgent)}
                  className="w-full h-12 text-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Start {channelConfig.label}
                </Button>
              ) : (
                <div className="space-y-2">
                  {!isPaused ? (
                    <Button onClick={() => setIsPaused(true)} variant="outline" className="w-full">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={() => setIsPaused(false)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={() => setIsActive(false)} variant="destructive" className="w-full">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Campaign
                  </Button>
                </div>
              )}

              {currentItem && (
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm font-medium text-gray-700">Currently Processing</p>
                  <p className="font-semibold">{currentItem.contact.name}</p>
                  <p className="text-sm text-gray-600">{currentItem.contact.phone_number}</p>
                </div>
              )}

              {isActive && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white rounded border">
                      <p className="text-lg font-bold text-green-600">{campaignStats.completed}</p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <p className="text-lg font-bold text-red-600">{campaignStats.failed}</p>
                      <p className="text-xs text-gray-600">Failed</p>
                    </div>
                  </div>
                </div>
              )}

              {batchCampaigns.length > 0 && !isActive && (
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm font-medium text-gray-700">Last Campaign Results</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{campaignStats.successful_outcomes}</p>
                      <p className="text-xs text-gray-600">Success</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {campaignStats.total > 0 ? ((campaignStats.successful_outcomes / campaignStats.total) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-xs text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Selection
              </CardTitle>
              <CardDescription>
                Choose which contacts to include in your batch campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={isActive}
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isActive}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter} disabled={isActive}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact List */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={handleSelectAll}
                      disabled={isActive}
                    />
                    <span className="font-medium">
                      Select All ({filteredContacts.length} contacts)
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={(checked) => handleContactSelect(contact.id, checked as boolean)}
                          disabled={isActive}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            <Badge className={getPriorityColor(contact.priority)}>
                              {contact.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{contact.phone_number}</p>
                          <p className="text-sm text-gray-500">
                            Debt: ${contact.debt_amount.toLocaleString()} • {contact.payment_status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campaign Results */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Campaign Results
              </CardTitle>
              <CardDescription>
                Real-time results of your {channelConfig.label.toLowerCase()} campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No campaigns sent yet</p>
                  <p className="text-sm text-gray-400">Results will appear here when you start your campaign</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {batchCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(campaign.status)}
                        <div>
                          <p className="font-medium text-sm">{campaign.contact.name}</p>
                          <p className="text-xs text-gray-600">{campaign.contact.phone_number}</p>
                        </div>
                      </div>
                      
                      <div className="ml-auto">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.replace('_', ' ')}
                        </Badge>
                        {campaign.delivery_status && (
                          <p className="text-xs text-gray-500 mt-1">{campaign.delivery_status}</p>
                        )}
                        {campaign.duration && (
                          <p className="text-xs text-gray-500 mt-1">{campaign.duration}s</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm {channelConfig.label} Campaign</DialogTitle>
            <DialogDescription>
              You are about to start a {channelConfig.label.toLowerCase()} campaign for {selectedContacts.length} contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Campaign Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Contacts to reach:</p>
                  <p className="font-medium">{selectedContacts.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Communication method:</p>
                  <p className="font-medium">{channelConfig.label}</p>
                </div>
                {channelConfig.requiresAgent && (
                  <div className="col-span-2">
                    <p className="text-gray-600">AI Agent:</p>
                    <p className="font-medium">{agents.find(a => a.id.toString() === selectedAgent)?.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Estimated duration:</p>
                  <p className="font-medium">
                    {selectedChannel === 'voice' 
                      ? `${Math.ceil(selectedContacts.length * 0.5)} - ${selectedContacts.length * 2} minutes`
                      : `${Math.ceil(selectedContacts.length * 0.1)} - ${Math.ceil(selectedContacts.length * 0.3)} minutes`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estimated cost:</p>
                  <p className="font-medium">
                    {selectedChannel === 'voice' 
                      ? `$${(selectedContacts.length * 0.05).toFixed(2)} - $${(selectedContacts.length * 0.15).toFixed(2)}`
                      : `$${(selectedContacts.length * 0.01).toFixed(2)} - $${(selectedContacts.length * 0.03).toFixed(2)}`
                    }
                  </p>
                </div>
              </div>
              
              {/* Message Preview */}
              {selectedChannel !== 'voice' && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs font-medium text-gray-600 mb-1">Message Preview:</p>
                  {selectedChannel === 'email' && (
                    <div className="text-sm">
                      <p><strong>Subject:</strong> {emailSubject.replace('{name}', 'John Doe')}</p>
                      <p className="mt-1"><strong>Content:</strong> {emailContent.replace(/\{(\w+)\}/g, (match, key) => {
                        const sample = { name: 'John Doe', debt_amount: '2,500', phone_number: '+1234567890' };
                        return sample[key as keyof typeof sample] || match;
                      }).substring(0, 100)}...</p>
                    </div>
                  )}
                  {selectedChannel === 'sms' && (
                    <p className="text-sm">{smsContent.replace(/\{(\w+)\}/g, (match, key) => {
                      const sample = { name: 'John Doe', debt_amount: '2,500', phone_number: '+1234567890' };
                      return sample[key as keyof typeof sample] || match;
                    })}</p>
                  )}
                  {selectedChannel === 'whatsapp' && (
                    <p className="text-sm">{whatsappContent.replace(/\{(\w+)\}/g, (match, key) => {
                      const sample = { name: 'John Doe', debt_amount: '2,500', phone_number: '+1234567890' };
                      return sample[key as keyof typeof sample] || match;
                    }).substring(0, 150)}...</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={startBatchCampaign} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Start Campaign
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchCalling;
