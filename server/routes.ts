import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTradingSignalSchema, insertCandlestickPatternSchema, insertMarketNewsSchema, insertActiveTradeSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  isAlive?: boolean;
  subscriptions?: Set<string>;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time data
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Store active WebSocket connections
  const clients = new Set<WebSocketClient>();

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocketClient) => {
    console.log('New WebSocket connection established');
    ws.isAlive = true;
    ws.subscriptions = new Set();
    clients.add(ws);

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'subscribe':
            if (data.channel) {
              ws.subscriptions?.add(data.channel);
              console.log(`Client subscribed to ${data.channel}`);
            }
            break;
          case 'unsubscribe':
            if (data.channel) {
              ws.subscriptions?.delete(data.channel);
              console.log(`Client unsubscribed from ${data.channel}`);
            }
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Heartbeat to keep connections alive
  const heartbeat = setInterval(() => {
    clients.forEach((ws) => {
      if (ws.isAlive === false) {
        clients.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  // Broadcast function
  const broadcast = (channel: string, data: any) => {
    const message = JSON.stringify({ channel, data });
    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN && ws.subscriptions?.has(channel)) {
        ws.send(message);
      }
    });
  };

  // REST API Routes

  // Trading pairs endpoints (Forex + Crypto)
  app.get("/api/trading-pairs", async (req, res) => {
    try {
      const pairs = await storage.getTradingPairs();
      res.json(pairs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading pairs" });
    }
  });

  app.get("/api/trading-pairs/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const pairs = await storage.getTradingPairsByType(type.toUpperCase());
      res.json(pairs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading pairs by type" });
    }
  });

  // Keep backwards compatibility for existing frontend
  app.get("/api/forex-pairs", async (req, res) => {
    try {
      const pairs = await storage.getTradingPairs();
      res.json(pairs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forex pairs" });
    }
  });

  app.get('/api/forex-pairs/:symbol', async (req, res) => {
    try {
      const pair = await storage.getTradingPair(req.params.symbol);
      if (!pair) {
        return res.status(404).json({ error: 'Forex pair not found' });
      }
      res.json(pair);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forex pair' });
    }
  });

  // Trading signals
  app.get('/api/signals', async (req, res) => {
    try {
      const signals = await storage.getActiveSignals();
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch signals' });
    }
  });

  app.post('/api/signals', async (req, res) => {
    try {
      const validatedData = insertTradingSignalSchema.parse(req.body);
      const signal = await storage.createSignal(validatedData);
      
      // Broadcast new signal to WebSocket clients
      broadcast('signals', { type: 'new_signal', signal });
      
      res.status(201).json(signal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create signal' });
    }
  });

  app.put('/api/signals/:id/deactivate', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deactivateSignal(id);
      
      // Broadcast signal deactivation
      broadcast('signals', { type: 'signal_deactivated', id });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to deactivate signal' });
    }
  });

  // Technical indicators
  app.get('/api/indicators/:symbol/:timeframe', async (req, res) => {
    try {
      const { symbol, timeframe } = req.params;
      const indicators = await storage.getIndicators(symbol, timeframe);
      if (!indicators) {
        return res.status(404).json({ error: 'Indicators not found' });
      }
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch indicators' });
    }
  });

  // Candlestick patterns
  app.get('/api/patterns', async (req, res) => {
    try {
      const patterns = await storage.getActivePatterns();
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patterns' });
    }
  });

  app.get('/api/patterns/:symbol', async (req, res) => {
    try {
      const patterns = await storage.getPatternsBySymbol(req.params.symbol);
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patterns' });
    }
  });

  app.post('/api/patterns', async (req, res) => {
    try {
      const validatedData = insertCandlestickPatternSchema.parse(req.body);
      const pattern = await storage.createPattern(validatedData);
      
      // Broadcast new pattern
      broadcast('patterns', { type: 'new_pattern', pattern });
      
      res.status(201).json(pattern);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create pattern' });
    }
  });

  // Market news
  app.get('/api/news', async (req, res) => {
    try {
      const news = await storage.getActiveNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  });

  app.post('/api/news', async (req, res) => {
    try {
      const validatedData = insertMarketNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      
      // Broadcast new news
      broadcast('news', { type: 'new_news', news });
      
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create news' });
    }
  });

  // Active trades
  app.get('/api/trades', async (req, res) => {
    try {
      const trades = await storage.getActiveTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trades' });
    }
  });

  app.post('/api/trades', async (req, res) => {
    try {
      const validatedData = insertActiveTradeSchema.parse(req.body);
      const trade = await storage.createTrade(validatedData);
      
      // Broadcast new trade
      broadcast('trades', { type: 'new_trade', trade });
      
      res.status(201).json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create trade' });
    }
  });

  app.put('/api/trades/:id/close', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.closeTrade(id);
      
      // Broadcast trade closure
      broadcast('trades', { type: 'trade_closed', id });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to close trade' });
    }
  });

  // Price data
  app.get('/api/price-data/:symbol/:timeframe', async (req, res) => {
    try {
      const { symbol, timeframe } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const priceData = await storage.getPriceData(symbol, timeframe, limit);
      res.json(priceData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch price data' });
    }
  });

  // External API integration endpoints
  app.post('/api/fetch-forex-data', async (req, res) => {
    try {
      // Simulate updating trading data for both forex and crypto
      const pairs = await storage.getTradingPairs();
      
      for (const pair of pairs) {
        const priceChange = pair.type === "CRYPTO" 
          ? (Math.random() - 0.5) * parseFloat(pair.price) * 0.05 // 5% max change for crypto
          : (Math.random() - 0.5) * 0.01; // Small change for forex
        
        const newPrice = (parseFloat(pair.price) + priceChange).toFixed(pair.type === "CRYPTO" ? 2 : 5);
        const change = (parseFloat(newPrice) - parseFloat(pair.price)).toFixed(pair.type === "CRYPTO" ? 2 : 5);
        const changePercent = ((parseFloat(change) / parseFloat(pair.price)) * 100).toFixed(2);
        
        await storage.updateTradingPair(pair.symbol, {
          price: newPrice,
          change: change,
          changePercent: changePercent,
        });
        
        // Broadcast price update
        broadcast('prices', {
          type: 'price_update',
          symbol: pair.symbol,
          price: newPrice,
          change: change,
          changePercent: changePercent,
        });
      }
      
      res.json({ success: true, message: 'Trading data updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forex data' });
    }
  });

  // Backtesting endpoints
  app.get("/api/backtests", async (req, res) => {
    try {
      const results = await storage.getBacktestResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch backtest results" });
    }
  });

  app.get("/api/backtests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.getBacktestResult(parseInt(id));
      if (!result) {
        return res.status(404).json({ error: "Backtest not found" });
      }
      const trades = await storage.getBacktestTrades(parseInt(id));
      res.json({ ...result, trades });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch backtest details" });
    }
  });

  app.post("/api/backtests", async (req, res) => {
    try {
      const result = await storage.createBacktestResult(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create backtest" });
    }
  });

  app.delete("/api/backtests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBacktestResult(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete backtest" });
    }
  });

  // Portfolio endpoints
  app.get("/api/portfolios", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const portfolios = await storage.getPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolios" });
    }
  });

  app.get("/api/portfolios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await storage.getPortfolio(parseInt(id));
      if (!portfolio) {
        return res.status(404).json({ error: "Portfolio not found" });
      }
      const positions = await storage.getPortfolioPositions(parseInt(id));
      const history = await storage.getTradeHistory(parseInt(id));
      res.json({ ...portfolio, positions, history });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio details" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const portfolio = await storage.createPortfolio(req.body);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to create portfolio" });
    }
  });

  app.put("/api/portfolios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await storage.updatePortfolio(parseInt(id), req.body);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to update portfolio" });
    }
  });

  // Social Trading endpoints
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getTradingStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading strategies" });
    }
  });

  app.get("/api/strategies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const strategy = await storage.getTradingStrategy(parseInt(id));
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      const signals = await storage.getSharedSignalsByStrategy(parseInt(id));
      const follows = await storage.getSignalFollows(parseInt(id));
      res.json({ ...strategy, signals, follows });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch strategy details" });
    }
  });

  app.post("/api/strategies", async (req, res) => {
    try {
      const strategy = await storage.createTradingStrategy(req.body);
      res.json(strategy);
    } catch (error) {
      res.status(500).json({ error: "Failed to create strategy" });
    }
  });

  app.get("/api/shared-signals", async (req, res) => {
    try {
      const signals = await storage.getSharedSignals();
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shared signals" });
    }
  });

  app.post("/api/shared-signals", async (req, res) => {
    try {
      const signal = await storage.createSharedSignal(req.body);
      res.json(signal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shared signal" });
    }
  });

  app.get("/api/shared-signals/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getSignalComments(parseInt(id));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch signal comments" });
    }
  });

  app.post("/api/shared-signals/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await storage.createSignalComment({
        ...req.body,
        signalId: parseInt(id),
      });
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Start periodic data updates
  setInterval(async () => {
    try {
      // Trigger forex data update every 30 seconds
      const response = await fetch('http://localhost:5000/api/fetch-forex-data', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error in periodic data update:', error);
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeat);
  });

  return httpServer;
}
