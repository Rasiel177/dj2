import { Link } from "wouter";
import { DiscIcon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-djino-dark-secondary mt-10 border-t border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-djino-purple to-djino-cyan mr-2 flex items-center justify-center">
              <DiscIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold">DJino</span>
          </div>
          
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link href="#" className="text-gray-400 hover:text-white">{t("footer.about")}</Link>
            <Link href="#" className="text-gray-400 hover:text-white">{t("footer.privacy")}</Link>
            <Link href="#" className="text-gray-400 hover:text-white">{t("footer.contact")}</Link>
          </div>
          
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
              <i className="ri-spotify-fill"></i>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
              <i className="ri-twitter-x-line"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} DJino. {t("footer.powered_by")} Spotify API.</p>
        </div>
      </div>
    </footer>
  );
}
