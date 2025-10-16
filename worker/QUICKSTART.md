# CHáº M - Numerology & Daily Guidance

## âš¡ Quick Start

```bash
# 1. Khá»Ÿi Ä‘á»™ng services
docker compose up -d postgres redis

# 2. Setup API
cd api
npm install
npm run migrate
npm run seed
npm run dev

# 3. Setup Frontend (terminal má»›i)
cd frontend
npm install
npm run dev

# 4. Setup Worker (terminal má»›i)
cd worker
npm install
npm run dev
```

Truy cáº­p: http://localhost:5173

## ðŸ“ Cáº¥u trÃºc dá»± Ã¡n

```
cham-numerology/
â”œâ”€â”€ api/                 âœ… Node.js + Express API
â”œâ”€â”€ frontend/            âœ… React + Vite Frontend
â”œâ”€â”€ worker/              âœ… BullMQ Worker
â”œâ”€â”€ docker-compose.yml   âœ… Docker setup
â”œâ”€â”€ openapi.yaml         âœ… API spec
â”œâ”€â”€ SETUP.md             âœ… HÆ°á»›ng dáº«n chi tiáº¿t
â””â”€â”€ README.md            âœ… Tá»•ng quan
```

## âœ¨ TÃ­nh nÄƒng Ä‘Ã£ implement

âœ… Onboarding 4 bÆ°á»›c (Login â†’ Name â†’ DOB â†’ Job â†’ Complete)
âœ… Dashboard vá»›i 6 tabs (Today, Tomorrow, Week, Month, Year, Todos)
âœ… TÃ­nh sá»‘ Pythagoras (Life Path, Destiny, Soul, Personality, etc.)
âœ… Feed system vá»›i content templates
âœ… Todo & Reminder system
âœ… Worker cho background jobs
âœ… Database schema & migrations
âœ… API vá»›i auth, rate limiting, logging
âœ… Responsive UI vá»›i TailwindCSS
âœ… State management vá»›i Zustand

## ðŸŽ¯ API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/profile
- PUT /api/profile
- POST /api/profile/compute-numerology
- GET /api/feed/today
- GET /api/feed/next
- GET /api/feed/period?scope=week|month|year
- GET /api/todos
- POST /api/todos
- PATCH /api/todos/:id
- DELETE /api/todos/:id
- POST /api/todos/reminders

## ðŸ”§ Environment Variables

Táº¡o file `.env` trong thÆ° má»¥c `api/`:

```env
DATABASE_URL=postgresql://cham_user:cham_pass@localhost:5432/cham_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3000
```

## ðŸ“Š Database

PostgreSQL vá»›i cÃ¡c báº£ng:
- users, profiles
- numerology_core
- daily_feed
- todos, reminders
- content_templates
- audit_logs

## ðŸŽ¨ UI Components

- LoginPage
- OnboardingNamePage, OnboardingDOBPage, OnboardingJobPage, OnboardingCompletePage
- DashboardPage
- TodayTab, TomorrowTab, PeriodTab, TodosTab

## ðŸ“š Docs

Xem `SETUP.md` Ä‘á»ƒ biáº¿t hÆ°á»›ng dáº«n chi tiáº¿t vá»:
- CÃ i Ä‘áº·t vÃ  cáº¥u hÃ¬nh
- Kiáº¿n trÃºc há»‡ thá»‘ng
- Thuáº­t toÃ¡n tháº§n sá»‘ há»c
- API documentation
- Testing vÃ  deployment

## ðŸš€ Next Steps

1. Cháº¡y `docker compose up -d` Ä‘á»ƒ khá»Ÿi Ä‘á»™ng DB vÃ  Redis
2. Cháº¡y migrations: `cd api && npm run migrate`
3. Seed data: `npm run seed`
4. Khá»Ÿi Ä‘á»™ng dev servers
5. Truy cáº­p http://localhost:5173

ChÃºc báº¡n code vui váº»! ðŸŽ‰
