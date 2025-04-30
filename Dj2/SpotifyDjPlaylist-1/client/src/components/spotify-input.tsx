import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface SpotifyInputProps {
  onAnalyze: (playlistUrl: string) => void;
  onLoadDemo: () => void;
  loading: boolean;
}

const isValidSpotifyUrl = (url: string): boolean => {
  // Basic validation for Spotify playlist URLs
  return url.includes('spotify.com/playlist/') || url.includes('spotify.com/album/');
};

export default function SpotifyInput({ onAnalyze, onLoadDemo, loading }: SpotifyInputProps) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidSpotifyUrl(playlistUrl)) {
      alert(t("errors.invalid_url"));
      return;
    }
    
    onAnalyze(playlistUrl);
  };
  
  return (
    <div className="bg-djino-dark-tertiary rounded-xl p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("spotify_input.label")}
          <span className="ml-1 text-xs text-djino-cyan">(Herkese açık playlistler)</span>
        </label>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-2">
            <i className="ri-spotify-fill text-green-500 text-2xl"></i>
          </div>
          <Input 
            type="text" 
            placeholder="https://open.spotify.com/playlist/37i9dQZF1DX..." 
            className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-2 focus:border-djino-purple focus:outline-none"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-djino-purple to-djino-cyan text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <i className="ri-search-line mr-2"></i>
            )}
            {t("spotify_input.analyze")}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="bg-gray-800 text-gray-300 font-medium border border-gray-700 hover:bg-gray-700 transition-colors flex items-center"
            onClick={onLoadDemo}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <i className="ri-magic-line mr-2"></i>
            )}
            {t("spotify_input.demo")}
          </Button>
        </div>
      </form>
    </div>
  );
}
