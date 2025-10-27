import { Truck } from "lucide-react";
import { Button } from "./ui/button";

export function Header({ onNavigate, currentPage }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-[#1E90FF] p-2 rounded-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#0B3D91]" style={{ fontSize: '24px', fontWeight: '700' }}>
              RouteOptima
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className={`transition-colors ${
                currentPage === 'landing' 
                  ? 'text-[#1E90FF]' 
                  : 'text-gray-600 hover:text-[#1E90FF]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className={`transition-colors ${
                currentPage === 'upload' 
                  ? 'text-[#1E90FF]' 
                  : 'text-gray-600 hover:text-[#1E90FF]'
              }`}
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors ${
                currentPage === 'contact' 
                  ? 'text-[#1E90FF]' 
                  : 'text-gray-600 hover:text-[#1E90FF]'
              }`}
            >
              Contact
            </button>
          </nav>

          <Button 
            onClick={() => onNavigate('upload')}
            className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}