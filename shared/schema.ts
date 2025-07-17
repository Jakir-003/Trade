import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // FOREX, CRYPTO
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  change: decimal("change", { precision: 18, scale: 8 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(),
  high: decimal("high", { precision: 18, scale: 8 }).notNull(),
  low: decimal("low", { precision: 18, scale: 8 }).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
  marketCap: decimal("market_cap", { precision: 18, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  pattern: text("pattern").notNull(),
  direction: text("direction").notNull(), // BUY or SELL
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  targetPrice: decimal("target_price", { precision: 10, scale: 5 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }).notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  reasons: jsonb("reasons").notNull(), // array of strings
  rsiValue: decimal("rsi_value", { precision: 5, scale: 2 }),
  macdValue: decimal("macd_value", { precision: 10, scale: 6 }),
  volumeSpike: boolean("volume_spike").default(false),
  newsRisk: text("news_risk").default("LOW"), // LOW, MEDIUM, HIGH
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const technicalIndicators = pgTable("technical_indicators", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  rsi: decimal("rsi", { precision: 5, scale: 2 }),
  macd: decimal("macd", { precision: 10, scale: 6 }),
  macdSignal: decimal("macd_signal", { precision: 10, scale: 6 }),
  macdHistogram: decimal("macd_histogram", { precision: 10, scale: 6 }),
  ema20: decimal("ema20", { precision: 10, scale: 5 }),
  ema50: decimal("ema50", { precision: 10, scale: 5 }),
  ema200: decimal("ema200", { precision: 10, scale: 5 }),
  sma20: decimal("sma20", { precision: 10, scale: 5 }),
  sma50: decimal("sma50", { precision: 10, scale: 5 }),
  adx: decimal("adx", { precision: 5, scale: 2 }),
  bollingerUpper: decimal("bollinger_upper", { precision: 10, scale: 5 }),
  bollingerLower: decimal("bollinger_lower", { precision: 10, scale: 5 }),
  stochastic: decimal("stochastic", { precision: 5, scale: 2 }),
  williamsR: decimal("williams_r", { precision: 5, scale: 2 }),
  atr: decimal("atr", { precision: 10, scale: 5 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const candlestickPatterns = pgTable("candlestick_patterns", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  patternName: text("pattern_name").notNull(),
  patternType: text("pattern_type").notNull(), // BULLISH, BEARISH, NEUTRAL
  confidence: integer("confidence").notNull(), // 0-100
  description: text("description").notNull(),
  status: text("status").notNull(), // ACTIVE, FORMING, WEAK, COMPLETED
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  isValid: boolean("is_valid").default(true),
});

export const marketNews = pgTable("market_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // LOW, MEDIUM, HIGH
  currency: text("currency").notNull(),
  eventTime: timestamp("event_time").notNull(),
  actual: text("actual"),
  forecast: text("forecast"),
  previous: text("previous"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activeTrades = pgTable("active_trades", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  direction: text("direction").notNull(), // BUY or SELL
  timeframe: text("timeframe").notNull(),
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 5 }).notNull(),
  targetPrice: decimal("target_price", { precision: 10, scale: 5 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }).notNull(),
  lotSize: decimal("lot_size", { precision: 5, scale: 2 }).notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }).notNull(),
  pnlPercent: decimal("pnl_percent", { precision: 5, scale: 2 }).notNull(),
  isOpen: boolean("is_open").default(true),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

export const priceData = pgTable("price_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  open: decimal("open", { precision: 18, scale: 8 }).notNull(),
  high: decimal("high", { precision: 18, scale: 8 }).notNull(),
  low: decimal("low", { precision: 18, scale: 8 }).notNull(),
  close: decimal("close", { precision: 18, scale: 8 }).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
});

// NEW ADVANCED FEATURES

// Backtesting System
export const backtestResults = pgTable("backtest_results", {
  id: serial("id").primaryKey(),
  strategyName: text("strategy_name").notNull(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialBalance: decimal("initial_balance", { precision: 18, scale: 2 }).notNull(),
  finalBalance: decimal("final_balance", { precision: 18, scale: 2 }).notNull(),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).notNull(),
  totalTrades: integer("total_trades").notNull(),
  winningTrades: integer("winning_trades").notNull(),
  losingTrades: integer("losing_trades").notNull(),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).notNull(),
  maxDrawdown: decimal("max_drawdown", { precision: 10, scale: 2 }).notNull(),
  sharpeRatio: decimal("sharpe_ratio", { precision: 10, scale: 4 }),
  profitFactor: decimal("profit_factor", { precision: 10, scale: 4 }),
  avgWin: decimal("avg_win", { precision: 18, scale: 2 }),
  avgLoss: decimal("avg_loss", { precision: 18, scale: 2 }),
  parameters: jsonb("parameters").notNull(), // Strategy parameters used
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const backtestTrades = pgTable("backtest_trades", {
  id: serial("id").primaryKey(),
  backtestId: integer("backtest_id").notNull(),
  symbol: text("symbol").notNull(),
  direction: text("direction").notNull(), // BUY or SELL
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 18, scale: 8 }).notNull(),
  quantity: decimal("quantity", { precision: 18, scale: 8 }).notNull(),
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time").notNull(),
  pnl: decimal("pnl", { precision: 18, scale: 2 }).notNull(),
  pnlPercent: decimal("pnl_percent", { precision: 10, scale: 4 }).notNull(),
  commission: decimal("commission", { precision: 18, scale: 2 }).default("0"),
  exitReason: text("exit_reason").notNull(), // TARGET, STOP_LOSS, MANUAL, TIME_LIMIT
});

// Portfolio Tracking
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // For multi-user support
  name: text("name").notNull(),
  description: text("description"),
  totalValue: decimal("total_value", { precision: 18, scale: 2 }).notNull().default("0"),
  totalPnl: decimal("total_pnl", { precision: 18, scale: 2 }).notNull().default("0"),
  totalPnlPercent: decimal("total_pnl_percent", { precision: 10, scale: 4 }).notNull().default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioPositions = pgTable("portfolio_positions", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // FOREX, CRYPTO
  direction: text("direction").notNull(), // LONG, SHORT
  quantity: decimal("quantity", { precision: 18, scale: 8 }).notNull(),
  avgEntryPrice: decimal("avg_entry_price", { precision: 18, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }).notNull(),
  marketValue: decimal("market_value", { precision: 18, scale: 2 }).notNull(),
  unrealizedPnl: decimal("unrealized_pnl", { precision: 18, scale: 2 }).notNull(),
  realizedPnl: decimal("realized_pnl", { precision: 18, scale: 2 }).notNull().default("0"),
  isOpen: boolean("is_open").default(true),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tradeHistory = pgTable("trade_history", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // FOREX, CRYPTO
  direction: text("direction").notNull(), // BUY, SELL
  action: text("action").notNull(), // OPEN, CLOSE, PARTIAL_CLOSE
  quantity: decimal("quantity", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  value: decimal("value", { precision: 18, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 18, scale: 2 }).default("0"),
  pnl: decimal("pnl", { precision: 18, scale: 2 }),
  notes: text("notes"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

// Social Trading Features
export const tradingStrategies = pgTable("trading_strategies", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tags: jsonb("tags").notNull(), // Array of strategy tags
  symbols: jsonb("symbols").notNull(), // Array of trading symbols
  timeframes: jsonb("timeframes").notNull(), // Array of timeframes
  riskLevel: text("risk_level").notNull(), // LOW, MEDIUM, HIGH
  returnPercent: decimal("return_percent", { precision: 10, scale: 2 }),
  maxDrawdown: decimal("max_drawdown", { precision: 10, scale: 2 }),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  followersCount: integer("followers_count").default(0),
  isPublic: boolean("is_public").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sharedSignals = pgTable("shared_signals", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull(),
  userId: text("user_id").notNull(),
  symbol: text("symbol").notNull(),
  direction: text("direction").notNull(), // BUY, SELL
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }).notNull(),
  targetPrice: decimal("target_price", { precision: 18, scale: 8 }),
  stopLoss: decimal("stop_loss", { precision: 18, scale: 8 }),
  confidence: integer("confidence").notNull(), // 0-100
  reasoning: text("reasoning").notNull(),
  tags: jsonb("tags"), // Array of signal tags
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  status: text("status").default("ACTIVE"), // ACTIVE, CLOSED, EXPIRED
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const signalComments = pgTable("signal_comments", {
  id: serial("id").primaryKey(),
  signalId: integer("signal_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"), // For reply threads
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const signalFollows = pgTable("signal_follows", {
  id: serial("id").primaryKey(),
  strategyId: integer("strategy_id").notNull(),
  followerId: text("follower_id").notNull(),
  notificationSettings: jsonb("notification_settings").notNull(), // Email, push, etc.
  isActive: boolean("is_active").default(true),
  followedAt: timestamp("followed_at").defaultNow().notNull(),
});

// Insert schemas
export const insertTradingPairSchema = createInsertSchema(tradingPairs).omit({
  id: true,
  lastUpdated: true,
});

export const insertTradingSignalSchema = createInsertSchema(tradingSignals).omit({
  id: true,
  createdAt: true,
});

export const insertTechnicalIndicatorSchema = createInsertSchema(technicalIndicators).omit({
  id: true,
  lastUpdated: true,
});

export const insertCandlestickPatternSchema = createInsertSchema(candlestickPatterns).omit({
  id: true,
  detectedAt: true,
});

export const insertMarketNewsSchema = createInsertSchema(marketNews).omit({
  id: true,
  createdAt: true,
});

export const insertActiveTradeSchema = createInsertSchema(activeTrades).omit({
  id: true,
  openedAt: true,
});

export const insertPriceDataSchema = createInsertSchema(priceData).omit({
  id: true,
});

// New feature schemas
export const insertBacktestResultSchema = createInsertSchema(backtestResults).omit({
  id: true,
  createdAt: true,
});

export const insertBacktestTradeSchema = createInsertSchema(backtestTrades).omit({
  id: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioPositionSchema = createInsertSchema(portfolioPositions).omit({
  id: true,
  openedAt: true,
  updatedAt: true,
});

export const insertTradeHistorySchema = createInsertSchema(tradeHistory).omit({
  id: true,
  executedAt: true,
});

export const insertTradingStrategySchema = createInsertSchema(tradingStrategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSharedSignalSchema = createInsertSchema(sharedSignals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSignalCommentSchema = createInsertSchema(signalComments).omit({
  id: true,
  createdAt: true,
});

export const insertSignalFollowSchema = createInsertSchema(signalFollows).omit({
  id: true,
  followedAt: true,
});

// Types
export type TradingPair = typeof tradingPairs.$inferSelect;
export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;

export type TradingSignal = typeof tradingSignals.$inferSelect;
export type InsertTradingSignal = z.infer<typeof insertTradingSignalSchema>;

export type TechnicalIndicator = typeof technicalIndicators.$inferSelect;
export type InsertTechnicalIndicator = z.infer<typeof insertTechnicalIndicatorSchema>;

export type CandlestickPattern = typeof candlestickPatterns.$inferSelect;
export type InsertCandlestickPattern = z.infer<typeof insertCandlestickPatternSchema>;

export type MarketNews = typeof marketNews.$inferSelect;
export type InsertMarketNews = z.infer<typeof insertMarketNewsSchema>;

export type ActiveTrade = typeof activeTrades.$inferSelect;
export type InsertActiveTrade = z.infer<typeof insertActiveTradeSchema>;

export type PriceData = typeof priceData.$inferSelect;
export type InsertPriceData = z.infer<typeof insertPriceDataSchema>;

// New feature types
export type BacktestResult = typeof backtestResults.$inferSelect;
export type InsertBacktestResult = z.infer<typeof insertBacktestResultSchema>;

export type BacktestTrade = typeof backtestTrades.$inferSelect;
export type InsertBacktestTrade = z.infer<typeof insertBacktestTradeSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type PortfolioPosition = typeof portfolioPositions.$inferSelect;
export type InsertPortfolioPosition = z.infer<typeof insertPortfolioPositionSchema>;

export type TradeHistory = typeof tradeHistory.$inferSelect;
export type InsertTradeHistory = z.infer<typeof insertTradeHistorySchema>;

export type TradingStrategy = typeof tradingStrategies.$inferSelect;
export type InsertTradingStrategy = z.infer<typeof insertTradingStrategySchema>;

export type SharedSignal = typeof sharedSignals.$inferSelect;
export type InsertSharedSignal = z.infer<typeof insertSharedSignalSchema>;

export type SignalComment = typeof signalComments.$inferSelect;
export type InsertSignalComment = z.infer<typeof insertSignalCommentSchema>;

export type SignalFollow = typeof signalFollows.$inferSelect;
export type InsertSignalFollow = z.infer<typeof insertSignalFollowSchema>;
