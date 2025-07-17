import { useQuery } from "@tanstack/react-query";
import { TradingSignal } from "@shared/schema";
import { TrendingUp, Brain, ChartArea, Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ActiveSignal() {
  const { toast } = useToast();

  const { data: signals } = useQuery<TradingSignal[]>({
    queryKey: ["/api/signals"],
    refetchInterval: 10000,
  });

  const activeSignal = signals?.find(signal => signal.isActive);

  const handleTakeTrade = async () => {
    if (!activeSignal) return;

    try {
      await apiRequest("POST", "/api/trades", {
        symbol: activeSignal.symbol,
        direction: activeSignal.direction,
        timeframe: activeSignal.timeframe,
        entryPrice: activeSignal.entryPrice,
        currentPrice: activeSignal.entryPrice,
        targetPrice: activeSignal.targetPrice,
        stopLoss: activeSignal.stopLoss,
        lotSize: "0.1",
        pnl: "0.00",
        pnlPercent: "0.00",
      });

      toast({
        title: "Trade Opened",
        description: `${activeSignal.direction} ${activeSignal.symbol} trade has been opened successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open trade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewChart = () => {
    // Scroll to chart section
    document.getElementById("interactive-chart")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!activeSignal) {
    return (
      <div className="trading-card rounded-xl p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--dark-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-[var(--text-muted)]" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-muted)] mb-2">
            No Active Signals
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Monitoring markets for high-probability trading opportunities...
          </p>
        </div>
      </div>
    );
  }

  const reasons = Array.isArray(activeSignal.reasons) ? activeSignal.reasons : [];

  return (
    <div className="trading-card signal-active rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--success-green)] rounded-full flex items-center justify-center animate-pulse-green">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--success-green)]">
              {activeSignal.direction} Signal Detected
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              High probability trade opportunity
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[var(--text-muted)]">Confidence</div>
          <div className="text-lg font-bold text-[var(--success-green)]">
            {activeSignal.confidence}%
          </div>
        </div>
      </div>

      {/* Trading Pair Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Symbol:</span>
            <span className="font-semibold">{activeSignal.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Timeframe:</span>
            <span className="font-semibold">{activeSignal.timeframe}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Pattern:</span>
            <span className="font-semibold text-[var(--accent-blue)]">
              {activeSignal.pattern}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Entry Price:</span>
            <span className="font-bold text-[var(--success-green)]">
              {activeSignal.entryPrice}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Take Profit:</span>
            <span className="font-semibold text-[var(--success-green)]">
              {activeSignal.targetPrice}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Stop Loss:</span>
            <span className="font-semibold text-[var(--danger-red)]">
              {activeSignal.stopLoss}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Risk/Reward:</span>
            <span className="font-semibold text-[var(--warning-amber)]">1:1.2</span>
          </div>
          {activeSignal.rsiValue && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">RSI Value:</span>
              <span className="font-semibold">{activeSignal.rsiValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Signal Reasoning */}
      <div className="bg-[var(--dark-primary)] rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
          <Brain className="text-[var(--accent-blue)]" size={20} />
          <span>Signal Analysis</span>
        </h3>
        
        <div className="space-y-2">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Shield className="text-[var(--success-green)] flex-shrink-0" size={16} />
              <span>{reason}</span>
            </div>
          ))}
          {activeSignal.newsRisk && (
            <div className="flex items-center space-x-3">
              <Shield className="text-[var(--success-green)] flex-shrink-0" size={16} />
              <span>News Risk: {activeSignal.newsRisk}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className="flex-1 bg-[var(--dark-tertiary)] hover:bg-gray-600 text-white border-gray-600"
          onClick={handleViewChart}
        >
          <ChartArea className="mr-2" size={16} />
          View Chart
        </Button>
        <Button
          className="flex-1 bg-[var(--success-green)] hover:bg-green-600 text-white"
          onClick={handleTakeTrade}
        >
          <Rocket className="mr-2" size={16} />
          Take This Trade
        </Button>
      </div>
    </div>
  );
}
