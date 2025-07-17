import { useQuery } from "@tanstack/react-query";
import { TechnicalIndicator } from "@shared/schema";
import { Gauge, TrendingUp, Activity } from "lucide-react";

export default function TechnicalIndicators() {
  const { data: indicators } = useQuery<TechnicalIndicator>({
    queryKey: ["/api/indicators/EURUSD/15m"],
    refetchInterval: 30000,
  });

  const getRSIStatus = (rsi: string | null) => {
    if (!rsi) return { status: "Unknown", color: "text-[var(--text-muted)]" };
    const value = parseFloat(rsi);
    if (value < 30) return { status: "Oversold", color: "text-[var(--success-green)]" };
    if (value > 70) return { status: "Overbought", color: "text-[var(--danger-red)]" };
    return { status: "Neutral", color: "text-[var(--text-muted)]" };
  };

  const getMACDStatus = (macd: string | null, signal: string | null) => {
    if (!macd || !signal) return { status: "Unknown", color: "text-[var(--text-muted)]" };
    const macdVal = parseFloat(macd);
    const signalVal = parseFloat(signal);
    
    if (macdVal > signalVal) return { status: "Bullish", color: "text-[var(--success-green)]" };
    return { status: "Bearish", color: "text-[var(--danger-red)]" };
  };

  const getEMAStatus = (ema20: string | null, ema50: string | null) => {
    if (!ema20 || !ema50) return { status: "Unknown", color: "text-[var(--text-muted)]" };
    const ema20Val = parseFloat(ema20);
    const ema50Val = parseFloat(ema50);
    
    if (ema20Val > ema50Val) return { status: "Bullish", color: "text-[var(--success-green)]" };
    return { status: "Bearish", color: "text-[var(--danger-red)]" };
  };

  const rsiStatus = getRSIStatus(indicators?.rsi || null);
  const macdStatus = getMACDStatus(indicators?.macd || null, indicators?.macdSignal || null);
  const emaStatus = getEMAStatus(indicators?.ema20 || null, indicators?.ema50 || null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* RSI Indicator */}
      <div className="trading-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <Gauge className="text-[var(--accent-blue)]" size={16} />
            <span>RSI (14)</span>
          </h3>
          <span className={`text-xs px-2 py-1 rounded ${rsiStatus.color} bg-opacity-20`}>
            {rsiStatus.status}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-[var(--dark-primary)] rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-[var(--danger-red)] via-[var(--warning-amber)] to-[var(--success-green)] h-3 rounded-full relative">
              {indicators?.rsi && (
                <div 
                  className="absolute top-0 w-3 h-3 bg-white rounded-full border-2 border-[var(--dark-secondary)] transform -translate-x-1/2"
                  style={{ left: `${parseFloat(indicators.rsi)}%` }}
                ></div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>0</span>
            <span>30</span>
            <span>70</span>
            <span>100</span>
          </div>
          <div className="text-center mt-2">
            <span className={`text-2xl font-bold ${rsiStatus.color}`}>
              {indicators?.rsi || "--"}
            </span>
          </div>
        </div>
      </div>

      {/* MACD Indicator */}
      <div className="trading-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <Activity className="text-[var(--accent-blue)]" size={16} />
            <span>MACD</span>
          </h3>
          <span className={`text-xs px-2 py-1 rounded ${macdStatus.color} bg-opacity-20`}>
            {macdStatus.status}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-muted)]">MACD Line:</span>
            <span className={indicators?.macd && parseFloat(indicators.macd) > 0 ? "text-[var(--success-green)]" : "text-[var(--danger-red)]"}>
              {indicators?.macd || "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-muted)]">Signal Line:</span>
            <span className={indicators?.macdSignal && parseFloat(indicators.macdSignal) > 0 ? "text-[var(--success-green)]" : "text-[var(--danger-red)]"}>
              {indicators?.macdSignal || "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-muted)]">Histogram:</span>
            <span className={indicators?.macdHistogram && parseFloat(indicators.macdHistogram) > 0 ? "text-[var(--success-green)]" : "text-[var(--danger-red)]"}>
              {indicators?.macdHistogram || "--"}
            </span>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm font-semibold ${macdStatus.color}`}>
              {macdStatus.status === "Bullish" ? "↗ Crossover Detected" : "↘ Bearish Signal"}
            </span>
          </div>
        </div>
      </div>

      {/* EMA Crossover */}
      <div className="trading-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <TrendingUp className="text-[var(--accent-blue)]" size={16} />
            <span>EMA Cross</span>
          </h3>
          <span className={`text-xs px-2 py-1 rounded ${emaStatus.color} bg-opacity-20`}>
            {emaStatus.status}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-muted)]">EMA 20:</span>
            <span className="text-[var(--success-green)]">
              {indicators?.ema20 || "--"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-muted)]">EMA 50:</span>
            <span className="text-[var(--text-muted)]">
              {indicators?.ema50 || "--"}
            </span>
          </div>
          {indicators?.ema20 && indicators?.ema50 && (
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">Spread:</span>
              <span className="text-[var(--success-green)]">
                +{Math.abs(parseFloat(indicators.ema20) - parseFloat(indicators.ema50)).toFixed(0)} pips
              </span>
            </div>
          )}
          <div className="mt-3 text-center">
            <span className={`text-sm font-semibold ${emaStatus.color}`}>
              {emaStatus.status === "Bullish" ? "🔄 Golden Cross" : "🔻 Death Cross"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
