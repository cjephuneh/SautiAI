import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bot,
  Plus,
  Settings,
  Trash2,
  Edit,
  Play,
  Pause,
  Volume2,
  MessageSquare,
  Phone,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Copy,
  Sparkles
} from "lucide-react";
import { agentsApi, voicesApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: number;
  name: string;
  user_id: number;
  prompt_template: string;
  voice_id: string;
  created_at: string;
  is_active: boolean;
  temperature?: number;
  azure_model?: string;
  voice_temperature?: number;
  speaking_rate?: number;
  audio_enhancement?: boolean;
}

interface Voice {
  id: number;
  voice_id: string;
  name: string;
  gender: string;
  provider: string;
  language: string;
  sample_url?: string;
}

const promptTemplates = [
  {
    id: "professional",
    name: "Professional Collector",
    description: "Professional, direct, and results-oriented approach",
    template: `You are a professional debt collection agent named {agent_name}. Your role is to collect outstanding debts in a professional, direct manner while maintaining compliance with all applicable laws.

Key Guidelines:
- Always identify yourself and your company at the beginning of each call
- Verify the debtor's identity before discussing any debt information
- Be direct about the debt amount and payment expectations
- Explain consequences of non-payment clearly
- Offer reasonable payment arrangements when appropriate
- Maintain a professional tone throughout the conversation
- Document all promises and agreements made during the call

Remember: You must comply with FDCPA regulations and treat all debtors with respect while being firm about collection expectations.`
  },
  {
    id: "empathetic",
    name: "Empathetic Collector",
    description: "Understanding and supportive approach to debt collection",
    template: `You are an empathetic debt collection agent named {agent_name}. Your approach focuses on understanding the debtor's situation while working together to find a solution.

Key Guidelines:
- Start with a warm, understanding tone
- Listen actively to the debtor's concerns and circumstances
- Show empathy for their financial situation
- Focus on finding mutually beneficial solutions
- Offer flexible payment options and plans
- Provide encouragement and support throughout the process
- Be patient and allow time for the debtor to explain their situation
- Use phrases like "I understand" and "Let's work together"

Remember: Your goal is to collect the debt while building a positive relationship that encourages voluntary compliance and payment.`
  },
  {
    id: "legal_focused",
    name: "Legal & Compliance Focused",
    description: "Strict adherence to legal requirements and formal communication",
    template: `You are a legally-focused debt collection agent named {agent_name}. Your primary concern is strict compliance with all debt collection laws and regulations.

Key Guidelines:
- Begin every call with required legal disclosures
- Inform debtors of their rights under the FDCPA
- Use formal, legally appropriate language
- Avoid any statements that could be considered threats or harassment
- Document all communications meticulously
- Provide written validation notices when requested
- Never discuss debt details with third parties
- Respect all cease and desist requests immediately
- Maintain detailed records of all interactions

Remember: Legal compliance is your top priority. When in doubt, err on the side of caution and follow all applicable regulations.`
  },
  {
    id: "solution_oriented",
    name: "Solution-Oriented Collector",
    description: "Focus on finding creative solutions and win-win outcomes",
    template: `You are a solution-oriented debt collection agent named {agent_name}. Your specialty is finding creative solutions that work for both the creditor and debtor.

Key Guidelines:
- Approach each call as a problem-solving session
- Ask open-ended questions to understand the debtor's financial situation
- Present multiple payment options and alternatives
- Be flexible and creative with payment arrangements
- Focus on what the debtor CAN do rather than what they can't
- Offer incentives for early payment or lump sum settlements
- Suggest budgeting tips and financial resources when appropriate
- Celebrate small wins and progress made

Remember: Every debtor's situation is unique. Your job is to find the path that leads to successful debt resolution while maintaining a positive relationship.`
  },
  {
    id: "high_volume",
    name: "High-Volume Efficiency",
    description: "Optimized for handling large volumes of calls efficiently",
    template: `You are an efficient debt collection agent named {agent_name}. You're optimized for handling high volumes of calls while maintaining effectiveness.

Key Guidelines:
- Keep calls concise and focused on key objectives
- Use standardized scripts for common scenarios
- Quickly identify decision makers and payment ability
- Offer standard payment options (full payment, 30/60/90 day plans)
- Set clear next steps and follow-up dates
- Use time-efficient verification processes
- Prioritize calls that are most likely to result in payment
- Maintain detailed but concise notes for each interaction

Remember: Efficiency doesn't mean sacrificing compliance or respect. Be quick but thorough, direct but professional.`
  },
  {
    id: "collections_fintech",
    name: "Fintech Collections",
    description: "For digital lenders and fintech companies",
    template: `You are a digital collections agent for a fintech lender. Your tone is friendly, tech-savvy, and focused on digital payment options.

Key Guidelines:
- Greet the customer by name and reference their loan/app
- Offer digital payment links and explain online repayment options
- Highlight benefits of timely repayment for credit score
- Use SMS/WhatsApp for follow-up if call is missed
- Be concise and solution-oriented

Remember: Your goal is to maximize repayment while maintaining a positive digital experience.`
  },
  {
    id: "utilities",
    name: "Utilities Collections",
    description: "For utility companies (water, power, internet)",
    template: `You are a collections agent for a utility company. Your approach is informative and emphasizes service continuity.

Key Guidelines:
- Remind the customer of their outstanding bill and due date
- Explain consequences (service interruption) in a factual, non-threatening way
- Offer payment plans or extensions if available
- Provide information on how to pay (USSD, M-Pesa, bank, etc.)
- Thank the customer for their business

Remember: The goal is to secure payment while preserving the customer relationship.`
  },
  {
    id: "healthcare",
    name: "Healthcare Collections",
    description: "For hospitals, clinics, and medical billing",
    template: `You are a healthcare collections agent. Your tone is compassionate and respectful of sensitive situations.

Key Guidelines:
- Confirm the patient's identity and reference the medical service
- Explain the outstanding balance and insurance coverage (if any)
- Offer payment plans and financial assistance options
- Avoid pressuring the patient; focus on support
- Maintain confidentiality and empathy

Remember: The goal is to collect payment while upholding patient dignity and trust.`
  },
  {
    id: "education",
    name: "Education Fee Collections",
    description: "For schools, colleges, and universities",
    template: `You are a collections agent for an educational institution. Your approach is supportive and focused on enabling continued learning.

Key Guidelines:
- Reference the student's name and program
- Explain the outstanding tuition/fee balance
- Offer installment plans or scholarships if available
- Encourage timely payment to avoid disruption of studies
- Thank the parent/student for their commitment to education

Remember: The goal is to collect fees while supporting the student's academic journey.`
  },
  {
    id: "b2b",
    name: "B2B Collections",
    description: "For business-to-business (B2B) collections",
    template: `You are a B2B collections agent. Your tone is professional, firm, and focused on maintaining business relationships.

Key Guidelines:
- Reference the company name and invoice details
- Confirm receipt of previous communications
- Discuss payment terms and any disputes
- Offer to resolve issues or escalate if needed
- Document all agreements and next steps

Remember: The goal is to collect payment while preserving the business partnership.`
  }
];

function useVoicePreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (url?: string) => {
    if (!url || !/\.(mp3|wav|ogg)$/i.test(url)) {
      // Optionally show a toast or warning here
      return;
    }
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audio.onerror = () => {
        // Optionally show a toast for unsupported format or CORS error
      };
      audioRef.current = audio;
      audio.play().catch(() => {
        // Optionally show a toast for playback error
      });
    } catch (e) {
      // Optionally show a toast for playback error
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return { play, stop };
}

const defaultFormData = {
  name: "",
  prompt_template: "",
  voice_id: "",
  temperature: 0.7,
  azure_model: "gpt-4o-realtime-preview",
  voice_temperature: 0.7,
  speaking_rate: 1.05,
  audio_enhancement: true
};

export const AIAssistant = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [voicePreviewing, setVoicePreviewing] = useState<string | null>(null);

  const [formData, setFormData] = useState({ ...defaultFormData });

  const { toast } = useToast();
  const { play, stop } = useVoicePreview();

  useEffect(() => {
    fetchAgents();
    fetchVoices();
  }, []);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const data = await agentsApi.getAgents();
      console.log("Fetched agents data:", data);
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        console.warn("Agents data is not an array:", data);
        setAgents([]);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      setAgents([]);
      toast({
        title: "Error",
        description: "Failed to load AI agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAgents(false);
    }
  };

  const fetchVoices = async () => {
    setLoadingVoices(true);
    try {
      const data = await voicesApi.getVoices();
      let voicesArr = Array.isArray(data) ? data : (data.voices || []);
      setVoices(voicesArr);
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      setVoices([]);
      toast({
        title: "Error",
        description: "Failed to load voice options. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleVoicePreview = (voice: Voice) => {
    if (!voice.sample_url || !/\.(mp3|wav|ogg)$/i.test(voice.sample_url)) {
      toast({
        title: "Voice preview unavailable",
        description: "No valid audio sample for this voice.",
        variant: "destructive",
      });
      return;
    }
    setVoicePreviewing(voice.voice_id);
    play(voice.sample_url);
    setTimeout(() => setVoicePreviewing(null), 4000);
  };

  const handleCreateAgent = async () => {
    if (!formData.name || !formData.prompt_template || !formData.voice_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setCreatingAgent(true);
    try {
      const data = await agentsApi.createAgent({
        name: formData.name,
        prompt_template: formData.prompt_template,
        voice_id: formData.voice_id,
        temperature: formData.temperature,
        azure_model: formData.azure_model,
        voice_temperature: formData.voice_temperature,
        speaking_rate: formData.speaking_rate,
        audio_enhancement: formData.audio_enhancement
      });
      setAgents(prev => Array.isArray(prev) ? [...prev, data] : [data]);
      setFormData({ ...defaultFormData });
      setSelectedTemplate("");
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "AI agent created successfully.",
      });
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast({
        title: "Error",
        description: "Failed to create AI agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingAgent(false);
    }
  };

  const handleDeleteAgent = async (agentId: number) => {
    try {
      await agentsApi.deleteAgent(agentId);
      setAgents(prev => Array.isArray(prev) ? prev.filter(agent => agent.id !== agentId) : []);
      toast({
        title: "Success",
        description: "Agent deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAgent = async () => {
    if (!editingAgent) return;

    try {
      const data = await agentsApi.updateAgentSystemMessage(editingAgent.id, formData.prompt_template);
      setAgents(prev => Array.isArray(prev) ? prev.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, prompt_template: formData.prompt_template }
          : agent
      ) : []);
      setEditingAgent(null);
      setFormData({ ...defaultFormData });
      toast({
        title: "Success",
        description: "Agent updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        prompt_template: template.template
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      prompt_template: agent.prompt_template,
      voice_id: agent.voice_id,
      temperature: agent.temperature || 0.7,
      azure_model: agent.azure_model || "gpt-4o-realtime-preview",
      voice_temperature: agent.voice_temperature || 0.7,
      speaking_rate: agent.speaking_rate || 1.05,
      audio_enhancement: agent.audio_enhancement ?? true
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setSelectedTemplate("");
    setEditingAgent(null);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Agent Studio</h1>
          <p className="text-gray-600 text-lg">Create, preview, and manage AI debt collection agents for any industry</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New AI Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Existing Agents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Your AI Agents
              </CardTitle>
              <CardDescription>
                Manage your existing AI collection agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAgents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : !Array.isArray(agents) || agents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No AI agents created yet</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create your first agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{agent.name}</h3>
                            <Badge variant={agent.is_active ? "default" : "secondary"}>
                              {agent.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Voice: {Array.isArray(voices) ? voices.find(v => v.voice_id === agent.voice_id)?.name || "Unknown" : "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {agent.prompt_template.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form */}
        <div className="space-y-6">
          {showCreateForm && (
            <Card className="shadow-xl border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {editingAgent ? "Edit Agent" : "Create New Agent"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Professional Collector"
                    disabled={editingAgent !== null}
                  />
                </div>
                {/* Voice Selection with Preview */}
                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.voice_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, voice_id: value }))}
                      disabled={editingAgent !== null}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(voices) && voices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} ({voice.gender}, {voice.provider})
                          </SelectItem>
                        ))}
                        {(!Array.isArray(voices) || voices.length === 0) && (
                          <SelectItem value="default" disabled>
                            No voices available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {formData.voice_id && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={`ml-2 ${voicePreviewing === formData.voice_id ? "animate-pulse" : ""}`}
                        onClick={() => {
                          const v = voices.find(v => v.voice_id === formData.voice_id);
                          if (v) handleVoicePreview(v);
                        }}
                        disabled={
                          !voices.find(v => v.voice_id === formData.voice_id)?.sample_url ||
                          !/\.(mp3|wav|ogg)$/i.test(voices.find(v => v.voice_id === formData.voice_id)?.sample_url || "")
                        }
                        title="Preview Voice"
                      >
                        <Volume2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  {formData.voice_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      {voices.find(v => v.voice_id === formData.voice_id)?.language} • {voices.find(v => v.voice_id === formData.voice_id)?.provider}
                    </p>
                  )}
                </div>
                {/* Temperature */}
                <div>
                  <Label htmlFor="temperature">Creativity (Temperature)</Label>
                  <input
                    id="temperature"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={formData.temperature}
                    onChange={e => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>
                {/* Azure Model */}
                <div>
                  <Label htmlFor="azure_model">Azure Model</Label>
                  <Input
                    id="azure_model"
                    value={formData.azure_model}
                    onChange={e => setFormData(prev => ({ ...prev, azure_model: e.target.value }))}
                    placeholder="e.g., gpt-4o-realtime-preview"
                  />
                </div>
                {/* Voice Temperature */}
                <div>
                  <Label htmlFor="voice_temperature">Voice Temperature</Label>
                  <input
                    id="voice_temperature"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={formData.voice_temperature}
                    onChange={e => setFormData(prev => ({ ...prev, voice_temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Stable</span>
                    <span>Expressive</span>
                  </div>
                </div>
                {/* Speaking Rate */}
                <div>
                  <Label htmlFor="speaking_rate">Speaking Rate</Label>
                  <input
                    id="speaking_rate"
                    type="number"
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={formData.speaking_rate}
                    onChange={e => setFormData(prev => ({ ...prev, speaking_rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
                {/* Audio Enhancement */}
                <div className="flex items-center gap-2">
                  <input
                    id="audio_enhancement"
                    type="checkbox"
                    checked={formData.audio_enhancement}
                    onChange={e => setFormData(prev => ({ ...prev, audio_enhancement: e.target.checked }))}
                  />
                  <Label htmlFor="audio_enhancement">Audio Enhancement</Label>
                </div>
                {/* Template Selection */}
                <div>
                  <Label htmlFor="template">Prompt Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a template or write your own custom prompt below.
                  </p>
                </div>
                {/* Prompt Textarea */}
                <div>
                  <Label htmlFor="prompt">Custom Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt_template: e.target.value }))}
                    placeholder="Enter your custom prompt or select a template above..."
                    rows={8}
                  />
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={editingAgent ? handleUpdateAgent : handleCreateAgent}
                    disabled={creatingAgent}
                    className="flex-1"
                  >
                    {creatingAgent ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingAgent ? "Update Agent" : "Create Agent"}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Library */}
          <Card>
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Pre-built prompts for different industries and collection styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptTemplates.map((template) => (
                  <div key={template.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
