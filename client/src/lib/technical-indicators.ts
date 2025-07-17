export interface IndicatorResult {
  value: number;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
}

export class TechnicalIndicators {
  static calculateRSI(prices: number[], period: number = 14): IndicatorResult {
    if (prices.length < period + 1) {
      throw new Error('Insufficient data for RSI calculation');
    }

    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    if (rsi < 30) signal = 'BUY';
    else if (rsi > 70) signal = 'SELL';

    return { value: rsi, signal };
  }

  static calculateEMA(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    ema[0] = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier));
    }

    return ema;
  }

  static calculateMACD(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): { macd: number[]; signal: number[]; histogram: number[] } {
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);

    const macd = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signal = this.calculateEMA(macd, signalPeriod);
    const histogram = macd.map((macdVal, i) => macdVal - signal[i]);

    return { macd, signal, histogram };
  }

  static calculateBollingerBands(
    prices: number[],
    period: number = 20,
    multiplier: number = 2
  ): { upper: number[]; middle: number[]; lower: number[] } {
    const sma: number[] = [];
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      sma.push(mean);
      upper.push(mean + (multiplier * stdDev));
      lower.push(mean - (multiplier * stdDev));
    }

    return { upper, middle: sma, lower };
  }

  static calculateStochastic(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 14
  ): IndicatorResult {
    if (highs.length < period || lows.length < period || closes.length < period) {
      throw new Error('Insufficient data for Stochastic calculation');
    }

    const recentHighs = highs.slice(-period);
    const recentLows = lows.slice(-period);
    const currentClose = closes[closes.length - 1];

    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);

    const stochastic = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;

    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    if (stochastic < 20) signal = 'BUY';
    else if (stochastic > 80) signal = 'SELL';

    return { value: stochastic, signal };
  }

  static calculateATR(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 14
  ): number {
    const trueRanges: number[] = [];

    for (let i = 1; i < closes.length; i++) {
      const currentHigh = highs[i];
      const currentLow = lows[i];
      const previousClose = closes[i - 1];

      const tr1 = currentHigh - currentLow;
      const tr2 = Math.abs(currentHigh - previousClose);
      const tr3 = Math.abs(currentLow - previousClose);

      trueRanges.push(Math.max(tr1, tr2, tr3));
    }

    return trueRanges.slice(-period).reduce((a, b) => a + b) / period;
  }
}
