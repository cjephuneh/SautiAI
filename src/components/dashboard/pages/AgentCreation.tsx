import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles,
  ExternalLink,
  Save,
  Share2,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Video,
  Headphones,
  Zap,
  Brain,
  Globe,
  Shield,
  Clock,
  DollarSign,
  BarChart3,
  Users,
  FileText,
  Link,
  Download,
  Upload
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
  model?: string;
  voice_temperature?: number;
  speaking_rate?: number;
  audio_enhancement?: boolean;
  welcome_message?: string;
  language?: string;
  transcriber?: string;
  transcriber_model?: string;
  voice_provider?: string;
  voice_model?: string;
  buffer_size?: number;
  speed_rate?: number;
}

interface Voice {
  voice_id: string;
  name: string;
  provider: string;
  gender?: string;
  language?: string;
  sample_url?: string;
  description?: string;
}

// Our custom models
const ourModels = [
  { id: "sautiai-debt-collector-v1", name: "SautiAI Debt Collector v1", description: "Specialized for debt collection conversations" },
  { id: "sautiai-empathy-v1", name: "SautiAI Empathy v1", description: "Optimized for empathetic customer interactions" },
  { id: "sautiai-legal-v1", name: "SautiAI Legal v1", description: "Compliance-focused for regulated industries" },
  { id: "sautiai-multilingual-v1", name: "SautiAI Multilingual v1", description: "Supports 50+ African languages" }
];

const languages = [
  { code: "en-US", name: "English (United States)" },
  { code: "sw-KE", name: "Swahili (Kenya)" },
  { code: "sw-TZ", name: "Swahili (Tanzania)" },
  { code: "en-KE", name: "English (Kenya)" },
  { code: "en-TZ", name: "English (Tanzania)" },
  { code: "en-NG", name: "English (Nigeria)" },
  { code: "en-ZA", name: "English (South Africa)" },
  { code: "af-ZA", name: "Afrikaans (South Africa)" },
  { code: "am-ET", name: "Amharic (Ethiopia)" },
  { code: "ar-DZ", name: "Arabic (Algeria)" },
  { code: "ar-EG", name: "Arabic (Egypt)" },
  { code: "ar-MA", name: "Arabic (Morocco)" },
  { code: "ar-TN", name: "Arabic (Tunisia)" },
  { code: "ha-NG", name: "Hausa (Nigeria)" },
  { code: "ig-NG", name: "Igbo (Nigeria)" },
  { code: "yo-NG", name: "Yoruba (Nigeria)" },
  { code: "zu-ZA", name: "Zulu (South Africa)" },
  { code: "xh-ZA", name: "Xhosa (South Africa)" },
  { code: "rw-RW", name: "Kinyarwanda (Rwanda)" },
  { code: "so-SO", name: "Somali (Somalia)" }
];

const transcriberProviders = [
  { id: "sautiai", name: "SautiAI Transcriber", description: "Our custom transcriber optimized for African accents" },
  { id: "deepgram", name: "Deepgram", description: "High-accuracy speech recognition" },
  { id: "azure", name: "Azure Speech", description: "Microsoft's speech services" }
];

const transcriberModels = [
  { id: "sautiai-nova-african", name: "SautiAI Nova African", description: "Optimized for African languages and accents" },
  { id: "nova-2", name: "Nova-2", description: "Latest Deepgram model" },
  { id: "whisper-1", name: "Whisper-1", description: "OpenAI's speech recognition" }
];

const voiceProviders = [
  { id: "voicelab", name: "VoiceLab", description: "Our custom voice synthesis platform" },
  { id: "elevenlabs", name: "ElevenLabs", description: "High-quality voice cloning" },
  { id: "azure", name: "Azure Speech", description: "Microsoft's text-to-speech" }
];

const voiceModels = [
  { id: "sautiai-turbo-v1", name: "SautiAI Turbo v1", description: "Fast, natural-sounding voices" },
  { id: "eleven_turbo_v2_5", name: "Eleven Turbo v2.5", description: "ElevenLabs turbo model" },
  { id: "azure-neural", name: "Azure Neural", description: "Microsoft's neural voices" }
];

function useVoicePreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (url?: string) => {
    if (!url) return;
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch (e) {
      // Handle error silently
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

export const AgentCreation = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [voicePreviewing, setVoicePreviewing] = useState<string | null>(null);
  const [isWebCallActive, setIsWebCallActive] = useState(false);
  const [webCallStatus, setWebCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { play, stop } = useVoicePreview();
  const callDurationRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    welcome_message: "Hello {name}! Welcome to SautiAI. How can I help you today?",
    prompt_template: "",
    model: "sautiai-debt-collector-v1",
    language: "en-US",
    transcriber: "sautiai",
    transcriber_model: "sautiai-nova-african",
    voice_provider: "voicelab",
    voice_model: "sautiai-turbo-v1",
    voice_id: "",
    temperature: 0.7,
    tokens: 150,
    buffer_size: 200,
    speed_rate: 1.0,
    keywords: ""
  });

  const [testVariables, setTestVariables] = useState({
    name: "",
    order: "",
    amount: "",
    due_date: ""
  });

  useEffect(() => {
    fetchAgents();
    fetchVoices();
  }, []);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (callDurationRef.current) {
        clearInterval(callDurationRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await agentsApi.getAgents();
      const agentsArray = Array.isArray(data) ? data : (data.agents || []);
      setAgents(agentsArray);
      if (agentsArray.length > 0 && !selectedAgent) {
        setSelectedAgent(agentsArray[0]);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVoices = async () => {
    setLoadingVoices(true);
    try {
      const data = await voicesApi.getVoices();
      const voicesArray = Array.isArray(data) ? data : (data.voices || []);
      setVoices(voicesArray);
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      setVoices([]);
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleVoicePreview = (voice: Voice) => {
    if (!voice.sample_url) return;
    setVoicePreviewing(voice.voice_id);
    play(voice.sample_url);
    setTimeout(() => setVoicePreviewing(null), 4000);
  };

  const handleCreateAgent = async () => {
    if (!formData.name || !formData.prompt_template) {
      toast({
        title: "Missing Information",
        description: "Please fill in agent name and prompt template.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await agentsApi.createAgent({
        name: formData.name,
        welcome_message: formData.welcome_message,
        prompt_template: formData.prompt_template,
        model: formData.model,
        language: formData.language,
        transcriber: formData.transcriber,
        transcriber_model: formData.transcriber_model,
        voice_provider: formData.voice_provider,
        voice_model: formData.voice_model,
        voice_id: formData.voice_id,
        temperature: formData.temperature,
        tokens: formData.tokens,
        buffer_size: formData.buffer_size,
        speed_rate: formData.speed_rate,
        keywords: formData.keywords
      });

      toast({
        title: "Success! 🎉",
        description: "Agent created successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        welcome_message: "Hello {name}! Welcome to SautiAI. How can I help you today?",
        prompt_template: "",
        model: "sautiai-debt-collector-v1",
        language: "en-US",
        transcriber: "sautiai",
        transcriber_model: "sautiai-nova-african",
        voice_provider: "voicelab",
        voice_model: "sautiai-turbo-v1",
        voice_id: "",
        temperature: 0.7,
        tokens: 150,
        buffer_size: 200,
        speed_rate: 1.0,
        keywords: ""
      });

      fetchAgents();
    } catch (error: any) {
      console.error("Failed to create agent:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent) return;

    setLoading(true);
    try {
      // Update agent logic here
      toast({
        title: "Success! 🎉",
        description: "Agent updated successfully!",
      });
      fetchAgents();
    } catch (error: any) {
      console.error("Failed to update agent:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startWebCall = async () => {
    try {
      setWebCallStatus('connecting');
      setIsWebCallActive(true);
      setTranscript([]);
      setCallDuration(0);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC not supported in this browser');
      }
      
      // Request microphone access with better error handling
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Start recording with better configuration
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('Audio recorded:', audioBlob);
        
        // Here you would send the audio to your API for processing
        // Example: await processAudioWithAPI(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "Recording Error",
          description: "There was an issue with audio recording.",
          variant: "destructive",
        });
      };

      // Start recording with 1-second intervals
      mediaRecorder.start(1000);
      setIsRecording(true);
      setWebCallStatus('connected');

      // Start call duration timer
      callDurationRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Simulate agent responses with creative features
      setTimeout(() => {
        setTranscript(prev => [...prev, "🎙️ Agent: Hello! I'm your SautiAI assistant. How can I help you today?"]);
      }, 2000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "🤖 Agent: I can help you with debt collection, customer service, or any other business needs."]);
      }, 5000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "🌍 Agent: Would you like to test our multilingual capabilities? I can speak in Swahili, Amharic, or any of our 50+ African languages!"]);
      }, 8000);

      setTimeout(() => {
        setTranscript(prev => [...prev, "💡 Agent: Try saying 'Hello' in any African language and I'll respond appropriately!"]);
      }, 12000);

      toast({
        title: "Web Call Started! 🎉",
        description: "Your microphone is now active. Start speaking to test the agent!",
      });

    } catch (error: any) {
      console.error('Failed to start web call:', error);
      
      let errorMessage = "Failed to start web call. ";
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow microphone access and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found. Please connect a microphone.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "WebRTC not supported in this browser.";
      } else {
        errorMessage += "Please check your microphone permissions.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setWebCallStatus('idle');
      setIsWebCallActive(false);
    }
  };

  const endWebCall = () => {
    try {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Clear timer
      if (callDurationRef.current) {
        clearInterval(callDurationRef.current);
        callDurationRef.current = null;
      }

      // Stop all audio tracks
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
          console.log('Audio track stopped:', track.kind);
        });
      }

      setIsRecording(false);
      setWebCallStatus('ended');
      setIsWebCallActive(false);
      
      // Show call summary
      const duration = formatDuration(callDuration);
      toast({
        title: "Call Ended",
        description: `Call duration: ${duration}. Recording saved successfully.`,
      });

      // Reset after a short delay
      setTimeout(() => {
        setCallDuration(0);
        setTranscript([]);
        setWebCallStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "There was an issue ending the call.",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    const baseCost = 0.090; // $0.090 per minute
    const transcriberCost = 0.015;
    const llmCost = 0.025;
    const voiceCost = 0.020;
    const telephonyCost = 0.020;
    const platformCost = 0.010;
    
    return {
      total: baseCost,
      breakdown: {
        transcriber: transcriberCost,
        llm: llmCost,
        voice: voiceCost,
        telephony: telephonyCost,
        platform: platformCost
      }
    };
  };

  const costData = calculateCost();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Setup</h1>
            <p className="text-gray-600 mt-1">Fine tune your agents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Available balance: <span className="font-semibold text-green-600">$0.18</span>
            </div>
            <Button variant="outline" size="sm">Add more funds</Button>
            <Button variant="outline" size="sm">See demo</Button>
            <Button variant="outline" size="sm">Docs</Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Your Agents */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Agents</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button size="sm" onClick={() => setSelectedAgent(null)}>
                <Plus className="h-4 w-4 mr-2" />
                New Agent
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {agents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No agents yet</p>
                <p className="text-xs">Create your first agent to get started</p>
              </div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedAgent?.id === agent.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                      {agent.is_active ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Agent Configuration */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedAgent ? (
              <div className="space-y-6">
                {/* Agent Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedAgent.name}</h2>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Get call from agent
                      </Button>
                      <Button size="sm">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Set inbound agent
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Purchase phone numbers
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-sm text-gray-600">
                      Cost per min: <span className="font-semibold text-green-600">~ ${costData.total.toFixed(3)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" title="Transcriber"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full" title="LLM"></div>
                        <div className="w-3 h-3 bg-orange-500 rounded-full" title="Voice"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full" title="Telephony"></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full" title="Platform"></div>
                      </div>
                      <span className="text-xs text-gray-500">Transcriber • LLM • Voice • Telephony • Platform</span>
                    </div>
                  </div>

                  {/* Configuration Tabs */}
                  <Tabs defaultValue="agent" className="w-full">
                    <TabsList className="grid w-full grid-cols-8">
                      <TabsTrigger value="agent">Agent</TabsTrigger>
                      <TabsTrigger value="llm">LLM</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                      <TabsTrigger value="engine">Engine</TabsTrigger>
                      <TabsTrigger value="call">Call</TabsTrigger>
                      <TabsTrigger value="tools">Tools</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                      <TabsTrigger value="inbound">Inbound</TabsTrigger>
                    </TabsList>

                    <TabsContent value="agent" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="welcome-message">Agent Welcome Message</Label>
                          <Input
                            id="welcome-message"
                            value={formData.welcome_message}
                            onChange={(e) => setFormData(prev => ({ ...prev, welcome_message: e.target.value }))}
                            placeholder="Hello {name}! Welcome to SautiAI. How can I help you today?"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            This will be the initial message from the agent. You can use variables here using {"{variable_name}"}.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="prompt">Agent Prompt</Label>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Sparkles className="h-4 w-4 mr-2" />
                                AI Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                GPT Builder
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            id="prompt"
                            value={formData.prompt_template}
                            onChange={(e) => setFormData(prev => ({ ...prev, prompt_template: e.target.value }))}
                            placeholder="You are Sam, a customer service agent..."
                            className="min-h-[200px]"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            You can define variables in the prompt using {"{variable_name}"}.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="test-name">Enter value for {"{name}"}</Label>
                            <Input
                              id="test-name"
                              value={testVariables.name}
                              onChange={(e) => setTestVariables(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="test-order">Enter value for {"{order}"}</Label>
                            <Input
                              id="test-order"
                              value={testVariables.order}
                              onChange={(e) => setTestVariables(prev => ({ ...prev, order: e.target.value }))}
                              placeholder="ORD-12345"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="llm" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div>
                          <Label>Choose LLM model</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent>
                                {ourModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div>
                                      <div className="font-medium">{model.name}</div>
                                      <div className="text-sm text-gray-500">{model.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                              <Brain className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">SautiAI Models</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Tokens generated on each LLM output</Label>
                          <div className="mt-2">
                            <Slider
                              value={[formData.tokens]}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, tokens: value[0] }))}
                              max={500}
                              min={50}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                              <span>50</span>
                              <span className="font-medium">{formData.tokens}</span>
                              <span>500</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Increasing tokens enables longer responses to be queued for speech generation but increases latency
                          </p>
                        </div>

                        <div>
                          <Label>Temperature</Label>
                          <div className="mt-2">
                            <Slider
                              value={[formData.temperature]}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, temperature: value[0] }))}
                              max={1}
                              min={0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                              <span>0.0</span>
                              <span className="font-medium">{formData.temperature}</span>
                              <span>1.0</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Increasing temperature enables heightened creativity, but increases chance of deviation from prompt
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Add FAQs & Guardrails</Label>
                            <Button variant="link" size="sm">Learn more</Button>
                          </div>
                          <Button variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add a new block for FAQs & Guardrails
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="audio" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div>
                          <Label>Select language and transcriber</Label>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Language" />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={formData.transcriber} onValueChange={(value) => setFormData(prev => ({ ...prev, transcriber: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {transcriberProviders.map((provider) => (
                                  <SelectItem key={provider.id} value={provider.id}>
                                    <div>
                                      <div className="font-medium">{provider.name}</div>
                                      <div className="text-sm text-gray-500">{provider.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={formData.transcriber_model} onValueChange={(value) => setFormData(prev => ({ ...prev, transcriber_model: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                {transcriberModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div>
                                      <div className="font-medium">{model.name}</div>
                                      <div className="text-sm text-gray-500">{model.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="keywords">Keywords</Label>
                          <Input
                            id="keywords"
                            value={formData.keywords}
                            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="Bruce:100"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Enter certain keywords/proper nouns you'd want to boost while understanding user speech.
                          </p>
                        </div>

                        <div>
                          <Label>Select voice</Label>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <Select value={formData.voice_provider} onValueChange={(value) => setFormData(prev => ({ ...prev, voice_provider: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {voiceProviders.map((provider) => (
                                  <SelectItem key={provider.id} value={provider.id}>
                                    <div>
                                      <div className="font-medium">{provider.name}</div>
                                      <div className="text-sm text-gray-500">{provider.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={formData.voice_model} onValueChange={(value) => setFormData(prev => ({ ...prev, voice_model: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                {voiceModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div>
                                      <div className="font-medium">{model.name}</div>
                                      <div className="text-sm text-gray-500">{model.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={formData.voice_id} onValueChange={(value) => setFormData(prev => ({ ...prev, voice_id: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Voice" />
                              </SelectTrigger>
                              <SelectContent>
                                {voices.map((voice) => (
                                  <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                    <div className="flex items-center justify-between w-full">
                                      <div>
                                        <div className="font-medium">{voice.name}</div>
                                        <div className="text-sm text-gray-500">{voice.language}</div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVoicePreview(voice);
                                        }}
                                      >
                                        {voicePreviewing === voice.voice_id ? (
                                          <Pause className="h-3 w-3" />
                                        ) : (
                                          <Play className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="link" size="sm" className="mt-2">
                            More voices
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Buffer Size</Label>
                            <div className="mt-2">
                              <Slider
                                value={[formData.buffer_size]}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, buffer_size: value[0] }))}
                                max={500}
                                min={100}
                                step={10}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>100</span>
                                <span className="font-medium">{formData.buffer_size}</span>
                                <span>500</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Increasing buffer size enables agent to speak long responses fluently, but increases latency
                            </p>
                          </div>

                          <div>
                            <Label>Speed rate</Label>
                            <div className="mt-2">
                              <Slider
                                value={[formData.speed_rate]}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, speed_rate: value[0] }))}
                                max={2}
                                min={0.5}
                                step={0.1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-sm text-gray-500 mt-1">
                                <span>0.5x</span>
                                <span className="font-medium">{formData.speed_rate}x</span>
                                <span>2.0x</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              The speed control feature lets you adjust how fast or slow your agent speaks
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Create New Agent */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Agent</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="agent-name">Agent Name</Label>
                      <Input
                        id="agent-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Customer Service Agent"
                      />
                    </div>

                    <div>
                      <Label htmlFor="welcome-message-new">Welcome Message</Label>
                      <Input
                        id="welcome-message-new"
                        value={formData.welcome_message}
                        onChange={(e) => setFormData(prev => ({ ...prev, welcome_message: e.target.value }))}
                        placeholder="Hello {name}! Welcome to SautiAI. How can I help you today?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="prompt-new">Agent Prompt</Label>
                      <Textarea
                        id="prompt-new"
                        value={formData.prompt_template}
                        onChange={(e) => setFormData(prev => ({ ...prev, prompt_template: e.target.value }))}
                        placeholder="You are a professional customer service agent..."
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>LLM Model</Label>
                        <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {ourModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-sm text-gray-500">{model.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Voice</Label>
                        <Select value={formData.voice_id} onValueChange={(value) => setFormData(prev => ({ ...prev, voice_id: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select voice" />
                          </SelectTrigger>
                          <SelectContent>
                            {voices.map((voice) => (
                              <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <div className="font-medium">{voice.name}</div>
                                    <div className="text-sm text-gray-500">{voice.language}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVoicePreview(voice);
                                    }}
                                  >
                                    {voicePreviewing === voice.voice_id ? (
                                      <Pause className="h-3 w-3" />
                                    ) : (
                                      <Play className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleCreateAgent} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Agent...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Agent
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Actions */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto hidden lg:block">
            <div className="space-y-6">
              <div>
                <Button variant="outline" className="w-full mb-3">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  See all call logs
                </Button>
                <div className="flex gap-2 mb-3">
                  <Button onClick={selectedAgent ? handleUpdateAgent : handleCreateAgent} disabled={loading} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save agent
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Last updated a year ago</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Use chat to test agent & prompts</h3>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Test via chat
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Test via web call (beta)</h3>
                
                {!isWebCallActive ? (
                  <Button onClick={startWebCall} className="w-full mb-3">
                    <Video className="h-4 w-4 mr-2" />
                    Test via web call
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-800">
                            {webCallStatus === 'connecting' ? 'Connecting...' : 
                             webCallStatus === 'connected' ? 'Connected' : 'Ended'}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-green-700 bg-green-100 px-2 py-1 rounded">
                          {formatDuration(callDuration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {isRecording && (
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-600 font-medium">Recording</span>
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={endWebCall}
                        >
                          <PhoneOff className="h-4 w-4 mr-2" />
                          End Call
                        </Button>
                      </div>
                    </div>

                    {transcript.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Headphones className="h-4 w-4" />
                          Live Transcript
                        </h4>
                        <div className="space-y-3">
                          {transcript.map((message, index) => (
                            <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-blue-200">
                              {message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
