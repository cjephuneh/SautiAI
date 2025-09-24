import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Send, X, Loader2, Volume2, VolumeX, StopCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import io from "socket.io-client";

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
    // If it's already an Azure voice name, return as is
    if (voiceId.includes('-') && voiceId.includes('Neural')) {
      return voiceId;
    }
    
    const voiceMapping: { [key: string]: string } = {
      'alloy': 'sw-KE-ZuriNeural',      // Female Swahili (Kenya)
      'echo': 'sw-KE-RafikiNeural',     // Male Swahili (Kenya)
      'shimmer': 'en-KE-AsiliaNeural',  // Female English (Kenya)
      'sage': 'en-KE-ChilembaNeural',   // Male English (Kenya)
      'coral': 'sw-TZ-RehemaNeural',    // Female Swahili (Tanzania)
      'verse': 'sw-TZ-DaudiNeural',     // Male Swahili (Tanzania)
      'ash': 'en-TZ-ElimuNeural',       // Male English (Tanzania)
    };
    
    return voiceMapping[voiceId] || 'sw-KE-ZuriNeural'; // Default to Zuri
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
        // Connect to the actual playground SocketIO server
        const socket = io('http://localhost:5004', {
          transports: ['polling', 'websocket'],
          timeout: 20000,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
          forceNew: true, // Force new connection
          upgrade: true, // Allow transport upgrades
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
          console.log('❌ Disconnected from playground');
          setIsConnected(false);
          toast({
            title: "Disconnected",
            description: "Lost connection to voice playground",
            variant: "destructive",
          });
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
          console.log('❌ Disconnected from playground:', reason);
          setIsConnected(false);
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            toast({
              title: "Server Disconnected",
              description: "Voice playground server disconnected. Attempting to reconnect...",
            });
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
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check microphone permissions.",
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