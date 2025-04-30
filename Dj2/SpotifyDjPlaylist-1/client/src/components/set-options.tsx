import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SetOptions as SetOptionsType } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";

interface SetOptionsProps {
  options: SetOptionsType;
  onChange: (options: SetOptionsType) => void;
}

export default function SetOptions({ options, onChange }: SetOptionsProps) {
  const { t } = useLanguage();
  
  const handleBpmRangeChange = (values: number[]) => {
    onChange({
      ...options,
      bpmRange: {
        min: values[0],
        max: values[1]
      }
    });
  };
  
  const handleEnergyFlowChange = (flow: 'low-high' | 'high-high' | 'wave') => {
    onChange({
      ...options,
      energyFlow: flow
    });
  };
  
  const handleTransitionStyleChange = (field: keyof SetOptionsType['transitionStyle'], value: boolean) => {
    onChange({
      ...options,
      transitionStyle: {
        ...options.transitionStyle,
        [field]: value
      }
    });
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">{t("set_options.title")}</h3>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-lg">
        <div className="mb-4">
          <Label className="block text-sm text-gray-300 mb-2">{t("set_options.bpm_range")}</Label>
          <div className="relative px-2">
            <Slider 
              min={70} 
              max={180} 
              step={1}
              value={[options.bpmRange.min, options.bpmRange.max]} 
              onValueChange={handleBpmRangeChange}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>70</span>
              <span>180</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm text-gray-300 mb-2">{t("set_options.energy_flow")}</Label>
          <div className="flex gap-2">
            <Button 
              type="button"
              variant={options.energyFlow === 'low-high' ? 'default' : 'secondary'}
              className={options.energyFlow === 'low-high' ? 'flex-1' : 'bg-gray-700 text-gray-300 flex-1'}
              onClick={() => handleEnergyFlowChange('low-high')}
              size="sm"
            >
              {t("set_options.low_high")}
            </Button>
            <Button 
              type="button"
              variant={options.energyFlow === 'high-high' ? 'default' : 'secondary'}
              className={options.energyFlow === 'high-high' ? 
                'bg-djino-purple bg-opacity-20 text-djino-purple-light flex-1' : 
                'bg-gray-700 text-gray-300 flex-1'}
              onClick={() => handleEnergyFlowChange('high-high')}
              size="sm"
            >
              {t("set_options.high_high")}
            </Button>
            <Button 
              type="button"
              variant={options.energyFlow === 'wave' ? 'default' : 'secondary'}
              className={options.energyFlow === 'wave' ? 'flex-1' : 'bg-gray-700 text-gray-300 flex-1'}
              onClick={() => handleEnergyFlowChange('wave')}
              size="sm"
            >
              {t("set_options.wave")}
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm text-gray-300 mb-2">{t("set_options.transition_style")}</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Checkbox 
                id="harmonic" 
                className="mr-2"
                checked={options.transitionStyle.forceHarmonic}
                onCheckedChange={(checked) => 
                  handleTransitionStyleChange('forceHarmonic', checked as boolean)}
              />
              <Label htmlFor="harmonic" className="text-sm">{t("set_options.force_harmonic")}</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="bpm" 
                className="mr-2"
                checked={options.transitionStyle.forceBpmMatch}
                onCheckedChange={(checked) => 
                  handleTransitionStyleChange('forceBpmMatch', checked as boolean)}
              />
              <Label htmlFor="bpm" className="text-sm">{t("set_options.force_bpm")}</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="energy" 
                className="mr-2"
                checked={options.transitionStyle.allowEnergyJumps}
                onCheckedChange={(checked) => 
                  handleTransitionStyleChange('allowEnergyJumps', checked as boolean)}
              />
              <Label htmlFor="energy" className="text-sm">{t("set_options.allow_energy_jumps")}</Label>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-djino-purple to-djino-cyan text-white font-medium py-2 rounded-md hover:opacity-90 transition-opacity mt-2">
          {t("set_options.reoptimize")}
        </Button>
      </div>
    </div>
  );
}
