# CHẠM – Numerology & Daily Guidance

Ứng dụng thần số học cung cấp hướng dẫn hằng ngày dựa trên năng lượng cá nhân

## Tính năng chính

- **Onboarding**: Thu thập thông tin cá nhân (họ tên, ngày sinh, giới tính, công việc)
- **Feed Hôm nay/Ngày mai/Tuần/Tháng/Năm:**: Xem năng lượng và lời khuyên theo thời gian
- **To-do & Reminders**: Tạo công việc và nhắc nhở từ gợi ý
- **Tính số Pythagoras**: Life Path, Destiny, Soul Urge, Personality, Birthday, Maturity, Attitude
- **Đa ngôn ngữ:**: Hỗ trợ Tiếng Việt và English

## Kiến trúc

- **Frontend**: React + Vite + TypeScript + TanStack Router + Zustand
- **API**: Node.js + Express + TypeScript
- **Worker**: BullMQ cho job queue
- **Database**: PostgreSQL + Redis
- **Observability**: OpenTelemetry + Prometheus + Grafana

## Cài đặt

### Yêu cầu

- Node.js >= 18
- Docker & Docker Compose
- npm hoặc yarn

### Chạy môi trường dev

```bash
# Clone repo
git clone <repo-url>
cd cham-numerology

# Khởi động services
docker compose up -d postgres redis

# Install dependencies
npm install

# Chạy migrations
npm run migrate

# Seed dữ liệu mẫu
npm run seed

# Khởi động dev servers (API + Frontend)
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:3000

### Chạy với Docker Compose (all-in-one)

```bash
docker compose up --build
```

## Biến môi trường

Tạo file `.env` trong thư mục `api`:

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
# Tạo migration mới
cd api
npm run migration:create -- <migration-name>

# Chạy migrations
npm run migrate

# Rollback migration
npm run migrate:rollback
```

## API Documentation

OpenAPI spec: `/api/docs`

## License

MIT
# TSHL
