export interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface PatternResult {
  name: string;
  confidence: number;
  description: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  isValid: boolean;
}

export class PatternDetection {
  static detectDoji(candle: CandlestickData): PatternResult {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    const bodyRatio = bodySize / totalRange;

    const isDoji = bodyRatio < 0.1;
    const confidence = isDoji ? Math.max(80 - (bodyRatio * 100), 60) : 0;

    return {
      name: 'Doji',
      confidence,
      description: 'Indecision pattern indicating potential reversal',
      type: 'NEUTRAL',
      isValid: isDoji,
    };
  }

  static detectHammer(candle: CandlestickData): PatternResult {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const totalRange = candle.high - candle.low;

    const isHammer = 
      lowerShadow > bodySize * 2 && 
      upperShadow < bodySize * 0.5 &&
      bodySize < totalRange * 0.3;

    const confidence = isHammer ? 75 : 0;

    return {
      name: 'Hammer',
      confidence,
      description: 'Bullish reversal pattern with long lower shadow',
      type: 'BULLISH',
      isValid: isHammer,
    };
  }

  static detectHangingMan(candle: CandlestickData): PatternResult {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const totalRange = candle.high - candle.low;

    const isHangingMan = 
      lowerShadow > bodySize * 2 && 
      upperShadow < bodySize * 0.5 &&
      bodySize < totalRange * 0.3 &&
      candle.close < candle.open; // Bearish candle

    const confidence = isHangingMan ? 70 : 0;

    return {
      name: 'Hanging Man',
      confidence,
      description: 'Bearish reversal pattern with long lower shadow',
      type: 'BEARISH',
      isValid: isHangingMan,
    };
  }

  static detectShootingStar(candle: CandlestickData): PatternResult {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const totalRange = candle.high - candle.low;

    const isShootingStar = 
      upperShadow > bodySize * 2 && 
      lowerShadow < bodySize * 0.5 &&
      bodySize < totalRange * 0.3;

    const confidence = isShootingStar ? 75 : 0;

    return {
      name: 'Shooting Star',
      confidence,
      description: 'Bearish reversal pattern with long upper shadow',
      type: 'BEARISH',
      isValid: isShootingStar,
    };
  }

  static detectEngulfing(
    previousCandle: CandlestickData,
    currentCandle: CandlestickData
  ): PatternResult {
    const prevIsBullish = previousCandle.close > previousCandle.open;
    const currIsBullish = currentCandle.close > currentCandle.open;

    const isBullishEngulfing = 
      !prevIsBullish && currIsBullish &&
      currentCandle.open < previousCandle.close &&
      currentCandle.close > previousCandle.open;

    const isBearishEngulfing = 
      prevIsBullish && !currIsBullish &&
      currentCandle.open > previousCandle.close &&
      currentCandle.close < previousCandle.open;

    const isEngulfing = isBullishEngulfing || isBearishEngulfing;
    const confidence = isEngulfing ? 80 : 0;

    return {
      name: isBullishEngulfing ? 'Bullish Engulfing' : 'Bearish Engulfing',
      confidence,
      description: `${isBullishEngulfing ? 'Bullish' : 'Bearish'} reversal pattern where current candle engulfs previous`,
      type: isBullishEngulfing ? 'BULLISH' : 'BEARISH',
      isValid: isEngulfing,
    };
  }

  static detectInsideBar(
    previousCandle: CandlestickData,
    currentCandle: CandlestickData
  ): PatternResult {
    const isInsideBar = 
      currentCandle.high < previousCandle.high &&
      currentCandle.low > previousCandle.low;

    const confidence = isInsideBar ? 65 : 0;

    return {
      name: 'Inside Bar',
      confidence,
      description: 'Consolidation pattern indicating potential breakout',
      type: 'NEUTRAL',
      isValid: isInsideBar,
    };
  }

  static detectPinBar(candle: CandlestickData): PatternResult {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    const bodyRatio = bodySize / totalRange;

    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);

    const isPinBar = 
      bodyRatio < 0.3 && 
      (lowerShadow > bodySize * 2 || upperShadow > bodySize * 2);

    const confidence = isPinBar ? 70 : 0;
    const type = lowerShadow > upperShadow ? 'BULLISH' : 'BEARISH';

    return {
      name: 'Pin Bar',
      confidence,
      description: 'Strong reversal signal with small body and long shadow',
      type,
      isValid: isPinBar,
    };
  }

  static detectAll(candles: CandlestickData[]): PatternResult[] {
    if (candles.length === 0) return [];

    const patterns: PatternResult[] = [];
    const currentCandle = candles[candles.length - 1];

    // Single candle patterns
    patterns.push(this.detectDoji(currentCandle));
    patterns.push(this.detectHammer(currentCandle));
    patterns.push(this.detectHangingMan(currentCandle));
    patterns.push(this.detectShootingStar(currentCandle));
    patterns.push(this.detectPinBar(currentCandle));

    // Two candle patterns
    if (candles.length >= 2) {
      const previousCandle = candles[candles.length - 2];
      patterns.push(this.detectEngulfing(previousCandle, currentCandle));
      patterns.push(this.detectInsideBar(previousCandle, currentCandle));
    }

    return patterns.filter(pattern => pattern.isValid);
  }
}
