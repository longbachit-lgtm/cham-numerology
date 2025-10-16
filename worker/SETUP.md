# CHáº M - Numerology & Daily Guidance

## ðŸŽ¯ Tá»•ng quan dá»± Ã¡n

CHáº M lÃ  á»©ng dá»¥ng tháº§n sá»‘ há»c cung cáº¥p hÆ°á»›ng dáº«n hÃ ng ngÃ y dá»±a trÃªn nÄƒng lÆ°á»£ng ngÃ y cÃ¡ nhÃ¢n theo há»‡ thá»‘ng Pythagoras.

### TÃ­nh nÄƒng chÃ­nh

âœ… **Onboarding 4 bÆ°á»›c**: Thu tháº­p thÃ´ng tin cÃ¡ nhÃ¢n (há» tÃªn, ngÃ y sinh, giá»›i tÃ­nh, cÃ´ng viá»‡c)
âœ… **Feed Ä‘a thá»i gian**: HÃ´m nay, NgÃ y mai, Tuáº§n, ThÃ¡ng, NÄƒm
âœ… **To-do & Reminders**: Táº¡o cÃ´ng viá»‡c vÃ  nháº¯c nhá»Ÿ tá»« gá»£i Ã½ hÃ nh Ä‘á»™ng
âœ… **TÃ­nh sá»‘ Pythagoras**: Life Path, Destiny, Soul Urge, Personality, Birthday, Maturity, Attitude
âœ… **Äa ngÃ´n ngá»¯**: Há»— trá»£ Tiáº¿ng Viá»‡t vÃ  English
âœ… **Content Templates**: Há»‡ thá»‘ng ná»™i dung linh hoáº¡t theo sá»‘ vÃ  ngÃ´n ngá»¯

## ðŸ—ï¸ Kiáº¿n trÃºc

```
cham-numerology/
â”œâ”€â”€ api/                    # Node.js + Express + TypeScript
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ db/            # Database connection & migrations
â”‚   â”‚   â”œâ”€â”€ routes/        # API routes
â”‚   â”‚   â”œâ”€â”€ services/      # Business logic
â”‚   â”‚   â”œâ”€â”€ middleware/    # Auth, logging, rate limiting
â”‚   â”‚   â””â”€â”€ index.ts       # Server entry point
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ frontend/              # React + Vite + TypeScript
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/    # React components
â”‚   â”‚   â”œâ”€â”€ pages/         # Page components
â”‚   â”‚   â”œâ”€â”€ store/         # Zustand state management
â”‚   â”‚   â”œâ”€â”€ services/      # API client
â”‚   â”‚   â””â”€â”€ App.tsx
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ worker/                # BullMQ worker
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â””â”€â”€ index.ts       # Worker for reminders & feed precompute
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ infra/                 # Infrastructure (future)
â”œâ”€â”€ docker-compose.yml     # Docker Compose config
â”œâ”€â”€ openapi.yaml          # API specification
â””â”€â”€ README.md
```

### Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Zustand, React Router
- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Redis
- **Worker**: BullMQ
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Observability**: Correlation IDs, structured logging

## ðŸš€ CÃ i Ä‘áº·t vÃ  Cháº¡y

### YÃªu cáº§u

- Node.js >= 18
- Docker & Docker Compose
- npm hoáº·c yarn

### BÆ°á»›c 1: Clone vÃ  cÃ i Ä‘áº·t

```bash
cd cham-numerology

# Copy environment variables
cp .env.example api/.env
cp .env.example worker/.env

# Install dependencies (náº¿u khÃ´ng dÃ¹ng Docker)
npm install
cd api && npm install && cd ..
cd frontend && npm install && cd ..
cd worker && npm install && cd ..
```

### BÆ°á»›c 2: Khá»Ÿi Ä‘á»™ng vá»›i Docker Compose

```bash
# Khá»Ÿi Ä‘á»™ng táº¥t cáº£ services
docker compose up -d

# Xem logs
docker compose logs -f

# Dá»«ng services
docker compose down
```

### BÆ°á»›c 3: Cháº¡y migrations vÃ  seed data

```bash
# Cháº¡y migrations
docker compose exec api npm run migrate

# Seed dá»¯ liá»‡u máº«u (content templates)
docker compose exec api npm run seed
```

### BÆ°á»›c 4: Truy cáº­p á»©ng dá»¥ng

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Health check**: http://localhost:3000/health

## ðŸ› ï¸ Development (khÃ´ng dÃ¹ng Docker)

### Khá»Ÿi Ä‘á»™ng PostgreSQL vÃ  Redis

```bash
docker compose up -d postgres redis
```

### Cháº¡y API

```bash
cd api
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

### Cháº¡y Frontend

```bash
cd frontend
npm install
npm run dev
```

### Cháº¡y Worker

```bash
cd worker
cp .env.example .env
npm install
npm run dev
```

## ðŸ“Š Database Schema

### CÃ¡c báº£ng chÃ­nh

- **users**: ThÃ´ng tin Ä‘Äƒng nháº­p
- **profiles**: ThÃ´ng tin cÃ¡ nhÃ¢n (tÃªn, ngÃ y sinh, giá»›i tÃ­nh, cÃ´ng viá»‡c)
- **numerology_core**: CÃ¡c sá»‘ tháº§n sá»‘ há»c cá»‘t lÃµi
- **daily_feed**: Cache feed hÃ ng ngÃ y
- **todos**: Danh sÃ¡ch cÃ´ng viá»‡c
- **reminders**: Nháº¯c nhá»Ÿ
- **content_templates**: Ná»™i dung Ä‘a ngÃ´n ngá»¯ theo sá»‘

## ðŸ§® Thuáº­t toÃ¡n Tháº§n sá»‘ há»c

### CÃ¡c sá»‘ Ä‘Æ°á»£c tÃ­nh toÃ¡n

1. **Life Path** (ÄÆ°á»ng Ä‘á»i): Tá»•ng rÃºt gá»n ngÃ y sinh (giá»¯ master 11/22/33)
2. **Destiny** (Äá»‹nh má»‡nh): Tá»•ng giÃ¡ trá»‹ chá»¯ cÃ¡i há» tÃªn
3. **Soul Urge** (Linh há»“n): Tá»•ng nguyÃªn Ã¢m trong tÃªn
4. **Personality** (NhÃ¢n cÃ¡ch): Tá»•ng phá»¥ Ã¢m trong tÃªn
5. **Birthday** (NgÃ y sinh): NgÃ y trong thÃ¡ng rÃºt gá»n
6. **Maturity** (TrÆ°á»Ÿng thÃ nh): Life Path + Destiny
7. **Attitude** (ThÃ¡i Ä‘á»™): NgÃ y + ThÃ¡ng sinh
8. **Personal Year/Month/Day**: TÃ­nh theo nÄƒm/thÃ¡ng/ngÃ y hiá»‡n táº¡i

### Quy táº¯c rÃºt gá»n

- Cá»™ng cÃ¡c chá»¯ sá»‘ cho Ä‘áº¿n khi cÃ²n 1 chá»¯ sá»‘
- Giá»¯ nguyÃªn master numbers: 11, 22, 33
- Ãnh xáº¡ chá»¯ cÃ¡i: A=1, B=2, ..., I=9, J=1, K=2, ...

## ðŸ“± Luá»“ng sá»­ dá»¥ng

### 1. Onboarding (4 bÆ°á»›c)

1. **ÄÄƒng nháº­p/ÄÄƒng kÃ½** (cÃ³ thá»ƒ bá» qua trong v1)
2. **Nháº­p há» tÃªn** + quote cáº£m há»©ng
3. **Nháº­p ngÃ y sinh** + giá»›i tÃ­nh
4. **Nháº­p cÃ´ng viá»‡c** (tÃ¹y chá»n)
5. **TÃ­nh toÃ¡n** â†’ Chuyá»ƒn Ä‘áº¿n Dashboard

### 2. Dashboard

- **Tab HÃ´m nay**: NÄƒng lÆ°á»£ng ngÃ y, máº¹o nhanh, thÃ¡ch thá»©c & cÆ¡ há»™i, hÃ nh Ä‘á»™ng gá»£i Ã½ (4 thá»i Ä‘iá»ƒm), cÃ¢u nÃ³i Ä‘á»™ng viÃªn
- **Tab NgÃ y mai**: Xem trÆ°á»›c nÄƒng lÆ°á»£ng ngÃ y mai
- **Tab Tuáº§n/ThÃ¡ng/NÄƒm**: Tá»•ng quan theo ká»³
- **Tab To-do**: Quáº£n lÃ½ cÃ´ng viá»‡c, Ä‘áº·t nháº¯c nhá»Ÿ

### 3. Táº¡o To-do tá»« gá»£i Ã½

- Click nÃºt "+" bÃªn cáº¡nh hÃ nh Ä‘á»™ng gá»£i Ã½
- Tá»± Ä‘á»™ng táº¡o todo vá»›i source_tag
- CÃ³ thá»ƒ Ä‘áº·t nháº¯c nhá»Ÿ (10:00, 14:00, 20:00)

## ðŸ” Báº£o máº­t

- JWT authentication vá»›i refresh rotation
- Password hashing vá»›i bcrypt (10 rounds)
- Rate limiting trÃªn /auth/* vÃ  /feed/*
- PII redaction trong logs
- CORS vÃ  Helmet middleware
- Input validation vá»›i Zod

## ðŸ“ˆ Observability

- Correlation ID cho má»i request
- Structured logging
- Request duration tracking
- Error tracking vá»›i stack traces
- Health check endpoint

## ðŸ§ª Testing

```bash
# Run all tests
npm test

# API tests
cd api && npm test

# Frontend tests
cd frontend && npm test
```

## ðŸ“ API Documentation

OpenAPI spec: `openapi.yaml`

Xem táº¡i: http://localhost:3000/api/docs (sau khi implement Swagger UI)

## ðŸ”„ CI/CD (Future)

- GitHub Actions cho lint, test, build
- Docker image build vÃ  push
- Preview environments
- Canary deployments vá»›i auto-rollback

## ðŸ“¦ Deployment

### Production checklist

- [ ] Äá»•i JWT_SECRET
- [ ] Cáº¥u hÃ¬nh DATABASE_URL production
- [ ] Cáº¥u hÃ¬nh REDIS_URL production
- [ ] Enable HTTPS
- [ ] Setup monitoring (Prometheus + Grafana)
- [ ] Setup error tracking (Sentry)
- [ ] Configure backups
- [ ] Setup CDN cho assets
- [ ] Rate limiting production values

## ðŸ¤ Contributing

1. Fork repo
2. Táº¡o feature branch
3. Commit changes
4. Push vÃ  táº¡o Pull Request

## ðŸ“„ License

MIT License

## ðŸ‘¥ Team

Dá»± Ã¡n Ä‘Æ°á»£c phÃ¡t triá»ƒn bá»Ÿi Claude Code 4.5 theo spec tá»« tÃ i liá»‡u thiáº¿t káº¿.

---

**LÆ°u Ã½**: ÄÃ¢y lÃ  MVP version 1. CÃ¡c tÃ­nh nÄƒng nhÆ° thanh toÃ¡n, máº¡ng xÃ£ há»™i, Ä‘á»“ng bá»™ lá»‹ch sáº½ Ä‘Æ°á»£c thÃªm vÃ o cÃ¡c phiÃªn báº£n sau.
