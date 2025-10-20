# Debug getContentTemplates

## Bước 1: Kiểm tra database có data không

Chạy lệnh này trong container postgres:

```bash
docker exec -it <postgres_container_id> psql -U cham_user -d cham_db -c "SELECT COUNT(*) FROM content_templates;"
```

Nếu result = 0, nghĩa là chưa có data.

## Bước 2: Chạy seed để thêm data

```bash
cd api
npm run seed
# hoặc
npx tsx src/db/seed.ts
```

## Bước 3: Test lại query

Thêm log để debug trong `content.service.ts`:

```typescript
console.log('Query params:', { number, scope, lang });
console.log('Query result rows:', result.rows);
console.log('Query rowCount:', result.rowCount);
```

## Lỗi thường gặp:

1. **Number type mismatch**: Database lưu `number` là TEXT, đảm bảo truyền vào là string "1", "2", không phải number 1, 2
2. **Scope/lang không khớp**: Phải đúng "day", "vi" hoặc "en"
3. **Database chưa migrate**: Chạy `npm run migrate` trước


