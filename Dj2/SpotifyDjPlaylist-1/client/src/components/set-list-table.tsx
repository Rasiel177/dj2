import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontalIcon } from "lucide-react";
import { TrackAnalysis } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface SetListTableProps {
  tracks: TrackAnalysis[];
  activeTrackIndex: number;
  onTrackSelect: (index: number) => void;
}

export default function SetListTable({ tracks, activeTrackIndex, onTrackSelect }: SetListTableProps) {
  const { t } = useLanguage();
  
  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">{t("set_list.no_tracks")}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
      <Table>
        <TableHeader className="bg-gray-900">
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>{t("set_list.track")}</TableHead>
            <TableHead>BPM</TableHead>
            <TableHead>{t("set_list.key")}</TableHead>
            <TableHead>{t("set_list.energy")}</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-700">
          {tracks.map((track, index) => (
            <TableRow 
              key={track.id} 
              className={`hover:bg-gray-750 transition-colors cursor-pointer ${index === activeTrackIndex ? 'active-track' : ''}`}
              onClick={() => onTrackSelect(index)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <img 
                    className="h-10 w-10 rounded mr-3" 
                    src={track.albumCover || "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"} 
                    alt={track.name} 
                  />
                  <div>
                    <div className="font-medium">{track.name}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{Math.round(track.bpm)}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={`px-2 py-1 ${track.camelotKey.endsWith('A') ? 
                    'bg-djino-purple bg-opacity-20 text-djino-purple-light' : 
                    'bg-djino-cyan bg-opacity-20 text-djino-cyan-light'}`}
                >
                  {track.camelotKey}
                </Badge>
              </TableCell>
              <TableCell>
                <Progress 
                  value={track.energy * 100} 
                  className="h-2 rounded-full" 
                  indicatorclassname="bg-djino-cyan rounded-full"
                />
              </TableCell>
              <TableCell>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontalIcon className="h-5 w-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
