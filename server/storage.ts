import {
  TradingPair,
  InsertTradingPair,
  TradingSignal,
  InsertTradingSignal,
  TechnicalIndicator,
  InsertTechnicalIndicator,
  CandlestickPattern,
  InsertCandlestickPattern,
  MarketNews,
  InsertMarketNews,
  ActiveTrade,
  InsertActiveTrade,
  PriceData,
  InsertPriceData,
  BacktestResult,
  InsertBacktestResult,
  BacktestTrade,
  InsertBacktestTrade,
  Portfolio,
  InsertPortfolio,
  PortfolioPosition,
  InsertPortfolioPosition,
  TradeHistory,
  InsertTradeHistory,
  TradingStrategy,
  InsertTradingStrategy,
  SharedSignal,
  InsertSharedSignal,
  SignalComment,
  InsertSignalComment,
  SignalFollow,
  InsertSignalFollow,
} from "@shared/schema";

export interface IStorage {
  // Trading Pairs (Forex + Crypto)
  getTradingPairs(): Promise<TradingPair[]>;
  getTradingPair(symbol: string): Promise<TradingPair | undefined>;
  updateTradingPair(symbol: string, data: Partial<InsertTradingPair>): Promise<TradingPair>;
  createTradingPair(pair: InsertTradingPair): Promise<TradingPair>;
  getTradingPairsByType(type: string): Promise<TradingPair[]>;

  // Trading Signals
  getActiveSignals(): Promise<TradingSignal[]>;
  getSignalsBySymbol(symbol: string): Promise<TradingSignal[]>;
  createSignal(signal: InsertTradingSignal): Promise<TradingSignal>;
  updateSignal(id: number, data: Partial<InsertTradingSignal>): Promise<TradingSignal>;
  deactivateSignal(id: number): Promise<void>;

  // Technical Indicators
  getIndicators(symbol: string, timeframe: string): Promise<TechnicalIndicator | undefined>;
  updateIndicators(symbol: string, timeframe: string, data: Partial<InsertTechnicalIndicator>): Promise<TechnicalIndicator>;
  createIndicators(indicators: InsertTechnicalIndicator): Promise<TechnicalIndicator>;

  // Candlestick Patterns
  getActivePatterns(): Promise<CandlestickPattern[]>;
  getPatternsBySymbol(symbol: string): Promise<CandlestickPattern[]>;
  createPattern(pattern: InsertCandlestickPattern): Promise<CandlestickPattern>;
  updatePattern(id: number, data: Partial<InsertCandlestickPattern>): Promise<CandlestickPattern>;

  // Market News
  getActiveNews(): Promise<MarketNews[]>;
  getNewsByImpact(impact: string): Promise<MarketNews[]>;
  createNews(news: InsertMarketNews): Promise<MarketNews>;
  updateNews(id: number, data: Partial<InsertMarketNews>): Promise<MarketNews>;

  // Active Trades
  getActiveTrades(): Promise<ActiveTrade[]>;
  getTradesBySymbol(symbol: string): Promise<ActiveTrade[]>;
  createTrade(trade: InsertActiveTrade): Promise<ActiveTrade>;
  updateTrade(id: number, data: Partial<InsertActiveTrade>): Promise<ActiveTrade>;
  closeTrade(id: number): Promise<void>;

  // Price Data
  getPriceData(symbol: string, timeframe: string, limit?: number): Promise<PriceData[]>;
  createPriceData(priceData: InsertPriceData): Promise<PriceData>;

  // Backtesting System
  getBacktestResults(): Promise<BacktestResult[]>;
  getBacktestResult(id: number): Promise<BacktestResult | undefined>;
  createBacktestResult(result: InsertBacktestResult): Promise<BacktestResult>;
  getBacktestTrades(backtestId: number): Promise<BacktestTrade[]>;
  createBacktestTrade(trade: InsertBacktestTrade): Promise<BacktestTrade>;
  deleteBacktestResult(id: number): Promise<void>;

  // Portfolio Tracking
  getPortfolios(userId: string): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, data: Partial<InsertPortfolio>): Promise<Portfolio>;
  deletePortfolio(id: number): Promise<void>;

  // Portfolio Positions
  getPortfolioPositions(portfolioId: number): Promise<PortfolioPosition[]>;
  getPortfolioPosition(id: number): Promise<PortfolioPosition | undefined>;
  createPortfolioPosition(position: InsertPortfolioPosition): Promise<PortfolioPosition>;
  updatePortfolioPosition(id: number, data: Partial<InsertPortfolioPosition>): Promise<PortfolioPosition>;
  closePortfolioPosition(id: number): Promise<void>;

  // Trade History
  getTradeHistory(portfolioId: number): Promise<TradeHistory[]>;
  createTradeHistoryEntry(entry: InsertTradeHistory): Promise<TradeHistory>;
  getTradeHistoryByDateRange(portfolioId: number, startDate: Date, endDate: Date): Promise<TradeHistory[]>;

  // Social Trading Features
  getTradingStrategies(): Promise<TradingStrategy[]>;
  getTradingStrategy(id: number): Promise<TradingStrategy | undefined>;
  getTradingStrategiesByUser(userId: string): Promise<TradingStrategy[]>;
  createTradingStrategy(strategy: InsertTradingStrategy): Promise<TradingStrategy>;
  updateTradingStrategy(id: number, data: Partial<InsertTradingStrategy>): Promise<TradingStrategy>;
  deleteTradingStrategy(id: number): Promise<void>;

  // Shared Signals
  getSharedSignals(): Promise<SharedSignal[]>;
  getSharedSignal(id: number): Promise<SharedSignal | undefined>;
  getSharedSignalsByStrategy(strategyId: number): Promise<SharedSignal[]>;
  createSharedSignal(signal: InsertSharedSignal): Promise<SharedSignal>;
  updateSharedSignal(id: number, data: Partial<InsertSharedSignal>): Promise<SharedSignal>;
  deleteSharedSignal(id: number): Promise<void>;

  // Signal Comments
  getSignalComments(signalId: number): Promise<SignalComment[]>;
  createSignalComment(comment: InsertSignalComment): Promise<SignalComment>;
  deleteSignalComment(id: number): Promise<void>;

  // Signal Follows
  getSignalFollows(strategyId: number): Promise<SignalFollow[]>;
  getUserFollows(userId: string): Promise<SignalFollow[]>;
  createSignalFollow(follow: InsertSignalFollow): Promise<SignalFollow>;
  deleteSignalFollow(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private tradingPairs: Map<string, TradingPair> = new Map();
  private tradingSignals: Map<number, TradingSignal> = new Map();
  private technicalIndicators: Map<string, TechnicalIndicator> = new Map();
  private candlestickPatterns: Map<number, CandlestickPattern> = new Map();
  private marketNews: Map<number, MarketNews> = new Map();
  private activeTrades: Map<number, ActiveTrade> = new Map();
  private priceData: Map<string, PriceData[]> = new Map();
  
  // New advanced features storage
  private backtestResults: Map<number, BacktestResult> = new Map();
  private backtestTrades: Map<number, BacktestTrade[]> = new Map();
  private portfolios: Map<number, Portfolio> = new Map();
  private portfolioPositions: Map<number, PortfolioPosition[]> = new Map();
  private tradeHistory: Map<number, TradeHistory[]> = new Map();
  private tradingStrategies: Map<number, TradingStrategy> = new Map();
  private sharedSignals: Map<number, SharedSignal> = new Map();
  private signalComments: Map<number, SignalComment[]> = new Map();
  private signalFollows: Map<number, SignalFollow[]> = new Map();
  
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize trading pairs (Forex + Crypto)
    const allPairs = [
      { symbol: "EURUSD", name: "Euro / US Dollar", type: "FOREX", price: "1.0852", change: "0.0013", changePercent: "0.12" },
      { symbol: "GBPUSD", name: "British Pound / US Dollar", type: "FOREX", price: "1.2745", change: "-0.0010", changePercent: "-0.08" },
      { symbol: "USDJPY", name: "US Dollar / Japanese Yen", type: "FOREX", price: "149.82", change: "0.37", changePercent: "0.25" },
      { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", type: "FOREX", price: "0.6543", change: "0.0000", changePercent: "0.00" },
      { symbol: "BTCUSD", name: "Bitcoin / US Dollar", type: "CRYPTO", price: "45250.50", change: "1250.30", changePercent: "2.84" },
      { symbol: "ETHUSD", name: "Ethereum / US Dollar", type: "CRYPTO", price: "2650.75", change: "125.40", changePercent: "4.96" },
      { symbol: "ADAUSD", name: "Cardano / US Dollar", type: "CRYPTO", price: "0.485", change: "0.025", changePercent: "5.43" },
      { symbol: "SOLUSD", name: "Solana / US Dollar", type: "CRYPTO", price: "105.30", change: "8.75", changePercent: "9.07" },
    ];

    allPairs.forEach((pair) => {
      const tradingPair: TradingPair = {
        id: this.currentId++,
        symbol: pair.symbol,
        name: pair.name,
        type: pair.type,
        price: pair.price,
        change: pair.change,
        changePercent: pair.changePercent,
        high: pair.type === "CRYPTO" ? 
          (parseFloat(pair.price) * 1.05).toFixed(2) : 
          (parseFloat(pair.price) + 0.0020).toFixed(5),
        low: pair.type === "CRYPTO" ? 
          (parseFloat(pair.price) * 0.95).toFixed(2) : 
          (parseFloat(pair.price) - 0.0020).toFixed(5),
        volume: pair.type === "CRYPTO" ? 
          (Math.random() * 2000000000).toFixed(2) : 
          Math.floor(Math.random() * 1000000).toString(),
        marketCap: pair.type === "CRYPTO" ? 
          (Math.random() * 500000000000).toFixed(2) : 
          null,
        lastUpdated: new Date(),
      };
      this.tradingPairs.set(pair.symbol, tradingPair);
    });

    // Initialize sample portfolio
    const samplePortfolio: Portfolio = {
      id: 1,
      userId: "demo-user",
      name: "My Trading Portfolio",
      description: "Main trading portfolio for forex and crypto",
      totalValue: "50000.00",
      totalPnl: "2500.00",
      totalPnlPercent: "5.26",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.portfolios.set(1, samplePortfolio);

    // Initialize sample trading strategy
    const sampleStrategy: TradingStrategy = {
      id: 1,
      userId: "demo-user",
      name: "RSI Momentum Strategy",
      description: "Trade based on RSI momentum with pattern confirmation",
      tags: ["RSI", "Momentum", "Patterns"],
      symbols: ["EURUSD", "BTCUSD", "ETHUSD"],
      timeframes: ["15m", "1h", "4h"],
      riskLevel: "MEDIUM",
      returnPercent: "15.7",
      maxDrawdown: "8.2",
      winRate: "68.5",
      followersCount: 24,
      isPublic: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tradingStrategies.set(1, sampleStrategy);
  }

  // Trading Pairs methods (Forex + Crypto)
  async getTradingPairs(): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values());
  }

  async getTradingPair(symbol: string): Promise<TradingPair | undefined> {
    return this.tradingPairs.get(symbol);
  }

  async getTradingPairsByType(type: string): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values()).filter(pair => pair.type === type);
  }

  async updateTradingPair(symbol: string, data: Partial<InsertTradingPair>): Promise<TradingPair> {
    const existing = this.tradingPairs.get(symbol);
    if (!existing) {
      throw new Error(`Trading pair ${symbol} not found`);
    }
    const updated = { ...existing, ...data, lastUpdated: new Date() };
    this.tradingPairs.set(symbol, updated);
    return updated;
  }

  async createTradingPair(pair: InsertTradingPair): Promise<TradingPair> {
    const newPair: TradingPair = {
      id: this.currentId++,
      ...pair,
      lastUpdated: new Date(),
    };
    this.tradingPairs.set(pair.symbol, newPair);
    return newPair;
  }

  // Trading Signals methods
  async getActiveSignals(): Promise<TradingSignal[]> {
    return Array.from(this.tradingSignals.values()).filter(signal => signal.isActive);
  }

  async getSignalsBySymbol(symbol: string): Promise<TradingSignal[]> {
    return Array.from(this.tradingSignals.values()).filter(signal => signal.symbol === symbol);
  }

  async createSignal(signal: InsertTradingSignal): Promise<TradingSignal> {
    const newSignal: TradingSignal = {
      id: this.currentId++,
      ...signal,
      rsiValue: signal.rsiValue || null,
      macdValue: signal.macdValue || null,
      volumeSpike: signal.volumeSpike || false,
      newsRisk: signal.newsRisk || "LOW",
      isActive: signal.isActive !== false,
      createdAt: new Date(),
    };
    this.tradingSignals.set(newSignal.id, newSignal);
    return newSignal;
  }

  async updateSignal(id: number, data: Partial<InsertTradingSignal>): Promise<TradingSignal> {
    const existing = this.tradingSignals.get(id);
    if (!existing) {
      throw new Error(`Signal ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.tradingSignals.set(id, updated);
    return updated;
  }

  async deactivateSignal(id: number): Promise<void> {
    const existing = this.tradingSignals.get(id);
    if (existing) {
      existing.isActive = false;
    }
  }

  // Technical Indicators methods
  async getIndicators(symbol: string, timeframe: string): Promise<TechnicalIndicator | undefined> {
    const key = `${symbol}_${timeframe}`;
    return this.technicalIndicators.get(key);
  }

  async updateIndicators(symbol: string, timeframe: string, data: Partial<InsertTechnicalIndicator>): Promise<TechnicalIndicator> {
    const key = `${symbol}_${timeframe}`;
    const existing = this.technicalIndicators.get(key);
    if (!existing) {
      throw new Error(`Indicators for ${symbol} ${timeframe} not found`);
    }
    const updated = { ...existing, ...data, lastUpdated: new Date() };
    this.technicalIndicators.set(key, updated);
    return updated;
  }

  async createIndicators(indicators: InsertTechnicalIndicator): Promise<TechnicalIndicator> {
    const key = `${indicators.symbol}_${indicators.timeframe}`;
    const newIndicators: TechnicalIndicator = {
      id: this.currentId++,
      ...indicators,
      rsi: indicators.rsi || null,
      macd: indicators.macd || null,
      macdSignal: indicators.macdSignal || null,
      macdHistogram: indicators.macdHistogram || null,
      ema20: indicators.ema20 || null,
      ema50: indicators.ema50 || null,
      ema200: indicators.ema200 || null,
      sma20: indicators.sma20 || null,
      sma50: indicators.sma50 || null,
      adx: indicators.adx || null,
      bollingerUpper: indicators.bollingerUpper || null,
      bollingerLower: indicators.bollingerLower || null,
      stochastic: indicators.stochastic || null,
      williamsR: indicators.williamsR || null,
      atr: indicators.atr || null,
      lastUpdated: new Date(),
    };
    this.technicalIndicators.set(key, newIndicators);
    return newIndicators;
  }

  // Candlestick Patterns methods
  async getActivePatterns(): Promise<CandlestickPattern[]> {
    return Array.from(this.candlestickPatterns.values()).filter(pattern => pattern.isValid);
  }

  async getPatternsBySymbol(symbol: string): Promise<CandlestickPattern[]> {
    return Array.from(this.candlestickPatterns.values()).filter(pattern => pattern.symbol === symbol);
  }

  async createPattern(pattern: InsertCandlestickPattern): Promise<CandlestickPattern> {
    const newPattern: CandlestickPattern = {
      id: this.currentId++,
      ...pattern,
      isValid: pattern.isValid !== false,
      detectedAt: new Date(),
    };
    this.candlestickPatterns.set(newPattern.id, newPattern);
    return newPattern;
  }

  async updatePattern(id: number, data: Partial<InsertCandlestickPattern>): Promise<CandlestickPattern> {
    const existing = this.candlestickPatterns.get(id);
    if (!existing) {
      throw new Error(`Pattern ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.candlestickPatterns.set(id, updated);
    return updated;
  }

  // Market News methods
  async getActiveNews(): Promise<MarketNews[]> {
    return Array.from(this.marketNews.values()).filter(news => news.isActive);
  }

  async getNewsByImpact(impact: string): Promise<MarketNews[]> {
    return Array.from(this.marketNews.values()).filter(news => news.impact === impact && news.isActive);
  }

  async createNews(news: InsertMarketNews): Promise<MarketNews> {
    const newNews: MarketNews = {
      id: this.currentId++,
      ...news,
      actual: news.actual || null,
      forecast: news.forecast || null,
      previous: news.previous || null,
      isActive: news.isActive !== false,
      createdAt: new Date(),
    };
    this.marketNews.set(newNews.id, newNews);
    return newNews;
  }

  async updateNews(id: number, data: Partial<InsertMarketNews>): Promise<MarketNews> {
    const existing = this.marketNews.get(id);
    if (!existing) {
      throw new Error(`News ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.marketNews.set(id, updated);
    return updated;
  }

  // Active Trades methods
  async getActiveTrades(): Promise<ActiveTrade[]> {
    return Array.from(this.activeTrades.values()).filter(trade => trade.isOpen);
  }

  async getTradesBySymbol(symbol: string): Promise<ActiveTrade[]> {
    return Array.from(this.activeTrades.values()).filter(trade => trade.symbol === symbol);
  }

  async createTrade(trade: InsertActiveTrade): Promise<ActiveTrade> {
    const newTrade: ActiveTrade = {
      id: this.currentId++,
      ...trade,
      isOpen: trade.isOpen !== false,
      openedAt: new Date(),
      closedAt: null,
    };
    this.activeTrades.set(newTrade.id, newTrade);
    return newTrade;
  }

  async updateTrade(id: number, data: Partial<InsertActiveTrade>): Promise<ActiveTrade> {
    const existing = this.activeTrades.get(id);
    if (!existing) {
      throw new Error(`Trade ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.activeTrades.set(id, updated);
    return updated;
  }

  async closeTrade(id: number): Promise<void> {
    const existing = this.activeTrades.get(id);
    if (existing) {
      existing.isOpen = false;
      existing.closedAt = new Date();
    }
  }

  // Price Data methods
  async getPriceData(symbol: string, timeframe: string, limit: number = 100): Promise<PriceData[]> {
    const key = `${symbol}_${timeframe}`;
    const data = this.priceData.get(key) || [];
    return data.slice(-limit);
  }

  async createPriceData(priceData: InsertPriceData): Promise<PriceData> {
    const key = `${priceData.symbol}_${priceData.timeframe}`;
    const newPriceData: PriceData = {
      id: this.currentId++,
      ...priceData,
    };
    
    const existing = this.priceData.get(key) || [];
    existing.push(newPriceData);
    this.priceData.set(key, existing);
    
    return newPriceData;
  }

  // Backtesting System methods
  async getBacktestResults(): Promise<BacktestResult[]> {
    return Array.from(this.backtestResults.values());
  }

  async getBacktestResult(id: number): Promise<BacktestResult | undefined> {
    return this.backtestResults.get(id);
  }

  async createBacktestResult(result: InsertBacktestResult): Promise<BacktestResult> {
    const newResult: BacktestResult = {
      id: this.currentId++,
      ...result,
      createdAt: new Date(),
    };
    this.backtestResults.set(newResult.id, newResult);
    return newResult;
  }

  async getBacktestTrades(backtestId: number): Promise<BacktestTrade[]> {
    return this.backtestTrades.get(backtestId) || [];
  }

  async createBacktestTrade(trade: InsertBacktestTrade): Promise<BacktestTrade> {
    const newTrade: BacktestTrade = {
      id: this.currentId++,
      ...trade,
    };
    if (!this.backtestTrades.has(trade.backtestId)) {
      this.backtestTrades.set(trade.backtestId, []);
    }
    this.backtestTrades.get(trade.backtestId)!.push(newTrade);
    return newTrade;
  }

  async deleteBacktestResult(id: number): Promise<void> {
    this.backtestResults.delete(id);
    this.backtestTrades.delete(id);
  }

  // Portfolio Tracking methods
  async getPortfolios(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const newPortfolio: Portfolio = {
      id: this.currentId++,
      ...portfolio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.portfolios.set(newPortfolio.id, newPortfolio);
    return newPortfolio;
  }

  async updatePortfolio(id: number, data: Partial<InsertPortfolio>): Promise<Portfolio> {
    const existing = this.portfolios.get(id);
    if (!existing) {
      throw new Error(`Portfolio ${id} not found`);
    }
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.portfolios.set(id, updated);
    return updated;
  }

  async deletePortfolio(id: number): Promise<void> {
    this.portfolios.delete(id);
    this.portfolioPositions.delete(id);
    this.tradeHistory.delete(id);
  }

  // Portfolio Positions methods
  async getPortfolioPositions(portfolioId: number): Promise<PortfolioPosition[]> {
    return this.portfolioPositions.get(portfolioId) || [];
  }

  async getPortfolioPosition(id: number): Promise<PortfolioPosition | undefined> {
    for (const positions of this.portfolioPositions.values()) {
      const position = positions.find(p => p.id === id);
      if (position) return position;
    }
    return undefined;
  }

  async createPortfolioPosition(position: InsertPortfolioPosition): Promise<PortfolioPosition> {
    const newPosition: PortfolioPosition = {
      id: this.currentId++,
      ...position,
      openedAt: new Date(),
      updatedAt: new Date(),
    };
    if (!this.portfolioPositions.has(position.portfolioId)) {
      this.portfolioPositions.set(position.portfolioId, []);
    }
    this.portfolioPositions.get(position.portfolioId)!.push(newPosition);
    return newPosition;
  }

  async updatePortfolioPosition(id: number, data: Partial<InsertPortfolioPosition>): Promise<PortfolioPosition> {
    for (const [portfolioId, positions] of this.portfolioPositions.entries()) {
      const index = positions.findIndex(p => p.id === id);
      if (index !== -1) {
        const updated = { ...positions[index], ...data, updatedAt: new Date() };
        positions[index] = updated;
        return updated;
      }
    }
    throw new Error(`Portfolio position ${id} not found`);
  }

  async closePortfolioPosition(id: number): Promise<void> {
    await this.updatePortfolioPosition(id, { isOpen: false });
  }

  // Trade History methods
  async getTradeHistory(portfolioId: number): Promise<TradeHistory[]> {
    return this.tradeHistory.get(portfolioId) || [];
  }

  async createTradeHistoryEntry(entry: InsertTradeHistory): Promise<TradeHistory> {
    const newEntry: TradeHistory = {
      id: this.currentId++,
      ...entry,
      executedAt: new Date(),
    };
    if (!this.tradeHistory.has(entry.portfolioId)) {
      this.tradeHistory.set(entry.portfolioId, []);
    }
    this.tradeHistory.get(entry.portfolioId)!.push(newEntry);
    return newEntry;
  }

  async getTradeHistoryByDateRange(portfolioId: number, startDate: Date, endDate: Date): Promise<TradeHistory[]> {
    const history = this.tradeHistory.get(portfolioId) || [];
    return history.filter(trade => 
      trade.executedAt >= startDate && trade.executedAt <= endDate
    );
  }

  // Social Trading Features methods
  async getTradingStrategies(): Promise<TradingStrategy[]> {
    return Array.from(this.tradingStrategies.values()).filter(s => s.isPublic);
  }

  async getTradingStrategy(id: number): Promise<TradingStrategy | undefined> {
    return this.tradingStrategies.get(id);
  }

  async getTradingStrategiesByUser(userId: string): Promise<TradingStrategy[]> {
    return Array.from(this.tradingStrategies.values()).filter(s => s.userId === userId);
  }

  async createTradingStrategy(strategy: InsertTradingStrategy): Promise<TradingStrategy> {
    const newStrategy: TradingStrategy = {
      id: this.currentId++,
      ...strategy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tradingStrategies.set(newStrategy.id, newStrategy);
    return newStrategy;
  }

  async updateTradingStrategy(id: number, data: Partial<InsertTradingStrategy>): Promise<TradingStrategy> {
    const existing = this.tradingStrategies.get(id);
    if (!existing) {
      throw new Error(`Trading strategy ${id} not found`);
    }
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.tradingStrategies.set(id, updated);
    return updated;
  }

  async deleteTradingStrategy(id: number): Promise<void> {
    this.tradingStrategies.delete(id);
  }

  // Shared Signals methods
  async getSharedSignals(): Promise<SharedSignal[]> {
    return Array.from(this.sharedSignals.values()).filter(s => s.isPublic);
  }

  async getSharedSignal(id: number): Promise<SharedSignal | undefined> {
    return this.sharedSignals.get(id);
  }

  async getSharedSignalsByStrategy(strategyId: number): Promise<SharedSignal[]> {
    return Array.from(this.sharedSignals.values()).filter(s => s.strategyId === strategyId);
  }

  async createSharedSignal(signal: InsertSharedSignal): Promise<SharedSignal> {
    const newSignal: SharedSignal = {
      id: this.currentId++,
      ...signal,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sharedSignals.set(newSignal.id, newSignal);
    return newSignal;
  }

  async updateSharedSignal(id: number, data: Partial<InsertSharedSignal>): Promise<SharedSignal> {
    const existing = this.sharedSignals.get(id);
    if (!existing) {
      throw new Error(`Shared signal ${id} not found`);
    }
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.sharedSignals.set(id, updated);
    return updated;
  }

  async deleteSharedSignal(id: number): Promise<void> {
    this.sharedSignals.delete(id);
  }

  // Signal Comments methods
  async getSignalComments(signalId: number): Promise<SignalComment[]> {
    return this.signalComments.get(signalId) || [];
  }

  async createSignalComment(comment: InsertSignalComment): Promise<SignalComment> {
    const newComment: SignalComment = {
      id: this.currentId++,
      ...comment,
      createdAt: new Date(),
    };
    if (!this.signalComments.has(comment.signalId)) {
      this.signalComments.set(comment.signalId, []);
    }
    this.signalComments.get(comment.signalId)!.push(newComment);
    return newComment;
  }

  async deleteSignalComment(id: number): Promise<void> {
    for (const [signalId, comments] of this.signalComments.entries()) {
      const index = comments.findIndex(c => c.id === id);
      if (index !== -1) {
        comments.splice(index, 1);
        return;
      }
    }
  }

  // Signal Follows methods
  async getSignalFollows(strategyId: number): Promise<SignalFollow[]> {
    return this.signalFollows.get(strategyId) || [];
  }

  async getUserFollows(userId: string): Promise<SignalFollow[]> {
    const allFollows: SignalFollow[] = [];
    for (const follows of this.signalFollows.values()) {
      allFollows.push(...follows.filter(f => f.followerId === userId));
    }
    return allFollows;
  }

  async createSignalFollow(follow: InsertSignalFollow): Promise<SignalFollow> {
    const newFollow: SignalFollow = {
      id: this.currentId++,
      ...follow,
      followedAt: new Date(),
    };
    if (!this.signalFollows.has(follow.strategyId)) {
      this.signalFollows.set(follow.strategyId, []);
    }
    this.signalFollows.get(follow.strategyId)!.push(newFollow);
    return newFollow;
  }

  async deleteSignalFollow(id: number): Promise<void> {
    for (const [strategyId, follows] of this.signalFollows.entries()) {
      const index = follows.findIndex(f => f.id === id);
      if (index !== -1) {
        follows.splice(index, 1);
        return;
      }
    }
  }
}

export const storage = new MemStorage();
