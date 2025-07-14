import { useState, useEffect } from "react";
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
  }
];

export const AIAssistant = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    prompt_template: "",
    voice_id: "",
    temperature: 0.7
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
    fetchVoices();
  }, []);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const data = await agentsApi.getAgents();
      console.log("Fetched agents data:", data); // Debug log
      
      // Ensure we always set an array
      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        console.warn("Agents data is not an array:", data);
        setAgents([]);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      setAgents([]); // Ensure we set empty array on error
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
      console.log("Fetched voices data:", data); // Debug log
      
      // Ensure we always set an array
      if (Array.isArray(data)) {
        setVoices(data);
      } else {
        console.warn("Voices data is not an array:", data);
        setVoices([]);
      }
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      setVoices([]); // Ensure we set empty array on error
      toast({
        title: "Error",
        description: "Failed to load voice options. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingVoices(false);
    }
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
      const data = await agentsApi.createAgent(formData);
      // Ensure agents is always an array before spreading
      setAgents(prev => Array.isArray(prev) ? [...prev, data] : [data]);
      setFormData({ name: "", prompt_template: "", voice_id: "", temperature: 0.7 });
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
      // Ensure agents is always an array before filtering
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
      // Ensure agents is always an array before mapping
      setAgents(prev => Array.isArray(prev) ? prev.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, prompt_template: formData.prompt_template }
          : agent
      ) : []);
      setEditingAgent(null);
      setFormData({ name: "", prompt_template: "", voice_id: "", temperature: 0.7 });
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
      temperature: agent.temperature || 0.7
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", prompt_template: "", voice_id: "", temperature: 0.7 });
    setSelectedTemplate("");
    setEditingAgent(null);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant Management</h1>
          <p className="text-gray-600">Create and manage your AI debt collection agents</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create AI Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {editingAgent ? "Edit Agent" : "Create New Agent"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div>
                  <Label htmlFor="voice">Voice</Label>
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
                          {voice.name} ({voice.gender})
                        </SelectItem>
                      ))}
                      {(!Array.isArray(voices) || voices.length === 0) && (
                        <SelectItem value="default" disabled>
                          No voices available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template">Template</Label>
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
                </div>

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
                Pre-built prompts for different collection styles
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
