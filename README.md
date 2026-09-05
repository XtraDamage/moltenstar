# MoltenStar

MoltenStar — это современный ИИ-чат, построенный на базе Next.js, с использованием Material Design 3.

## Технологии

- Next.js 15
- React 19
- Material Design 3 (CSS)
- OpenRouter API

## Локальная разработка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте файл `.env.local` и добавьте ваш ключ:
   ```env
   OPENROUTER_API_KEY=ваш_ключ_здесь
   ```

3. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

## Развертывание в Vercel

1. Загрузите проект на GitHub
2. Импортируйте репозиторий в Vercel
3. Добавьте переменную окружения `OPENROUTER_API_KEY` в настройках Vercel (Settings → Environment Variables)
4. Нажмите Deploy

## Использование PocketBase (Опционально)

Для сохранения истории чатов на вашем собственном сервере:
1. Скачайте PocketBase с pocketbase.io
2. Запустите: `./pocketbase serve`
3. Создайте коллекцию `chats` с полями: `title` (text), `messages` (json), `createdAt` (number), `updatedAt` (number)
4. Добавьте `NEXT_PUBLIC_POCKETBASE_URL` в переменные окружения
5. Все данные хранятся локально
