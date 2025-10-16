# CHáº M - Numerology & Daily Guidance

á»¨ng dá»¥ng tháº§n sá»‘ há»c cung cáº¥p hÆ°á»›ng dáº«n hÃ ng ngÃ y dá»±a trÃªn nÄƒng lÆ°á»£ng ngÃ y cÃ¡ nhÃ¢n.

## TÃ­nh nÄƒng chÃ­nh

- **Onboarding**: Thu tháº­p thÃ´ng tin cÃ¡ nhÃ¢n (há» tÃªn, ngÃ y sinh, giá»›i tÃ­nh, cÃ´ng viá»‡c)
- **Feed HÃ´m nay/NgÃ y mai/Tuáº§n/ThÃ¡ng/NÄƒm**: Xem nÄƒng lÆ°á»£ng vÃ  lá»i khuyÃªn theo thá»i gian
- **To-do & Reminders**: Táº¡o cÃ´ng viá»‡c vÃ  nháº¯c nhá»Ÿ tá»« gá»£i Ã½
- **TÃ­nh sá»‘ Pythagoras**: Life Path, Destiny, Soul Urge, Personality, Birthday, Maturity, Attitude
- **Äa ngÃ´n ngá»¯**: Há»— trá»£ Tiáº¿ng Viá»‡t vÃ  English

## Kiáº¿n trÃºc

- **Frontend**: React + Vite + TypeScript + TanStack Router + Zustand
- **API**: Node.js + Express + TypeScript
- **Worker**: BullMQ cho job queue
- **Database**: PostgreSQL + Redis
- **Observability**: OpenTelemetry + Prometheus + Grafana

## CÃ i Ä‘áº·t

### YÃªu cáº§u

- Node.js >= 18
- Docker & Docker Compose
- npm hoáº·c yarn

### Cháº¡y mÃ´i trÆ°á»ng dev

```bash
# Clone repo
git clone <repo-url>
cd cham-numerology

# Khá»Ÿi Ä‘á»™ng services
docker compose up -d postgres redis

# Install dependencies
npm install

# Cháº¡y migrations
npm run migrate

# Seed dá»¯ liá»‡u máº«u
npm run seed

# Khá»Ÿi Ä‘á»™ng dev servers
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:3000

### Cháº¡y vá»›i Docker Compose

```bash
docker compose up --build
```

## Biáº¿n mÃ´i trÆ°á»ng

Táº¡o file `.env` trong thÆ° má»¥c `api`:

```env
DATABASE_URL=postgresql://cham_user:cham_pass@localhost:5432/cham_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

## Testing

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run Frontend tests only
npm run test:frontend
```

## Migrations

```bash
# Táº¡o migration má»›i
cd api
npm run migration:create -- <migration-name>

# Cháº¡y migrations
npm run migrate

# Rollback migration
npm run migrate:rollback
```

## API Documentation

OpenAPI spec: `/api/docs`

## License

MIT
# TSHL
