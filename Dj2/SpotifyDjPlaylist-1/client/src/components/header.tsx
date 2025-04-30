import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DiscIcon, HelpCircleIcon, ChevronDownIcon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <header className="bg-djino-dark-secondary border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-djino-purple to-djino-cyan mr-3 flex items-center justify-center">
            <DiscIcon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold">DJino</h1>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-3 py-1 text-sm rounded-md hover:bg-gray-800">
                <span className="mr-1">{language === 'tr' ? 'TR' : 'EN'}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('tr')}>
                Türkçe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href="#" className="text-gray-400 hover:text-white">
            <HelpCircleIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
