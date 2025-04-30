import { useState } from "react";
import { useLocation } from "wouter";
import SpotifyInput from "@/components/spotify-input";
import FeaturesSection from "@/components/features-section";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const [_, setLocation] = useLocation();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  const handlePlaylistAnalysis = async (playlistUrl: string) => {
    setLoading(true);
    try {
      // Store the URL in session storage to use on the analysis page
      sessionStorage.setItem("playlistUrl", playlistUrl);
      // Navigate to analysis page
      setLocation("/analysis");
    } catch (error) {
      console.error("Error analyzing playlist:", error);
      setLoading(false);
    }
  };
  
  const handleLoadDemo = async () => {
    setLoading(true);
    try {
      // Use a demo playlist URL (Spotify's official playlist - herkese açık)
      const demoPlaylistUrl = "https://open.spotify.com/playlist/37i9dQZF1DX6J5NfMJS675";
      sessionStorage.setItem("playlistUrl", demoPlaylistUrl);
      // Navigate to analysis page
      setLocation("/analysis");
    } catch (error) {
      console.error("Error loading demo:", error);
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-gradient">
                {t("home.hero.title")}
              </span>
            </h2>
            <p className="text-gray-300 mb-6">
              {t("home.hero.description")}
            </p>
            
            <SpotifyInput 
              onAnalyze={handlePlaylistAnalysis}
              onLoadDemo={handleLoadDemo}
              loading={loading}
            />
            
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center">
                <i className="ri-lock-line mr-1 text-djino-cyan"></i>
                <span>{t("home.secure")}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-spotify-line mr-1 text-djino-cyan"></i>
                <span>Spotify API</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <img 
              src="https://images.unsplash.com/photo-1571266028253-6c7f1cac8ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
              alt="DJ mixing on equipment" 
              className="rounded-xl shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-djino-dark-tertiary p-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-djino-purple-light flex items-center justify-center text-white">
                  <i className="ri-disc-line"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t("home.camelot.label")}</p>
                  <p className="text-sm font-medium">Camelot Wheel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}
