# Movie Rating Service — Backend (Node.js + Express + PostgreSQL + JWT)

Backend для сервісу оцінювання фільмів: реєстрація/логін (JWT), кешування фільмів з TMDb, лайки/дизлайки, коментарі, логування (winston + morgan).

## Швидкий старт

### 1) Клон/розпакування та встановлення
```bash
cd backend
npm install
cp .env.example .env
```

### 2) Налаштувати PostgreSQL і БД
Створіть БД і користувача (приклад для psql):
```sql
CREATE DATABASE movierating;
-- Створіть користувача та дайте права, або використовуйте існуючого
-- ALTER USER your_user WITH PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE movierating TO your_user;
```

Заповніть `DATABASE_URL` у `.env`, потім застосуйте схему:
```bash
# з кореня backend/
psql "$DATABASE_URL" -f src/sql/schema.sql
```

### 3) Налаштувати змінні середовища
У `.env` вкажіть:
- `JWT_SECRET` — секрет для підпису токенів
- `TMDB_API_KEY` — ключ TMDb (отримується на themoviedb.org)

### 4) Запуск сервера
```bash
npm run dev
# API: http://localhost:4000
```

Перевірка здоров'я:
```bash
curl http://localhost:4000/api/health
``` 

## API (приклади)

### Реєстрація та логін
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "email":"test@mail.com", "username":"test", "password":"pass1234" }'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "emailOrUsername":"test", "password":"pass1234" }'
# -> { token, user }
```

### Синхронізація популярних фільмів з TMDb (потрібен токен)
```bash
TOKEN=... # токен з /login
curl -X POST http://localhost:4000/api/movies/sync/popular \
  -H "Authorization: Bearer $TOKEN"
```

### Отримати список фільмів
```bash
curl http://localhost:4000/api/movies?limit=20&offset=0
```

### Лайк / дизлайк (type: 1 або -1)
```bash
curl -X POST http://localhost:4000/api/likes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "movieId": 550, "type": 1 }'
```

### Коментарі
```bash
# Список коментарів для фільму
curl http://localhost:4000/api/comments/550

# Додати коментар
curl -X POST http://localhost:4000/api/comments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "movieId": 550, "text": "Класний фільм!" }'

# Редагувати власний коментар
curl -X PUT http://localhost:4000/api/comments/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "text": "Ще кращий після перегляду вдруге" }'

# Видалити власний коментар
curl -X DELETE http://localhost:4000/api/comments/1 -H "Authorization: Bearer $TOKEN"
```

## Логування
- Всі HTTP-запити логуються через morgan у `logs/app.log`
- Помилки — у `logs/error.log`
- Події: REGISTER/LOGIN/REACTION/COMMENT_*

## Нотатки
- За замовчуванням CORS дозволяє `http://localhost:5173` та `http://localhost:3000` (фронтенд).
- БД: PostgreSQL. Для MySQL знадобиться адаптація запитів і драйвера.
