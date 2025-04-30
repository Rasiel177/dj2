import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { camelotWheelMap, getCompatibleKeys } from "@/lib/camelot-wheel";
import { TrackAnalysis } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface CamelotWheelProps {
  track?: TrackAnalysis;
}

export default function CamelotWheel({ track }: CamelotWheelProps) {
  const { t } = useLanguage();
  const [compatibleKeys, setCompatibleKeys] = useState<string[]>([]);
  const [keyName, setKeyName] = useState<string>("");
  
  useEffect(() => {
    if (track) {
      const compatKeys = getCompatibleKeys(track.camelotKey);
      setCompatibleKeys(compatKeys);
      
      // Get key name (e.g., "A minor" for "9A")
      const keyInfo = camelotWheelMap[track.camelotKey];
      setKeyName(keyInfo ? keyInfo.name : "");
    }
  }, [track]);
  
  // If no track is provided, show a placeholder
  if (!track) {
    return (
      <div className="bg-gray-800 p-5 rounded-lg mb-6">
        <div className="h-40 flex items-center justify-center">
          <p className="text-gray-400">{t("camelot.no_track")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">Camelot Wheel</h3>
        <p className="text-sm text-gray-400">
          {t("camelot.current_track")}: {track.camelotKey} ({keyName})
        </p>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg mb-6">
        <div className="camelot-wheel">
          <div className="w-40 h-40 mx-auto rounded-full border-2 border-gray-700 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-display font-bold">{track.camelotKey}</div>
                <div className="text-sm text-gray-300">{keyName}</div>
              </div>
            </div>
          </div>
          
          {/* Create wheel segments for all 12 keys */}
          {Object.keys(camelotWheelMap).map((key) => {
            const isMatch = compatibleKeys.includes(key);
            const isCurrent = key === track.camelotKey;
            
            // Skip the current key as it's in the center
            if (isCurrent) return null;
            
            // Calculate position on the wheel
            const keyNum = parseInt(key.replace(/[AB]$/, ''));
            const keyType = key.endsWith('A') ? 'A' : 'B';
            const angle = ((keyNum - 1) * 30) * Math.PI / 180;
            const radius = 100;
            
            const left = 140 + radius * Math.sin(angle);
            const top = 140 - radius * Math.cos(angle);
            
            const style = {
              left: `${left}px`,
              top: `${top}px`,
              backgroundColor: isMatch ? 'hsl(var(--djino-purple))' : 'hsl(var(--muted))',
            };
            
            return (
              <div 
                key={key}
                className={`camelot-wheel-segment rounded-md ${isMatch ? 'camelot-segment-match' : ''}`}
                style={style}
              >
                {key}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300 mb-1">{t("camelot.compatible_keys")}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {compatibleKeys.map(key => (
              <Badge 
                key={key}
                className={`px-2 py-1 ${key.endsWith('A') ? 
                  'bg-djino-purple bg-opacity-20 text-djino-purple-light' : 
                  'bg-djino-cyan bg-opacity-20 text-djino-cyan-light'}`}
                variant="outline"
              >
                {key}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
