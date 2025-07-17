# Trading Dashboard Application

## Overview

This is a React-based trading dashboard application built with TypeScript that provides real-time forex trading capabilities. The application features a modern UI with shadcn/ui components, real-time data streaming via WebSockets, and comprehensive trading analysis tools including technical indicators, pattern detection, and news integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build process
- **Styling**: Tailwind CSS with custom dark theme optimized for trading interfaces
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Real-time Updates**: WebSocket connection for live data streaming

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Real-time Communication**: WebSocket server for pushing live updates
- **API Design**: RESTful API with real-time WebSocket channels
- **Session Management**: Express sessions with PostgreSQL session store

### Key Components

#### Database Schema
The application uses a comprehensive database schema for trading data:
- **forex_pairs**: Currency pair information and real-time prices
- **trading_signals**: AI-generated trading signals with entry/exit points
- **technical_indicators**: RSI, MACD, EMA, SMA, and other technical analysis data
- **candlestick_patterns**: Pattern detection results (doji, hammer, etc.)
- **market_news**: Economic news and events with impact levels
- **active_trades**: Live trading positions with P&L tracking
- **price_data**: Historical price data for charting

#### Frontend Components
- **TradingDashboard**: Main dashboard layout with real-time data
- **LivePriceTicker**: Real-time price updates for forex pairs
- **ActiveSignal**: Current trading signal display with action buttons
- **TechnicalIndicators**: RSI, MACD, and EMA analysis displays
- **InteractiveChart**: Price charts with multiple timeframes
- **PatternDetection**: Candlestick pattern recognition results
- **NewsIntegration**: Economic calendar and news feed
- **TradeMonitoring**: Active trades management and P&L tracking

#### Real-time Features
- WebSocket connections for live price updates
- Automatic data refresh intervals for different data types
- Real-time notifications for trading signals and pattern detection
- Live P&L updates for active trades

### Data Flow

1. **Price Data Flow**: External price feeds → WebSocket server → Client updates
2. **Signal Generation**: Technical analysis → Signal creation → WebSocket broadcast
3. **Pattern Detection**: Price data analysis → Pattern recognition → Client notification
4. **Trade Management**: User actions → API calls → Database updates → Real-time sync

### External Dependencies

#### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` with `drizzle-kit` for database management
- **UI Framework**: Multiple `@radix-ui` components for accessible UI primitives
- **State Management**: `@tanstack/react-query` for server state
- **WebSocket**: `ws` library for real-time communication
- **Date Handling**: `date-fns` for date manipulation
- **Form Handling**: `react-hook-form` with `@hookform/resolvers`

#### Development Dependencies
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint, TypeScript compiler
- **Styling**: Tailwind CSS with PostCSS
- **Development**: `tsx` for TypeScript execution, `esbuild` for production builds

### Deployment Strategy

#### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: Express server with automatic restart via `tsx`
- **Database**: Neon serverless PostgreSQL for development
- **Real-time**: WebSocket server integrated with HTTP server

#### Production Build
- **Frontend**: Vite build process creating optimized static assets
- **Backend**: ESBuild bundling server code for Node.js deployment
- **Database**: PostgreSQL migrations via Drizzle Kit
- **Deployment**: Single server deployment with static file serving

#### Configuration
- **Environment Variables**: `DATABASE_URL` for PostgreSQL connection
- **Build Scripts**: Separate build commands for client and server
- **Database Schema**: Drizzle migrations in `/migrations` directory

The application is designed as a professional trading platform with emphasis on real-time data, technical analysis, and user experience. The architecture supports high-frequency data updates while maintaining responsive UI performance through efficient state management and WebSocket communication.