# CandleBot Deployment Guide

This guide covers different deployment options for the CandleBot Trading Assistant.

## 🚀 Quick Deployment Options

### 1. Replit Deployment (Recommended for Beginners)
**Easiest option - One-click deployment**

1. Fork this repository on Replit
2. Click the "Deploy" button in your Replit project
3. Your app will be live at `your-project-name.replit.app`

**Pros:**
- Zero configuration required
- Automatic SSL certificate
- Built-in CI/CD
- Free tier available

**Cons:**
- Limited customization
- Replit-specific domain

### 2. Vercel Deployment
**Great for frontend + serverless backend**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

**Configuration (`vercel.json`):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

### 3. Netlify Deployment
**Frontend focus with serverless functions**

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir client/dist
   ```

**Configuration (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "client/dist"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Railway Deployment
**Full-stack with database support**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   railway login
   railway link
   railway up
   ```

**Configuration (`railway.toml`):**
```toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  healthcheckPath = "/api/health"
  healthcheckTimeout = 300

[env]
  NODE_ENV = "production"
```

### 5. Docker Deployment
**Containerized deployment for any platform**

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

**Docker Compose (`docker-compose.yml`):**
```yaml
version: '3.8'

services:
  candlebot:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=candlebot
      - POSTGRES_USER=trader
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

**Deploy with Docker:**
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f candlebot
```

## 🗄️ Database Setup

### PostgreSQL (Production)
1. **Neon (Recommended):**
   ```bash
   # Get connection string from Neon dashboard
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

2. **Local PostgreSQL:**
   ```bash
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib

   # Create database
   sudo -u postgres createdb candlebot

   # Create user
   sudo -u postgres createuser --interactive trader
   ```

3. **Run migrations:**
   ```bash
   npm run db:push
   ```

### SQLite (Development)
```bash
# Automatic - no setup required
# Database file created at ./data/candlebot.db
```

## 🔐 Environment Variables

Create `.env.production`:
```env
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/candlebot

# API Keys (Optional)
ALPHA_VANTAGE_API_KEY=your_api_key
FOREX_API_KEY=your_forex_key
TWELVE_DATA_API_KEY=your_twelve_data_key

# Security
SESSION_SECRET=your_secure_random_string
JWT_SECRET=your_jwt_secret

# CORS (if needed)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# WebSocket
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000
```

## 📊 Performance Optimization

### 1. Caching Strategy
```typescript
// Redis caching for price data
const redis = new Redis(process.env.REDIS_URL);

// Cache forex prices for 30 seconds
await redis.setex(`price:${symbol}`, 30, JSON.stringify(priceData));
```

### 2. Database Optimization
```sql
-- Add indexes for better query performance
CREATE INDEX idx_trading_signals_symbol ON trading_signals(symbol);
CREATE INDEX idx_trading_signals_created_at ON trading_signals(created_at);
CREATE INDEX idx_price_data_symbol_timestamp ON price_data(symbol, timestamp);
```

### 3. CDN Configuration
```javascript
// Serve static assets from CDN
const CDN_BASE = process.env.CDN_URL || '';

// In production, use CDN for assets
const assetUrl = (path) => {
  return NODE_ENV === 'production' ? `${CDN_BASE}${path}` : path;
};
```

## 🔍 Monitoring & Logging

### 1. Health Check Endpoint
```typescript
// Add to server/routes.ts
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

### 2. Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/node @sentry/tracing
```

```typescript
// Configure Sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Log Management
```typescript
// Use structured logging
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
```

## 🔒 Security Hardening

### 1. HTTPS Configuration
```javascript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

### 2. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 3. Security Headers
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 📈 Scaling Considerations

### 1. Load Balancing
```nginx
# Nginx configuration
upstream candlebot {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://candlebot;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. WebSocket Scaling
```typescript
// Use Redis for WebSocket scaling
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### 3. Database Scaling
```sql
-- Read replicas for better performance
-- Master-slave configuration
-- Connection pooling
```

## 🛠️ Deployment Checklist

### Pre-deployment
- [ ] Run all tests (`npm test`)
- [ ] Check TypeScript compilation (`npm run check`)
- [ ] Build successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate configured
- [ ] Monitoring setup

### Post-deployment
- [ ] Health check endpoint accessible
- [ ] WebSocket connections working
- [ ] Real-time data streaming
- [ ] Error tracking operational
- [ ] Performance monitoring active
- [ ] Backup strategy implemented

## 🆘 Troubleshooting

### Common Issues

**1. WebSocket Connection Failed**
```typescript
// Check CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

**2. Database Connection Error**
```bash
# Verify connection string
npx drizzle-kit push --verbose

# Check network connectivity
ping your-db-host.com
```

**3. Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for version conflicts
npm ls
```

**4. Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy CandleBot

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          npm run deploy
```

---

**Ready to deploy your CandleBot? Choose the option that best fits your needs and technical expertise!**