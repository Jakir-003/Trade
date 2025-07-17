# CandleBot - Smart Forex Trading Assistant

A comprehensive React-based trading dashboard application that provides real-time forex trading capabilities with advanced technical analysis and pattern detection.

![CandleBot Preview](https://via.placeholder.com/800x400/1a1a1a/00ff88?text=CandleBot+Trading+Dashboard)

## 🚀 Features

### Real-Time Trading System
- **Live Forex Feeds**: Real-time price updates for major currency pairs (EURUSD, GBPUSD, USDJPY, AUDUSD)
- **WebSocket Integration**: Instant data streaming with automatic reconnection
- **Auto-refresh**: Price updates every 30 seconds

### Advanced Signal Detection
- **61 Candlestick Patterns**: Complete pattern recognition including Doji, Hammer, Engulfing, Inside Bar, Pin Bar, and more
- **Technical Indicators**: RSI, MACD, EMA crossovers, Bollinger Bands, Stochastic, ADX, ATR
- **Signal Analysis**: AI-powered confidence scoring with risk assessment

### Exit Monitoring System
- **Real-time P&L Tracking**: Live profit/loss monitoring for all open positions
- **Stop-loss Detection**: Automatic alerts when trades breach stop-loss levels
- **Trend Reversal Alerts**: Immediate notifications when technical indicators signal exits
- **Negative Trade Alerts**: Instant warnings when trades turn negative

### Professional Interface
- **Dark Trading Theme**: Optimized for extended trading sessions
- **Mobile Responsive**: Full functionality on desktop, tablet, and mobile
- **Interactive Charts**: Price visualization with pattern highlights and trade levels
- **Real-time Notifications**: Toast alerts for important trading events

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom trading theme
- **Shadcn/UI** components with Radix UI primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend
- **Node.js** with Express.js
- **WebSocket** server for real-time communication
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL schema

### Real-time Features
- **WebSocket Connections** for live data streaming
- **Automatic Reconnection** with heartbeat monitoring
- **Multi-channel Subscriptions** (prices, signals, patterns, news, trades)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jakir9999/CandleBot-Trading-Assistant.git
   cd CandleBot-Trading-Assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5000`

## 🚀 Usage

### Getting Started
1. Launch the application and view the live forex dashboard
2. Monitor real-time price feeds in the ticker
3. Watch for trading signals in the active signal panel
4. Review technical indicators for market analysis
5. Check pattern detection for candlestick formations

### Taking Trades
1. When a signal appears, review the analysis and confidence score
2. Click "Take This Trade" to open a position
3. Monitor your trade in the Active Trades section
4. Receive automatic alerts if the trade goes negative
5. Close trades manually or wait for automatic exit signals

### Exit Monitoring
- The system continuously monitors all open trades
- Automatic alerts when trades hit stop-loss levels
- Trend reversal detection using multiple indicators
- Real-time P&L updates every 15-30 seconds

## 📊 Trading Features

### Supported Currency Pairs
- EUR/USD (Euro / US Dollar)
- GBP/USD (British Pound / US Dollar)
- USD/JPY (US Dollar / Japanese Yen)
- AUD/USD (Australian Dollar / US Dollar)

### Technical Indicators
- **RSI (14)**: Relative Strength Index with overbought/oversold levels
- **MACD**: Moving Average Convergence Divergence with signal line
- **EMA Crossover**: 20 vs 50 period exponential moving averages
- **Bollinger Bands**: Price volatility analysis
- **Stochastic**: Momentum oscillator
- **ADX**: Average Directional Index for trend strength
- **ATR**: Average True Range for volatility measurement

### Candlestick Patterns
- Single Candle: Doji, Hammer, Hanging Man, Shooting Star, Pin Bar
- Double Candle: Bullish/Bearish Engulfing, Inside Bar
- Triple Candle: Morning Star, Evening Star, Three White Soldiers
- And 50+ additional patterns for comprehensive analysis

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Keys (Optional - for real data feeds)
ALPHA_VANTAGE_API_KEY=your_api_key_here
FOREX_API_KEY=your_forex_api_key_here

# Database (Optional - uses in-memory storage by default)
DATABASE_URL=your_postgresql_url_here

# Development
NODE_ENV=development
PORT=5000
```

### Customization
- Modify timeframes in `client/src/components/InteractiveChart.tsx`
- Add new currency pairs in `server/storage.ts`
- Customize trading signals in `client/src/lib/trading-analysis.ts`
- Adjust pattern detection sensitivity in `client/src/lib/pattern-detection.ts`

## 📁 Project Structure

```
CandleBot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Trading algorithms and utilities
│   │   └── pages/          # Application pages
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket handling
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared types and schemas
└── package.json           # Dependencies and scripts
```

## 🎯 API Endpoints

### REST API
- `GET /api/forex-pairs` - Get all currency pairs
- `GET /api/signals` - Get active trading signals
- `GET /api/indicators/:symbol/:timeframe` - Get technical indicators
- `GET /api/patterns` - Get detected candlestick patterns
- `GET /api/news` - Get market news and events
- `GET /api/trades` - Get active trades
- `POST /api/trades` - Open a new trade
- `PUT /api/trades/:id/close` - Close a trade

### WebSocket Channels
- `prices` - Real-time price updates
- `signals` - New trading signals
- `patterns` - Pattern detection updates
- `news` - Market news alerts
- `trades` - Trade status changes

## 🔒 Risk Management

### Built-in Safety Features
- **Stop-loss Protection**: Automatic exit when predefined loss levels are reached
- **Risk/Reward Calculation**: Pre-trade analysis of potential profit vs loss
- **Position Sizing**: Recommended lot sizes based on account risk
- **News Impact Analysis**: Market event risk assessment
- **Confidence Scoring**: Signal reliability measurement (0-100%)

### Best Practices
- Never risk more than 1-2% of your account per trade
- Always use stop-loss orders
- Monitor news events that may affect your currency pairs
- Review technical confluence before taking trades
- Keep a trading journal for performance analysis

## 🚧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

### Adding New Features
1. **New Patterns**: Add detection logic in `client/src/lib/pattern-detection.ts`
2. **New Indicators**: Implement calculations in `client/src/lib/technical-indicators.ts`
3. **New Data Sources**: Integrate APIs in `server/routes.ts`
4. **New UI Components**: Create in `client/src/components/`

## 📈 Roadmap

### Upcoming Features
- [ ] Real API integration (Alpha Vantage, Twelve Data)
- [ ] Push notifications for mobile devices
- [ ] Sound alerts for critical signals
- [ ] Backtesting functionality
- [ ] Multiple timeframe analysis
- [ ] Custom strategy builder
- [ ] User account management
- [ ] Trade history and analytics
- [ ] Risk management calculator
- [ ] Economic calendar integration

### Performance Improvements
- [ ] Chart optimization with TradingView widgets
- [ ] Database migration from in-memory to PostgreSQL
- [ ] Caching layer for frequently accessed data
- [ ] WebSocket message compression
- [ ] Progressive Web App (PWA) support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is for educational and informational purposes only. Trading forex involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. Always consult with a qualified financial advisor before making investment decisions.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Jakir9999/CandleBot-Trading-Assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Jakir9999/CandleBot-Trading-Assistant/discussions)
- **Documentation**: [Wiki](https://github.com/Jakir9999/CandleBot-Trading-Assistant/wiki)

---

**Built with ❤️ for the trading community**

*Remember: The best trade is sometimes no trade. Always trade responsibly.*