import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SpotifyPlaylistInfo } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface PlaylistStatsProps {
  averageBpm: number;
  averageEnergy: number;
  dominantKeys: string[];
}

interface PlaylistInfoCardProps {
  playlist: SpotifyPlaylistInfo;
  stats: PlaylistStatsProps;
}

export default function PlaylistInfoCard({ playlist, stats }: PlaylistInfoCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="col-span-1">
        <div className="bg-gray-800 rounded-lg p-4 flex items-center">
          <img 
            src={playlist.coverImage || "https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"}
            alt="Playlist cover" 
            className="w-24 h-24 rounded mr-4 object-cover"
          />
          <div>
            <h3 className="font-medium text-lg">{playlist.name}</h3>
            <p className="text-gray-400 text-sm mb-2">
              {playlist.owner} · {playlist.trackCount} {t("common.tracks")}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1 bg-gray-700 rounded text-xs">
                {t("playlist.playlist")}
              </Badge>
              <Badge variant="secondary" className="px-2 py-1 bg-gray-700 rounded text-xs">
                {typeof stats.averageBpm === 'number' ? `${Math.floor(stats.averageBpm - 5)}-${Math.ceil(stats.averageBpm + 5)}` : '120-130'} BPM
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("stats.avg_bpm")}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium">{typeof stats.averageBpm === 'number' ? Math.round(stats.averageBpm) : 120}</span>
              <span className="text-xs text-gray-400 mb-1">BPM</span>
            </div>
            <Progress 
              value={(typeof stats.averageBpm === 'number' ? stats.averageBpm : 120) / 180 * 100} 
              className="h-1 mt-2" 
              indicatorclassname="bg-djino-purple"
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("stats.avg_energy")}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium">{typeof stats.averageEnergy === 'number' ? stats.averageEnergy.toFixed(2) : '0.00'}</span>
              <span className="text-xs text-gray-400 mb-1">/1.0</span>
            </div>
            <Progress 
              value={(typeof stats.averageEnergy === 'number' ? stats.averageEnergy : 0) * 100} 
              className="h-1 mt-2" 
              indicatorclassname="bg-djino-cyan"
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("stats.dominant_key")}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium">
                {stats.dominantKeys && stats.dominantKeys.length > 0 ? stats.dominantKeys.slice(0, 2).join(' / ') : 'C / Am'}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {stats.dominantKeys && stats.dominantKeys.length > 0 ? 
                stats.dominantKeys.map((key, i) => (
                  <Badge 
                    key={i}
                    variant="outline"
                    className={`px-2 py-1 ${key.endsWith('A') ? 
                      'bg-djino-purple bg-opacity-20 text-djino-purple-light' : 
                      'bg-djino-cyan bg-opacity-20 text-djino-cyan-light'}`}
                  >
                    {key.endsWith('A') ? 'minor' : 'major'}
                  </Badge>
                )) : 
                <>
                  <Badge variant="outline" className="px-2 py-1 bg-djino-cyan bg-opacity-20 text-djino-cyan-light">major</Badge>
                  <Badge variant="outline" className="px-2 py-1 bg-djino-purple bg-opacity-20 text-djino-purple-light">minor</Badge>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
