import { useEffect, useRef } from "react";
import { TrackAnalysis } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface EnergyBpmChartProps {
  tracks: TrackAnalysis[];
  activeTrackIndex: number;
  fullHeight?: boolean;
}

export default function EnergyBpmChart({ tracks, activeTrackIndex, fullHeight = false }: EnergyBpmChartProps) {
  const { t } = useLanguage();
  
  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">{t("chart.no_data")}</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">{t("chart.energy_bpm_flow")}</h3>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className={`${fullHeight ? 'h-80' : 'h-60'} relative`}>
          {/* BPM Line */}
          <div className="bpm-line" style={{ top: '30px', left: 0, width: '100%' }}></div>
          
          {/* Energy and BPM Bars */}
          <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between">
            {tracks.map((track, index) => {
              const barWidth = 100 / tracks.length;
              const isActive = index === activeTrackIndex;
              
              return (
                <div 
                  key={`track-energy-${track.id}`} 
                  className={`relative flex flex-col items-center justify-end px-1 ${isActive ? 'opacity-100' : 'opacity-80'}`} 
                  style={{ width: `${barWidth}%` }}
                >
                  <div className="text-xs text-gray-400 absolute -top-5">
                    {Math.round(track.bpm)}
                  </div>
                  <div 
                    className="energy-graph-bar w-full bg-gradient-to-t from-djino-purple to-djino-cyan rounded-t"
                    style={{ height: `${track.energy * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-1">{index + 1}</div>
                </div>
              );
            })}
          </div>
          
          {/* Graph Legends */}
          <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 p-2 rounded text-xs">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-gradient-to-r from-djino-purple to-djino-cyan rounded-full mr-2"></div>
              <span>{t("chart.energy_level")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-1 bg-djino-purple mr-2"></div>
              <span>{t("chart.bpm_flow")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
