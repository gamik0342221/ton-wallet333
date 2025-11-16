# 🚀 Руководство по развертыванию на сервере

Это приложение на Astro может быть развернуто несколькими способами. Выберите подходящий вариант:

## 📋 Содержание
1. [Cloudflare Pages (Рекомендуется - БЕСПЛАТНО)](#1-cloudflare-pages-рекомендуется)
2. [Vercel (БЕСПЛАТНО)](#2-vercel)
3. [Netlify (БЕСПЛАТНО)](#3-netlify)
4. [VPS/Dedic сервер (Ubuntu/Debian)](#4-vpsdedicated-server)

---

## 1. Cloudflare Pages (Рекомендуется)

### ✅ Преимущества:
- Полностью бесплатно
- Глобальная CDN
- Автоматические деплои из Git
- Неограниченная пропускная способность
- Встроенная поддержка Astro

### 📝 Шаги:

#### Вариант A: Через GitHub (Автоматический деплой)

1. **Загрузите код на GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
   git push -u origin main
   ```

2. **Настройте Cloudflare Pages**
   - Зайдите на [dash.cloudflare.com](https://dash.cloudflare.com)
   - Workers & Pages → Create → Pages → Connect to Git
   - Выберите ваш репозиторий
   - Настройки сборки:
     ```
     Framework preset: Astro
     Build command: npm run build
     Build output directory: dist
     ```

3. **Добавьте переменные окружения** (если нужны):
   - Settings → Environment Variables
   - Добавьте все переменные из `.env` файла

4. **Деплой**
   - Нажмите "Save and Deploy"
   - Cloudflare автоматически соберет и задеплоит ваше приложение
   - Каждый push в main будет автоматически деплоиться

#### Вариант B: Через Wrangler CLI (Ручной деплой)

1. **Установите Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Войдите в аккаунт**
   ```bash
   wrangler login
   ```

3. **Соберите проект**
   ```bash
   npm run build
   ```

4. **Деплой**
   ```bash
   wrangler pages deploy dist --project-name=ваше-название
   ```

---

## 2. Vercel

### ✅ Преимущества:
- Бесплатно для личных проектов
- Очень быстрый деплой
- Автоматические превью для Pull Requests
- Простая настройка

### 📝 Шаги:

1. **Установите Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Измените адаптер в `astro.config.mjs`**
   ```bash
   npm install @astrojs/vercel
   ```
   
   Обновите файл:
   ```javascript
   import { defineConfig } from 'astro/config';
   import react from '@astrojs/react';
   import vercel from '@astrojs/vercel';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     output: 'server',
     adapter: vercel(),
     integrations: [react()],
     vite: {
       plugins: [tailwindcss()],
     },
   });
   ```

3. **Деплой**
   ```bash
   vercel
   ```
   
   Или через GitHub:
   - Загрузите код на GitHub
   - Зайдите на [vercel.com](https://vercel.com)
   - New Project → Import Git Repository
   - Vercel автоматически определит настройки Astro

4. **Добавьте переменные окружения**
   - Project Settings → Environment Variables

---

## 3. Netlify

### ✅ Преимущества:
- Бесплатный тариф
- Простая настройка
- Хороший UI

### 📝 Шаги:

1. **Установите Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Измените адаптер** (если нужно)
   ```bash
   npm install @astrojs/netlify
   ```

3. **Создайте `netlify.toml`** (уже есть в проекте)
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[plugins]]
     package = "@astrojs/netlify"
   ```

4. **Деплой**
   ```bash
   netlify deploy --prod
   ```
   
   Или через GitHub:
   - Загрузите код на GitHub
   - Зайдите на [netlify.com](https://netlify.com)
   - New site from Git → выберите репозиторий
   - Build settings уже настроятся автоматически

---

## 4. VPS/Dedicated Server

### Для Ubuntu/Debian сервера:

#### 1️⃣ **Подготовка сервера**

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js (версия 18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установите Nginx
sudo apt install -y nginx

# Установите PM2 для управления процессами
sudo npm install -g pm2
```

#### 2️⃣ **Загрузите проект**

```bash
# Клонируйте репозиторий
cd /var/www
sudo git clone https://github.com/ваш-username/ваш-репозиторий.git myapp
cd myapp

# Установите зависимости
sudo npm install

# Создайте .env файл
sudo nano .env
# Добавьте ваши переменные окружения
```

#### 3️⃣ **Соберите проект**

```bash
sudo npm run build
```

#### 4️⃣ **Настройте PM2**

Создайте файл `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'myapp',
    script: './dist/server/entry.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: 3000
    }
  }]
}
```

Запустите приложение:

```bash
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

#### 5️⃣ **Настройте Nginx как реверс-прокси**

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Добавьте конфигурацию:

```nginx
server {
    listen 80;
    server_name ваш-домен.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6️⃣ **Настройте SSL с Let's Encrypt (HTTPS)**

```bash
# Установите Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d ваш-домен.com

# Автообновление сертификата
sudo certbot renew --dry-run
```

#### 7️⃣ **Автоматическое обновление из Git**

Создайте скрипт `update.sh`:

```bash
#!/bin/bash
cd /var/www/myapp
git pull
npm install
npm run build
pm2 restart myapp
```

Сделайте его исполняемым:

```bash
chmod +x update.sh
```

---

## 🔧 Общие настройки для всех вариантов

### Переменные окружения

Убедитесь, что добавили все необходимые переменные:

```env
# Пример - замените своими значениями
WEBFLOW_CMS_SITE_API_TOKEN=your_token_here
WEBFLOW_API_HOST=https://api.webflow.com
```

### Проверка работы

После деплоя проверьте:
- ✅ Главная страница открывается
- ✅ Все стили загружаются
- ✅ JavaScript работает
- ✅ API эндпоинты отвечают (если есть)

---

## 🆘 Решение проблем

### Проблема: 404 на всех страницах кроме главной
**Решение:** Убедитесь, что в `astro.config.mjs` установлен `output: 'server'`

### Проблема: Стили не загружаются
**Решение:** Проверьте правильность путей в `base` настройке в `astro.config.mjs`

### Проблема: "Module not found"
**Решение:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Проблема: Приложение падает на VPS
**Решение:**
```bash
# Проверьте логи PM2
pm2 logs myapp

# Увеличьте память для Node.js
pm2 start ecosystem.config.js --node-args="--max-old-space-size=4096"
```

---

## 🎯 Какой вариант выбрать?

| Критерий | Cloudflare | Vercel | Netlify | VPS |
|----------|-----------|---------|---------|-----|
| Цена | Бесплатно | Бесплатно | Бесплатно | $5-50/мес |
| Простота | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Гибкость | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Скорость | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Рекомендация:** Начните с Cloudflare Pages - это самый простой и быстрый способ.

---

## 📞 Нужна помощь?

Если что-то не работает:
1. Проверьте логи деплоя
2. Убедитесь, что все переменные окружения установлены
3. Проверьте версию Node.js (должна быть 18+)
4. Очистите кэш и пересоберите проект

Удачи с деплоем! 🚀
