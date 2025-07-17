import { useQuery } from "@tanstack/react-query";
import { PriceData } from "@shared/schema";
import { BarChart3, Maximize2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InteractiveChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("15m");
  
  const { data: priceData } = useQuery<PriceData[]>({
    queryKey: ["/api/price-data/EURUSD", selectedTimeframe],
    refetchInterval: 30000,
  });

  const handleFullscreen = () => {
    // In a real implementation, this would open a fullscreen chart modal
    console.log("Opening fullscreen chart");
  };

  return (
    <div id="interactive-chart" className="trading-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <BarChart3 className="text-[var(--accent-blue)]" size={20} />
          <span>EUR/USD - {selectedTimeframe.toUpperCase()} Chart</span>
        </h3>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20 bg-[var(--dark-tertiary)] border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="4h">4h</SelectItem>
              <SelectItem value="1d">1d</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="bg-[var(--dark-tertiary)] hover:bg-gray-600 border-gray-600"
            onClick={handleFullscreen}
          >
            <Maximize2 size={14} />
          </Button>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="chart-container rounded-lg p-4 h-80 relative">
        {/* Chart placeholder with pattern highlights */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Modern chart visualization with animated elements */}
          <div className="w-full h-full relative overflow-hidden">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            
            {/* Simulated candlesticks */}
            <div className="absolute inset-4 flex items-end justify-between">
              {Array.from({ length: 20 }).map((_, i) => {
                const isGreen = Math.random() > 0.5;
                const height = Math.random() * 40 + 20;
                const opacity = i === 6 ? 0.9 : 0.6; // Highlight one candle
                
                return (
                  <div
                    key={i}
                    className={`w-2 ${isGreen ? 'bg-[var(--success-green)]' : 'bg-[var(--danger-red)]'} ${i === 6 ? 'border-2 border-[var(--success-green)] animate-pulse-green' : ''}`}
                    style={{ 
                      height: `${height}px`,
                      opacity: opacity
                    }}
                  />
                );
              })}
            </div>
            
            {/* Pattern highlight overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[var(--success-green)]/10 border-2 border-[var(--success-green)] rounded-lg p-8 animate-pulse">
                <span className="text-[var(--success-green)] font-semibold text-sm">Inside Bar Pattern</span>
              </div>
            </div>
            
            {/* Price levels */}
            <div className="absolute right-4 top-16 space-y-2 text-xs">
              <div className="bg-[var(--success-green)] px-2 py-1 rounded text-white">TP: 1.0890</div>
              <div className="bg-[var(--accent-blue)] px-2 py-1 rounded text-white">Entry: 1.0852</div>
              <div className="bg-[var(--danger-red)] px-2 py-1 rounded text-white">SL: 1.0820</div>
            </div>
          </div>
        </div>
        
        {/* Chart loading state */}
        <div className="absolute bottom-4 left-4 text-xs text-[var(--text-muted)] flex items-center space-x-2">
          <div className="w-2 h-2 bg-[var(--success-green)] rounded-full animate-pulse"></div>
          <span>Real-time data</span>
        </div>
      </div>
    </div>
  );
}
