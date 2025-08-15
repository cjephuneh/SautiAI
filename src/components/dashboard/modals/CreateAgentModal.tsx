import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { agentsApi } from "@/services/api";
import { Loader2 } from "lucide-react";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  voices: any[];
}

interface AgentData {
  name: string;
  prompt_template: string;
  voice_id: string;
  temperature: number;
}

export const CreateAgentModal = ({ open, onOpenChange, onSuccess, voices }: CreateAgentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AgentData>({
    name: "",
    prompt_template: "",
    voice_id: "",
    temperature: 0.8
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await agentsApi.createAgent(formData);
      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        prompt_template: "",
        voice_id: "",
        temperature: 0.8
      });
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AgentData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Friendly Collector"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice *</Label>
            <Select value={formData.voice_id} onValueChange={(value) => handleInputChange("voice_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.voice_id} value={voice.voice_id}>
                    {voice.name} ({voice.gender}, {voice.provider})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Select 
              value={formData.temperature.toString()} 
              onValueChange={(value) => handleInputChange("temperature", parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.3">0.3 (Conservative)</SelectItem>
                <SelectItem value="0.5">0.5 (Balanced)</SelectItem>
                <SelectItem value="0.8">0.8 (Creative)</SelectItem>
                <SelectItem value="1.0">1.0 (Very Creative)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt_template}
              onChange={(e) => handleInputChange("prompt_template", e.target.value)}
              placeholder="You are a friendly Call Centre agent. Your goal is to help customers pay their debts while maintaining a positive relationship..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.voice_id || !formData.prompt_template}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
