# 📖 README.md — Movie Rating App

## 🎬 Опис
**Movie Rating App** — це fullstack застосунок для перегляду та оцінювання фільмів.  
Користувачі можуть:
- реєструватися та входити в акаунт;
- переглядати список фільмів;
- бачити рейтинг (лайки/дизлайки), кількість коментарів;
- ставити оцінки та писати коментарі.

Проєкт складається з:
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + Vite + Axios + SCSS
- **Database**: PostgreSQL (pgAdmin4 для управління)

---

## ⚙️ Технології
- **Backend**:
  - Node.js 20+
  - Express.js
  - PostgreSQL (pg, dotenv, cors, morgan)
- **Frontend**:
  - React 18
  - Vite
  - Axios
  - React Router DOM
  - SCSS
- **Dev Tools**:
  - pgAdmin4
  - Postman / curl

---

## 🗄️ Налаштування бази даних
1. Створи базу даних у pgAdmin:
   ```sql
   CREATE DATABASE movierating;
   CREATE USER movier WITH PASSWORD '12345';
   GRANT ALL PRIVILEGES ON DATABASE movierating TO movier;
   ```

2. Виконай SQL зі схеми:
   ```sql
   \i backend/schema.sql
   ```

3. Додай права на в’юхи:
   ```sql
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO movier;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO movier;
   GRANT ALL PRIVILEGES ON ALL VIEWS IN SCHEMA public TO movier;
   ```

4. (Опційно) Засидь кілька фільмів вручну:
   ```sql
   INSERT INTO movies (id, title, description, poster_url, updated_at)
   VALUES 
     (550, 'Fight Club', 'An insomniac office worker...', 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg', NOW());
   ```

---

## 🔑 Backend
1. Перейди у папку `backend`:
   ```bash
   cd backend
   ```

2. Створи файл `.env`:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=movier
   DB_PASSWORD=12345
   DB_NAME=movierating

   # Опційно: для TMDB
   TMDB_API_KEY=тут_твій_ключ
   ```

3. Встанови залежності:
   ```bash
   npm install
   ```

4. Запусти сервер:
   ```bash
   npm run dev
   ```

API буде доступне на: **http://localhost:4000**

---

## 🎨 Frontend
1. Перейди у папку `frontend`:
   ```bash
   cd frontend
   ```

2. Встанови залежності:
   ```bash
   npm install
   ```

3. Запусти застосунок:
   ```bash
   npm run dev
   ```

Фронтенд буде доступний на: **http://localhost:5173**

---

## 🧪 Перевірка роботи
- Перейди на **http://localhost:5173**  
- Зареєструй нового користувача  
- Перевір список фільмів (якщо база порожня → додай фільми вручну або через TMDB sync endpoint)  
- Спробуй поставити лайк/дизлайк, написати коментар  

---

## 🚀 Подальші кроки
- Реалізувати імпорт фільмів з TMDB API (`/api/movies/sync/:tmdbId`)  
- Додати пошук фільмів  
- Створити адмінку для керування базою  
