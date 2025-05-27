
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Mic, 
  Globe, 
  Settings, 
  Volume2, 
  Zap,
  Key,
  Upload,
  Play,
  Pause
} from "lucide-react";

interface AIConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIConfigModal = ({ open, onOpenChange }: AIConfigModalProps) => {
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [isPlaying, setIsPlaying] = useState(false);

  const elevenLabsVoices = [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Warm and professional" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Authoritative and clear" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Friendly and approachable" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Confident and persuasive" }
  ];

  const models = [
    { id: "eleven_multilingual_v2", name: "Multilingual v2", description: "Most life-like, 29 languages" },
    { id: "eleven_turbo_v2_5", name: "Turbo v2.5", description: "High quality, low latency, 32 languages" },
    { id: "eleven_turbo_v2", name: "Turbo v2", description: "English-only, fastest response" }
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Debt Collector Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your AI agent's voice, language, and behavior settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="voice">Voice & Speech</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Voice Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {elevenLabsVoices.map((voice) => (
                    <div
                      key={voice.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedVoice === voice.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedVoice(voice.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{voice.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlaying(!isPlaying);
                          }}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{voice.description}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Custom Voice Upload</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your own voice sample (MP3, WAV)</p>
                    <Button size="sm" className="mt-2">Choose File</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speech Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Speaking Speed</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select defaultValue="eleven_multilingual_v2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-detect Language</h3>
                    <p className="text-sm text-gray-600">Automatically detect debtor's language</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Translation Support</h3>
                    <p className="text-sm text-gray-600">Translate conversations in real-time</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Personality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Tone</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly & Understanding</SelectItem>
                      <SelectItem value="professional">Professional & Direct</SelectItem>
                      <SelectItem value="firm">Firm & Assertive</SelectItem>
                      <SelectItem value="legal">Legal & Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Custom Instructions</Label>
                  <Textarea 
                    placeholder="Add specific instructions for how the AI should behave during calls..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Compliance Mode</h3>
                      <p className="text-xs text-gray-600">FDCPA/TCPA compliance</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Escalation Handling</h3>
                      <p className="text-xs text-gray-600">Transfer to human agent</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys & Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ElevenLabs API Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="sk-..." />
                    <Button variant="outline">Test</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="sk-..." />
                    <Button variant="outline">Test</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Twilio Account SID</Label>
                  <Input placeholder="AC..." />
                </div>

                <div className="space-y-2">
                  <Label>Twilio Auth Token</Label>
                  <Input type="password" placeholder="..." />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Monthly Token Limits</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Voice Calls</Label>
                      <Input type="number" defaultValue="1000" />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Text Messages</Label>
                      <Input type="number" defaultValue="5000" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
