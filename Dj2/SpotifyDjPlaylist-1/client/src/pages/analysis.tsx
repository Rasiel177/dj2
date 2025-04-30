import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PlaylistInfoCard from "@/components/playlist-info-card";
import SetListTable from "@/components/set-list-table";
import EnergyBpmChart from "@/components/energy-bpm-chart";
import CamelotWheel from "@/components/camelot-wheel";
import SetOptions from "@/components/set-options";
import { TrackAnalysis, SetOptions as SetOptionsType } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

export default function Analysis() {
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [optimizedTracks, setOptimizedTracks] = useState<TrackAnalysis[]>([]);
  const [originalTracks, setOriginalTracks] = useState<TrackAnalysis[]>([]);
  const [setOptions, setSetOptions] = useState<SetOptionsType>({
    bpmRange: { min: 70, max: 180 },
    energyFlow: 'high-high',
    transitionStyle: {
      forceHarmonic: true,
      forceBpmMatch: true,
      allowEnergyJumps: false
    }
  });

  useEffect(() => {
    // Get playlist URL from session storage
    const storedUrl = sessionStorage.getItem("playlistUrl");
    if (!storedUrl) {
      setLocation("/");
      return;
    }
    setPlaylistUrl(storedUrl);
  }, [setLocation]);

  // Query to fetch and analyze the playlist
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/analyze', playlistUrl],
    queryFn: async () => {
      if (!playlistUrl) throw new Error("Playlist URL is required");
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(playlistUrl)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to analyze playlist");
      }
      return res.json();
    },
    enabled: !!playlistUrl,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: t("errors.analysis"),
        description: String(error),
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  useEffect(() => {
    if (data) {
      setOriginalTracks(data.tracks);
      setOptimizedTracks(data.optimizedTracks);
    }
  }, [data]);

  const handleTrackSelect = (index: number) => {
    setActiveTrackIndex(index);
  };

  const handleSetOptionsChange = (newOptions: SetOptionsType) => {
    setSetOptions(newOptions);
    
    // In a real implementation, this would make an API call to re-optimize the tracks
    // For now, we'll just use the API-provided optimized tracks
    if (data && data.optimizedTracks) {
      setOptimizedTracks([...data.optimizedTracks]);
    }
  };

  const handleSaveSet = () => {
    toast({
      title: t("success.set_saved"),
      description: t("success.set_saved_description"),
    });
  };

  const handleExportSet = () => {
    // This would generate and download a CSV or XML file in a real implementation
    toast({
      title: t("success.export_started"),
      description: t("success.export_description"),
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-djino-dark-tertiary rounded-xl p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-20 w-full mb-8" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <section id="analysis-results" className="mb-10">
        <div className="bg-djino-dark-tertiary rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold">{t("analysis.results_title")}</h2>
            {data && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {data.playlist.trackCount} {t("common.tracks")}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">
                  {Math.floor(data.totalDuration / 60)}m {data.totalDuration % 60}s
                </span>
              </div>
            )}
          </div>
          
          {data && <PlaylistInfoCard playlist={data.playlist} stats={data.stats} />}
          
          <Tabs defaultValue="optimized" className="mt-6">
            <TabsList className="border-b border-gray-700 mb-6 w-full justify-start">
              <TabsTrigger value="optimized" className="mr-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-djino-purple">
                {t("analysis.tabs.optimized")}
              </TabsTrigger>
              <TabsTrigger value="original" className="mr-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-djino-purple">
                {t("analysis.tabs.original")}
              </TabsTrigger>
              <TabsTrigger value="chart" className="mr-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-djino-purple">
                {t("analysis.tabs.chart")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="optimized" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2">
                  <div className="mb-4 flex justify-between">
                    <h3 className="font-medium">{t("analysis.harmonic_set")}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button 
                          className="bg-gray-800 p-2 rounded-md text-gray-400 hover:text-white"
                          onClick={handleSaveSet}
                        >
                          <i className="ri-save-line"></i>
                        </button>
                        <button 
                          className="bg-gray-800 p-2 rounded-md text-gray-400 hover:text-white"
                          onClick={handleExportSet}
                        >
                          <i className="ri-download-line"></i>
                        </button>
                        <button className="bg-djino-purple p-2 rounded-md text-white hover:bg-opacity-80">
                          <i className="ri-spotify-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <SetListTable 
                    tracks={optimizedTracks} 
                    activeTrackIndex={activeTrackIndex}
                    onTrackSelect={handleTrackSelect}
                  />
                  
                  <EnergyBpmChart 
                    tracks={optimizedTracks}
                    activeTrackIndex={activeTrackIndex}
                  />
                </div>
                
                <div className="col-span-1">
                  <CamelotWheel 
                    track={optimizedTracks[activeTrackIndex]}
                  />
                  
                  <SetOptions 
                    options={setOptions}
                    onChange={handleSetOptionsChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="original" className="mt-0">
              <SetListTable 
                tracks={originalTracks}
                activeTrackIndex={-1}
                onTrackSelect={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="chart" className="mt-0">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-medium mb-4">{t("analysis.bpm_chart")}</h3>
                <EnergyBpmChart 
                  tracks={originalTracks}
                  activeTrackIndex={-1}
                  fullHeight
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
