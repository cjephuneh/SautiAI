import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { agentsApi } from "@/services/api";
import { Loader2, Plus } from "lucide-react";

interface SelectAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentSelected: (agentId: number) => void;
  allowRememberChoice?: boolean;
  defaultAgentId?: number | null;
}

interface AvailableAgent {
  id: number;
  name: string;
  is_configured?: boolean;
  voice_info?: {
    voice_id?: string;
    name?: string;
    language?: string;
    gender?: string;
  };
}

export const SelectAgentModal = ({ open, onOpenChange, onAgentSelected, allowRememberChoice = false, defaultAgentId = null }: SelectAgentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<AvailableAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    agentsApi.getAvailableAgentsForCalls()
      .then((list) => setAgents(Array.isArray(list) ? list : []))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open && defaultAgentId && !selectedAgentId) {
      setSelectedAgentId(String(defaultAgentId));
    }
  }, [open, defaultAgentId, selectedAgentId]);

  const handleConfirm = () => {
    if (!selectedAgentId) return;
    const id = Number(selectedAgentId);
    if (allowRememberChoice && remember) {
      localStorage.setItem('default_agent_id', String(id));
    }
    onAgentSelected(id);
    onOpenChange(false);
  };

  const handleClearDefault = () => {
    localStorage.removeItem('default_agent_id');
    setRemember(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Select AI Agent</DialogTitle>
          <DialogDescription>
            Choose a configured agent to place the outbound call.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : agents.length > 0 ? (
          <div className="space-y-4">
            {defaultAgentId && (
              <div className="p-2 rounded-md bg-blue-50 text-sm text-blue-800 border border-blue-200 flex items-center justify-between">
                <span>
                  Default agent: <strong>{agents.find(a => a.id === defaultAgentId)?.name || `#${defaultAgentId}`}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={handleClearDefault}>Clear default</Button>
              </div>
            )}
            <div>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                      {agent.voice_info?.name ? ` • ${agent.voice_info.name}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-2">
              {allowRememberChoice && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember this agent for future calls
                </label>
              )}
              <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={!selectedAgentId}>
                Continue
              </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-yellow-50 text-sm text-yellow-800 border border-yellow-200">
              No configured agents are available. Create one to proceed.
            </div>
            <div className="flex justify-end">
              <a href="#/dashboard/ai-assistant" className="inline-flex items-center">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create Agent
                </Button>
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectAgentModal;


