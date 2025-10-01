import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Send, X, Loader2, Volume2, VolumeX, StopCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";

interface VoicePlaygroundProps {
  voiceId: string;
  voiceName: string;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'audio' | 'system';
}

export const VoicePlayground = ({ voiceId, voiceName, onClose }: VoicePlaygroundProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  
  const socketRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Map VoiceLab voice IDs to Azure voice names
  const mapVoiceIdToAzure = (voiceId: string): string => {
    // If it's already an Azure voice name, validate it first
    if (voiceId.includes('-') && voiceId.includes('Neural')) {
      // Check if it's a valid Azure voice by checking if it starts with a valid language code
      const validAzureVoices = [
        'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN', 'en-IE', 'en-NZ', 'en-ZA',
        'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE', 'es-VE', 'es-UY', 'es-CL', 'es-BO', 'es-CR', 'es-EC', 'es-SV', 'es-GT', 'es-HN', 'es-NI', 'es-PA', 'es-PY', 'es-PR', 'es-DO', 'es-US',
        'fr-FR', 'fr-CA', 'fr-CH', 'fr-BE', 'fr-LU', 'fr-MC',
        'de-DE', 'de-AT', 'de-CH', 'de-LU', 'de-LI',
        'it-IT', 'it-CH',
        'pt-BR', 'pt-PT',
        'ja-JP', 'ko-KR', 'zh-CN', 'zh-TW', 'zh-HK',
        'ar-SA', 'ar-EG', 'ar-AE', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-OM', 'ar-JO', 'ar-LB', 'ar-PS', 'ar-SY', 'ar-IQ', 'ar-LY', 'ar-TN', 'ar-DZ', 'ar-MA',
        'hi-IN', 'th-TH', 'vi-VN', 'id-ID', 'ms-MY', 'tl-PH',
        'ru-RU', 'pl-PL', 'tr-TR', 'cs-CZ', 'sk-SK', 'hu-HU', 'ro-RO', 'bg-BG', 'hr-HR', 'sl-SI', 'et-EE', 'lv-LV', 'lt-LT', 'uk-UA',
        'nl-NL', 'nl-BE', 'sv-SE', 'da-DK', 'no-NO', 'fi-FI', 'is-IS', 'ga-IE', 'cy-GB', 'mt-MT',
        'he-IL', 'ur-PK', 'bn-BD', 'ta-IN', 'te-IN', 'kn-IN', 'gu-IN', 'ml-IN', 'pa-IN',
        'sw-KE', 'sw-TZ', 'am-ET', 'rw-RW', 'so-SO', 'zu-ZA', 'xh-ZA', 'af-ZA', 'ha-NG', 'ig-NG', 'yo-NG'
      ];
      
      // Check if the voice starts with a valid language code
      const isValid = validAzureVoices.some(lang => voiceId.startsWith(lang));
      if (isValid) {
        // Additional validation: check if it's a known valid Azure voice
        const knownValidVoices = [
          'en-US-AriaNeural', 'en-US-GuyNeural', 'en-US-JennyNeural', 'en-US-BrianNeural', 'en-US-AvaNeural', 'en-US-DavisNeural', 'en-US-EmmaNeural',
          'en-GB-SoniaNeural', 'en-GB-RyanNeural', 'en-GB-LibbyNeural', 'en-GB-MaisieNeural', 'en-GB-NoahNeural', 'en-GB-OliverNeural', 'en-GB-ThomasNeural',
          'en-AU-NatashaNeural', 'en-AU-WilliamNeural', 'en-AU-FreyaNeural', 'en-AU-TimNeural',
          'en-CA-ClaraNeural', 'en-CA-LiamNeural',
          'en-IN-NeerjaNeural', 'en-IN-PrabhatNeural',
          'en-IE-EmilyNeural', 'en-IE-ConnorNeural',
          'en-NZ-MollyNeural', 'en-NZ-MitchellNeural',
          'en-ZA-LeahNeural', 'en-ZA-LukeNeural'
        ];
        
        if (knownValidVoices.includes(voiceId)) {
          return voiceId;
        } else {
          console.warn(`Unknown Azure voice: ${voiceId}, falling back to default`);
          return 'en-US-AriaNeural';
        }
      } else {
        console.warn(`Invalid Azure voice: ${voiceId}, falling back to default`);
        return 'en-US-AriaNeural';
      }
    }
    
    const voiceMapping: { [key: string]: string } = {
      'alloy': 'en-US-AriaNeural',      // Female English (US)
      'echo': 'en-US-GuyNeural',        // Male English (US)
      'shimmer': 'en-US-JennyNeural',   // Female English (US)
      'sage': 'en-US-BrianNeural',      // Male English (US)
      'coral': 'en-US-AvaNeural',       // Female English (US)
      'verse': 'en-US-DavisNeural',     // Male English (US)
      'ash': 'en-US-EmmaNeural',        // Female English (US)
    };
    
    return voiceMapping[voiceId] || 'en-US-AriaNeural'; // Default to Aria
  };

  // Connect to the real playground backend
  useEffect(() => {
    // Clean up any existing connection first
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const connectToPlayground = async () => {
      try {
        // Connect to the voice playground server
        const playgroundUrl = import.meta.env.VITE_PLAYGROUND_URL || 'http://localhost:5004';
        const socket = io(playgroundUrl, {
          transports: ['polling'], // Start with polling only for stability
          timeout: 30000,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 15,
          reconnectionDelay: 3000,
          reconnectionDelayMax: 10000,
          forceNew: false, // Don't force new connection
          upgrade: false, // Disable automatic upgrade to websocket
          rememberUpgrade: false,
          randomizationFactor: 0.5,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('✅ Connected to playground');
          setIsConnected(true);
          toast({
            title: "Connected",
            description: `Connected to voice playground with ${voiceName}`,
          });
          
          // Add welcome message
          addMessage(`Hello! I'm ${voiceName}. How can I help you today?`, false, 'system');
          
          // Map the voice ID to Azure voice name
          const azureVoiceName = mapVoiceIdToAzure(voiceId);
          console.log(`🎤 Mapping voice ${voiceId} to Azure voice ${azureVoiceName}`);
          
          // Start voice session with the mapped Azure voice
          socket.emit('start_voice_session', {
            voice: azureVoiceName,
            prompt: `You are ${voiceName}, a helpful AI assistant. Respond naturally and be conversational.`
          });
        });

        socket.on('disconnect', () => {
          console.log('🔌 Voice session ended');
          setIsConnected(false);
          // Don't show error toast for normal disconnections
        });

        socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
          setIsConnected(false);
          toast({
            title: "Connection Error",
            description: "Failed to connect to voice playground. Make sure the playground server is running.",
            variant: "destructive",
          });
        });

        socket.on('disconnect', (reason) => {
          console.log('🔌 Voice session ended:', reason);
          setIsConnected(false);
          
          // Only show error toasts for unexpected disconnections
          if (reason === 'io server disconnect') {
            toast({
              title: "Session Ended",
              description: "Voice session completed successfully",
            });
          } else if (reason === 'io client disconnect') {
            // Client initiated disconnect - show success message
            console.log('✅ Voice session ended by user');
          } else if (reason === 'transport close') {
            toast({
              title: "Connection Lost",
              description: "Network connection lost. Please try again.",
              variant: "destructive",
            });
          } else {
            // Other disconnections - show neutral message
            console.log('🔌 Voice session ended');
          }
        });

        socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
          setIsConnected(false);
          toast({
            title: "Socket Error",
            description: "Connection error occurred. Attempting to reconnect...",
            variant: "destructive",
          });
        });

        socket.on('speech_detected', (data: { status: string }) => {
          console.log('🎤 Speech detected:', data);
          if (data.status === 'started') {
            addMessage("🎤 Listening...", false, 'system');
          } else if (data.status === 'stopped') {
            addMessage("✅ Speech captured, processing...", false, 'system');
          }
        });

        socket.on('user_speech', (data: { text: string }) => {
          console.log('👤 User speech:', data);
          addMessage(data.text, true, 'text');
        });

        socket.on('ai_response_text', (data: { text: string }) => {
          console.log('🤖 AI Response Text:', data);
          addMessage(data.text, false, 'text');
          setIsLoading(false);
        });

        socket.on('audio_playing', (data: { status: string }) => {
          console.log('🔊 Audio playing:', data);
          setIsPlaying(data.status === 'playing');
        });

        socket.on('response_complete', () => {
          console.log('✅ Response complete');
          setIsLoading(false);
          setIsPlaying(false);
        });

        socket.on('error', (error: any) => {
          console.error('❌ Playground error:', error);
          toast({
            title: "Playground Error",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
          setIsLoading(false);
        });

        return () => {
          if (socket) {
            console.log('🔌 Ending voice session...');
            socket.emit('stop_voice_session');
            socket.disconnect();
          }
        };
      } catch (error) {
        console.error('Error connecting to playground:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice playground",
          variant: "destructive",
        });
      }
    };

    connectToPlayground();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('stop_voice_session');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [voiceId, voiceName, reconnectTrigger]);

  const addMessage = (text: string, isUser: boolean, type: 'text' | 'audio' | 'system' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const startRecording = async () => {
    if (!socketRef.current || !isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait for connection to playground",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Send audio to playground
        socketRef.current?.emit('audio_input', {
          audio: audioBlob,
          voice_id: voiceId,
          format: 'wav'
        });
        
        addMessage("🎤 Voice message sent", true, 'audio');
        setIsLoading(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak into your microphone...",
      });
    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      let errorMessage = "Failed to start recording. ";
      if (error.name === 'NotAllowedError') {
        errorMessage += "Microphone access denied. Please allow microphone access and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found. Please connect a microphone and try again.";
      } else if (error.name === 'NotReadableError') {
        errorMessage += "Microphone is being used by another application. Please close other applications and try again.";
      } else {
        errorMessage += "Please check microphone permissions and try again.";
      }
      
      toast({
        title: "Recording Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice input...",
      });
    }
  };

  const sendTextMessage = async () => {
    if (!inputText.trim() || !isConnected) return;
    
    setIsLoading(true);
    addMessage(inputText, true, 'text');
    
    try {
      // Encode text properly for base64 (handle Unicode characters)
      const encodedText = btoa(unescape(encodeURIComponent(inputText)));
      
      // Send text as audio data to the playground
      socketRef.current?.emit('audio_data', {
        audio: encodedText
      });
      
      setInputText("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const handleReconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    // Trigger reconnection by updating a dependency
    setReconnectTrigger(prev => prev + 1);
  };

  const handleClose = () => {
    // Stop voice session and disconnect
    if (socketRef.current) {
      socketRef.current.emit('stop_voice_session');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    // Stop any recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Call the parent close function
    onClose();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">Voice Playground</span>
          <Badge variant="secondary">{voiceName}</Badge>
          {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
        </div>
        <div className="flex items-center gap-2">
          {!isConnected && (
            <Button variant="outline" size="sm" onClick={handleReconnect}>
              <Wifi className="h-4 w-4 mr-2" />
              Reconnect
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-muted/50">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Connected to Playground' : 'Disconnected'}</span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPlaying && <Volume2 className="h-4 w-4 text-blue-500" />}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[70%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.isUser ? '👤' : '🤖'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Controls */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isConnected || isLoading}
            className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (socketRef.current) {
                socketRef.current.emit('stop_voice_session');
                toast({
                  title: "Voice Session Stopped",
                  description: "Voice session has been stopped",
                });
              }
            }}
            disabled={!isConnected}
            title="Stop Voice Session"
          >
            <VolumeX className="h-5 w-5" />
          </Button>
          
          <Textarea
            placeholder="Type your message..."
            className="flex-1 resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={!isConnected || isLoading}
          />
          
          <Button 
            onClick={sendTextMessage} 
            disabled={!inputText.trim() || !isConnected || isLoading}
            size="icon"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          {isConnected ? (
            <>
              🎤 Click mic to record voice • 💬 Type and press Enter to send text • 
              🤖 Real-time AI responses from {voiceName}
            </>
          ) : (
            "Connecting to voice playground..."
          )}
        </div>
      </div>
    </div>
  );
};