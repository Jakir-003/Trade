import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ForexPair } from "@shared/schema";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function LivePriceTicker() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { data: forexPairs, refetch } = useQuery<ForexPair[]>({
    queryKey: ["/api/forex-pairs"],
    refetchInterval: 30000,
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.channel === 'prices') {
      refetch();
      setLastUpdate(new Date());
    }
  }, [lastMessage, refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getChangeColor = (changePercent: string) => {
    const change = parseFloat(changePercent);
    if (change > 0) return "text-[var(--success-green)]";
    if (change < 0) return "text-[var(--danger-red)]";
    return "text-[var(--text-muted)]";
  };

  const getChangeSymbol = (changePercent: string) => {
    const change = parseFloat(changePercent);
    if (change > 0) return "+";
    return "";
  };

  return (
    <div className="trading-card rounded-xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <TrendingUp className="text-[var(--success-green)]" size={20} />
          <span>Live Forex Rates</span>
        </h2>
        <div className="text-xs text-[var(--text-muted)]">
          Last updated: <span>{formatTime(lastUpdate)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {forexPairs?.map((pair) => (
          <div
            key={pair.symbol}
            className="bg-[var(--dark-primary)] rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">{pair.symbol}</span>
              <span className={`text-xs ${getChangeColor(pair.changePercent)}`}>
                {getChangeSymbol(pair.changePercent)}{pair.changePercent}%
              </span>
            </div>
            <div className="text-lg font-bold">{pair.price}</div>
            <div className="text-xs text-[var(--text-muted)]">
              <span className={getChangeColor(pair.change)}>
                {getChangeSymbol(pair.change)}{pair.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
