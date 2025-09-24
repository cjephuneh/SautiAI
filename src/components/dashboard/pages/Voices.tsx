import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Volume2, Search, Filter } from "lucide-react";
import { voicesApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { VoicePlayground } from "./VoicePlayground";

interface Voice {
  voice_id: string;
  name: string;
  provider: string;
  gender?: string;
  language?: string;
  sample_url?: string;
  description?: string;
}

function useVoicePreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (url?: string) => {
    if (!url) {
      toast({
        title: "No audio sample",
        description: "This voice doesn't have a preview sample available.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audio.onerror = () => {
        toast({
          title: "Playback error",
          description: "Unable to play this audio sample.",
          variant: "destructive",
        });
        setIsPlaying(false);
      };
      audio.onended = () => {
        setIsPlaying(false);
      };
      audio.onpause = () => {
        setIsPlaying(false);
      };
      audioRef.current = audio;
      setIsPlaying(true);
      audio.play().catch(() => {
        toast({
          title: "Playback error",
          description: "Unable to play this audio sample.",
          variant: "destructive",
        });
        setIsPlaying(false);
      });
    } catch (e) {
      toast({
        title: "Playback error",
        description: "Unable to play this audio sample.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  return { play, stop, isPlaying };
}

export const Voices = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("voicelab");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const { play, stop, isPlaying } = useVoicePreview();

  const providers = ["voicelab"];
  const genders = ["all", "male", "female", "neutral"];

  const handleTestVoice = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    setIsPlaygroundOpen(true);
  };

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    filterVoices();
  }, [voices, searchTerm, selectedProvider, selectedGender]);

  const fetchVoices = async () => {
    setLoading(true);
    try {
      const data = await voicesApi.getVoices();
      const voicesArray = Array.isArray(data) ? data : (data.voices || []);
      setVoices(voicesArray);
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      toast({
        title: "Error",
        description: "Failed to load voices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVoices = () => {
    let filtered = voices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(voice =>
        voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.language?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by provider - only show VoiceLab voices
    filtered = filtered.filter(voice => voice.provider.toLowerCase() === "voicelab");

    // Filter by gender
    if (selectedGender !== "all") {
      filtered = filtered.filter(voice => voice.gender === selectedGender);
    }

    setFilteredVoices(filtered);
  };

  const handleVoicePreview = (voice: Voice) => {
    if (playingVoiceId === voice.voice_id && isPlaying) {
      stop();
      setPlayingVoiceId(null);
    } else {
      stop(); // Stop any currently playing voice
      setPlayingVoiceId(voice.voice_id);
      play(voice.sample_url);
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'elevenlabs': return 'bg-purple-100 text-purple-800';
      case 'azure': return 'bg-blue-100 text-blue-800';
      case 'google': return 'bg-red-100 text-red-800';
      case 'voicelab': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderColor = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voices</h1>
            <p className="text-gray-600 mt-2">Explore and test voices</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voices</h1>
          <p className="text-gray-600 mt-2">Explore and test voices</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Clone voices
          </Button>
          <Button variant="outline" size="sm">
            Import voices
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search voice, accent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">VoiceLab Only</span>
              </div>
            </div>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {genders.slice(1).map(gender => (
                  <SelectItem key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((voice) => (
          <Card key={voice.voice_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {voice.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {voice.description || `${voice.gender || 'Unknown'} voice`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => handleVoicePreview(voice)}
                >
                  {playingVoiceId === voice.voice_id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getProviderColor(voice.provider)}>
                    {voice.provider}
                  </Badge>
                  {voice.gender && (
                    <Badge className={getGenderColor(voice.gender)}>
                      {voice.gender}
                    </Badge>
                  )}
                  {voice.language && (
                    <Badge variant="outline">
                      {voice.language}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Voice ID:</strong> {voice.voice_id}
                  </div>
                  {voice.sample_url && (
                    <div className="text-sm text-gray-600">
                      <strong>Sample:</strong> Available
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Input
                    placeholder={`This is a sample voice from Sautiai happy to help you. ${voice.name}`}
                    className="text-sm"
                    defaultValue={`This is a sample voice from Sautiai happy to help you. ${voice.name}`}
                  />
                </div>

                <div className="pt-2">
                  <Dialog open={isPlaygroundOpen && selectedVoiceId === voice.voice_id} onOpenChange={setIsPlaygroundOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestVoice(voice.voice_id)}
                        className="w-full"
                      >
                        🎙️ Test Voice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                      <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>Voice Playground - {voice.name}</DialogTitle>
                        <DialogDescription>
                          Interactive voice testing environment. Test voice interactions, record audio, and chat with the AI assistant.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-hidden">
                        <VoicePlayground
                          voiceId={selectedVoiceId}
                          voiceName={voice.name}
                          onClose={() => setIsPlaygroundOpen(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVoices.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No voices found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedGender !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No VoiceLab voices are available at the moment."}
            </p>
            {(searchTerm || selectedGender !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGender("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
