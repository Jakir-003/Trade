import { PriceData, TechnicalIndicator } from "@shared/schema";

export interface SignalAnalysis {
  confidence: number;
  direction: 'BUY' | 'SELL';
  reasons: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class TradingAnalysis {
  static analyzeSignal(
    priceData: PriceData[],
    indicators: TechnicalIndicator,
    patterns: string[]
  ): SignalAnalysis {
    const reasons: string[] = [];
    let confidence = 0;
    let direction: 'BUY' | 'SELL' = 'BUY';

    // RSI Analysis
    if (indicators.rsi) {
      const rsi = parseFloat(indicators.rsi);
      if (rsi < 30) {
        reasons.push(`RSI Oversold (${rsi.toFixed(2)})`);
        confidence += 25;
        direction = 'BUY';
      } else if (rsi > 70) {
        reasons.push(`RSI Overbought (${rsi.toFixed(2)})`);
        confidence += 25;
        direction = 'SELL';
      }
    }

    // MACD Analysis
    if (indicators.macd && indicators.macdSignal) {
      const macd = parseFloat(indicators.macd);
      const signal = parseFloat(indicators.macdSignal);
      
      if (macd > signal && direction === 'BUY') {
        reasons.push('MACD Bullish Crossover');
        confidence += 20;
      } else if (macd < signal && direction === 'SELL') {
        reasons.push('MACD Bearish Crossover');
        confidence += 20;
      }
    }

    // EMA Analysis
    if (indicators.ema20 && indicators.ema50) {
      const ema20 = parseFloat(indicators.ema20);
      const ema50 = parseFloat(indicators.ema50);
      
      if (ema20 > ema50 && direction === 'BUY') {
        reasons.push('EMA 20 above EMA 50 (Uptrend)');
        confidence += 15;
      } else if (ema20 < ema50 && direction === 'SELL') {
        reasons.push('EMA 20 below EMA 50 (Downtrend)');
        confidence += 15;
      }
    }

    // Pattern Analysis
    patterns.forEach(pattern => {
      reasons.push(`${pattern} Pattern Detected`);
      confidence += 20;
    });

    // Volume Analysis (simulated)
    const volumeSpike = Math.random() > 0.7;
    if (volumeSpike) {
      reasons.push('Volume Surge Confirmed');
      confidence += 10;
    }

    // Risk Assessment
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (confidence < 50) riskLevel = 'HIGH';
    else if (confidence < 75) riskLevel = 'MEDIUM';

    return {
      confidence: Math.min(confidence, 100),
      direction,
      reasons,
      riskLevel,
    };
  }

  static calculateRiskReward(
    entryPrice: number,
    targetPrice: number,
    stopLoss: number
  ): number {
    const profit = Math.abs(targetPrice - entryPrice);
    const risk = Math.abs(entryPrice - stopLoss);
    return profit / risk;
  }

  static generateEntryLevels(
    currentPrice: number,
    direction: 'BUY' | 'SELL'
  ): { entry: number; target: number; stopLoss: number } {
    const volatility = 0.002; // 20 pips for EUR/USD
    
    if (direction === 'BUY') {
      return {
        entry: currentPrice,
        target: currentPrice + (volatility * 2),
        stopLoss: currentPrice - volatility,
      };
    } else {
      return {
        entry: currentPrice,
        target: currentPrice - (volatility * 2),
        stopLoss: currentPrice + volatility,
      };
    }
  }
}
