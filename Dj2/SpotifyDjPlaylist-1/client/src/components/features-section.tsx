import { useLanguage } from "@/hooks/use-language";

export default function FeaturesSection() {
  const { t } = useLanguage();
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-display font-bold mb-6">{t("features.title")}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-djino-dark-tertiary p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-djino-purple bg-opacity-20 flex items-center justify-center mb-4">
            <i className="ri-disc-line text-2xl text-djino-purple-light"></i>
          </div>
          <h3 className="font-medium text-lg mb-2">{t("features.camelot.title")}</h3>
          <p className="text-gray-300 text-sm">{t("features.camelot.description")}</p>
        </div>
        
        <div className="bg-djino-dark-tertiary p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-djino-cyan bg-opacity-20 flex items-center justify-center mb-4">
            <i className="ri-bar-chart-line text-2xl text-djino-cyan-light"></i>
          </div>
          <h3 className="font-medium text-lg mb-2">{t("features.bpm.title")}</h3>
          <p className="text-gray-300 text-sm">{t("features.bpm.description")}</p>
        </div>
        
        <div className="bg-djino-dark-tertiary p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-djino-purple bg-opacity-20 flex items-center justify-center mb-4">
            <i className="ri-pulse-line text-2xl text-djino-purple-light"></i>
          </div>
          <h3 className="font-medium text-lg mb-2">{t("features.energy.title")}</h3>
          <p className="text-gray-300 text-sm">{t("features.energy.description")}</p>
        </div>
      </div>
    </section>
  );
}
