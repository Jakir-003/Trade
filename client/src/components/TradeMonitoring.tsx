import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ActiveTrade } from "@shared/schema";
import { PieChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TradeMonitoring() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trades } = useQuery<ActiveTrade[]>({
    queryKey: ["/api/trades"],
    refetchInterval: 10000,
  });

  const closeTradesMutation = useMutation({
    mutationFn: (tradeId: number) => apiRequest("PUT", `/api/trades/${tradeId}/close`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      toast({
        title: "Trade Closed",
        description: "Trade has been closed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to close trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCloseTrade = (tradeId: number) => {
    closeTradesMutation.mutate(tradeId);
  };

  const getPnLColor = (pnl: string) => {
    const value = parseFloat(pnl);
    if (value > 0) return "text-[var(--success-green)]";
    if (value < 0) return "text-[var(--danger-red)]";
    return "text-[var(--text-muted)]";
  };

  const getDirectionColor = (direction: string) => {
    return direction === "BUY" 
      ? "bg-[var(--success-green)]/20 text-[var(--success-green)]"
      : "bg-[var(--danger-red)]/20 text-[var(--danger-red)]";
  };

  const getBorderColor = (direction: string) => {
    return direction === "BUY" 
      ? "border-l-[var(--success-green)]"
      : "border-l-[var(--danger-red)]";
  };

  const mockTrades = [
    {
      id: 1,
      symbol: "EURUSD",
      direction: "BUY",
      timeframe: "15m",
      entryPrice: "1.0845",
      currentPrice: "1.0852",
      targetPrice: "1.0890",
      stopLoss: "1.0820",
      pnl: "45.20",
      pnlPercent: "2.15",
    },
    {
      id: 2,
      symbol: "GBPUSD",
      direction: "SELL",
      timeframe: "1h",
      entryPrice: "1.2750",
      currentPrice: "1.2745",
      targetPrice: "1.2710",
      stopLoss: "1.2780",
      pnl: "-12.80",
      pnlPercent: "-0.65",
    },
  ];

  const displayTrades = trades && trades.length > 0 ? trades : mockTrades;

  return (
    <div className="trading-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <PieChart className="text-[var(--accent-blue)]" size={20} />
          <span>Active Trades</span>
          <span className="text-sm bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] px-2 py-1 rounded-full">
            {displayTrades.length} Open
          </span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[var(--accent-blue)] hover:text-blue-400"
        >
          <Plus className="mr-1" size={14} />
          Add Trade
        </Button>
      </div>
      
      <div className="space-y-4">
        {displayTrades.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[var(--dark-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="text-[var(--text-muted)]" size={24} />
            </div>
            <h4 className="text-lg font-semibold text-[var(--text-muted)] mb-2">
              No Active Trades
            </h4>
            <p className="text-sm text-[var(--text-muted)]">
              Start trading by taking signals from the analysis above.
            </p>
          </div>
        ) : (
          displayTrades.map((trade) => (
            <div
              key={trade.id}
              className={`bg-[var(--dark-primary)] rounded-lg p-4 border-l-4 ${getBorderColor(trade.direction)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">{trade.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getDirectionColor(trade.direction)}`}>
                    {trade.direction}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{trade.timeframe}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--text-muted)]">P&L</div>
                  <div className={`font-bold ${getPnLColor(trade.pnl)}`}>
                    {parseFloat(trade.pnl) > 0 ? '+' : ''}${trade.pnl}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-[var(--text-muted)]">Entry</div>
                  <div className="font-semibold">{trade.entryPrice}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)]">Current</div>
                  <div className="font-semibold">{trade.currentPrice}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)]">Target</div>
                  <div className="font-semibold text-[var(--success-green)]">{trade.targetPrice}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-[var(--dark-tertiary)] hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => handleCloseTrade(trade.id)}
                  disabled={closeTradesMutation.isPending}
                >
                  Close Trade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-[var(--accent-blue)] hover:bg-blue-600 text-white border-[var(--accent-blue)]"
                >
                  Modify
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
