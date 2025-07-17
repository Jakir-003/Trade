import { useEffect } from "react";
import LivePriceTicker from "@/components/LivePriceTicker";
import ActiveSignal from "@/components/ActiveSignal";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import InteractiveChart from "@/components/InteractiveChart";
import PatternDetection from "@/components/PatternDetection";
import NewsIntegration from "@/components/NewsIntegration";
import TradeMonitoring from "@/components/TradeMonitoring";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Bell, Settings, BarChart3 } from "lucide-react";

export default function TradingDashboard() {
  useEffect(() => {
    document.title = "CandleBot - Smart Trading Assistant";
  }, []);

  return (
    <div className="min-h-screen bg-[var(--dark-primary)] text-[var(--text-light)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--dark-secondary)]/90 backdrop-blur-md border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--success-green)] to-[var(--accent-blue)] rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-bold text-white">CandleBot</h1>
              <span className="px-2 py-1 bg-[var(--success-green)]/20 text-[var(--success-green)] text-xs rounded-full">
                PRO
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Live Market Status */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-[var(--success-green)] rounded-full animate-pulse"></div>
                <span className="text-sm text-[var(--text-muted)]">Market Open</span>
              </div>
              
              <button className="p-2 hover:bg-[var(--dark-tertiary)] rounded-lg transition-colors">
                <Bell className="text-[var(--text-muted)]" size={16} />
              </button>
              <button className="p-2 hover:bg-[var(--dark-tertiary)] rounded-lg transition-colors">
                <Settings className="text-[var(--text-muted)]" size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Live Price Ticker */}
        <LivePriceTicker />

        {/* Active Signal */}
        <ActiveSignal />

        {/* Technical Indicators */}
        <TechnicalIndicators />

        {/* Interactive Chart */}
        <InteractiveChart />

        {/* Pattern Detection */}
        <PatternDetection />

        {/* News Integration */}
        <NewsIntegration />

        {/* Trade Monitoring */}
        <TradeMonitoring />
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
