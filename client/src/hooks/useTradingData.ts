import { useQuery } from "@tanstack/react-query";
import { ForexPair, TradingSignal, TechnicalIndicator, CandlestickPattern, MarketNews, ActiveTrade } from "@shared/schema";

export function useTradingData() {
  const forexPairs = useQuery<ForexPair[]>({
    queryKey: ["/api/forex-pairs"],
    refetchInterval: 30000,
  });

  const signals = useQuery<TradingSignal[]>({
    queryKey: ["/api/signals"],
    refetchInterval: 10000,
  });

  const indicators = useQuery<TechnicalIndicator>({
    queryKey: ["/api/indicators/EURUSD/15m"],
    refetchInterval: 30000,
  });

  const patterns = useQuery<CandlestickPattern[]>({
    queryKey: ["/api/patterns"],
    refetchInterval: 30000,
  });

  const news = useQuery<MarketNews[]>({
    queryKey: ["/api/news"],
    refetchInterval: 60000,
  });

  const trades = useQuery<ActiveTrade[]>({
    queryKey: ["/api/trades"],
    refetchInterval: 10000,
  });

  return {
    forexPairs,
    signals,
    indicators,
    patterns,
    news,
    trades,
  };
}
