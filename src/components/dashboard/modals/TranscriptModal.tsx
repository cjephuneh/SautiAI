import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { callsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Download, Mail } from "lucide-react";

interface TranscriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callId: number | null;
}

interface TranscriptData {
  transcript: string;
  summary: string;
  sentiment: string;
  confidence_score: number;
  recording_url?: string;
  call_details?: any;
}

export const TranscriptModal = ({ open, onOpenChange, callId }: TranscriptModalProps) => {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && callId) {
      fetchTranscript();
    }
  }, [open, callId]);

  const fetchTranscript = async () => {
    if (!callId) return;
    
    setLoading(true);
    try {
      const data = await callsApi.getCallTranscript(callId);
      setTranscript(data);
    } catch (error) {
      console.error("Failed to fetch transcript:", error);
      toast({
        title: "Error",
        description: "Failed to load transcript.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatConfidenceScore = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Call Transcript</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading transcript...</span>
          </div>
        ) : transcript ? (
          <div className="space-y-6">
            {/* Call Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={`${getSentimentColor(transcript.sentiment)} border`}>
                  {transcript.sentiment?.toUpperCase() || 'UNKNOWN'}
                </Badge>
                <span className="text-sm text-gray-600">
                  Confidence: {formatConfidenceScore(transcript.confidence_score || 0)}
                </span>
              </div>

              {transcript.summary && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Call Summary</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {transcript.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Full Transcript */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Full Transcript</h4>
              <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                {transcript.transcript ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {transcript.transcript}
                  </pre>
                ) : (
                  <p className="text-gray-500 italic">No transcript available</p>
                )}
              </div>
            </div>

            {/* Audio Recording */}
            {transcript.recording_url && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Audio Recording</h4>
                <audio controls className="w-full">
                  <source src={transcript.recording_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Transcript
                </Button>
              </div>
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No transcript data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
