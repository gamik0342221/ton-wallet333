# Руководство по развертыванию

## Cloudflare Pages (Рекомендуется)

Ваш проект настроен для Cloudflare Workers/Pages.

### Шаги развертывания:

1. **Установите Wrangler CLI:**
```bash
npm install -g wrangler
```

2. **Авторизуйтесь в Cloudflare:**
```bash
wrangler login
```

3. **Настройте переменные окружения в Cloudflare:**
   - Перейдите в Cloudflare Dashboard
   - Выберите ваш Workers/Pages проект
   - Добавьте переменные из `.env` файла

4. **Соберите и разверните:**
```bash
npm run build
wrangler pages deploy dist
```

## Vercel

1. **Установите Vercel CLI:**
```bash
npm install -g vercel
```

2. **Разверните:**
```bash
vercel
```

## Netlify

1. **Установите Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Разверните:**
```bash
netlify deploy --prod
```

## VPS (Ubuntu/Debian)

### Требования:
- Node.js 18+
- PM2 для управления процессами

### Шаги:

1. **Подключитесь к серверу:**
```bash
ssh user@your-server-ip
```

2. **Установите Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Установите PM2:**
```bash
sudo npm install -g pm2
```

4. **Клонируйте проект:**
```bash
git clone your-repo-url
cd your-project
npm install
```

5. **Соберите проект:**
```bash
npm run build
```

6. **Настройте Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Запустите с PM2:**
```bash
pm2 start npm --name "wallet-app" -- run preview
pm2 save
pm2 startup
```

## Docker

1. **Создайте Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4321

CMD ["npm", "run", "preview"]
```

2. **Соберите и запустите:**
```bash
docker build -t wallet-app .
docker run -p 4321:4321 wallet-app
```

## Переменные окружения

Не забудьте настроить следующие переменные на сервере:

- `WEBFLOW_CMS_SITE_API_TOKEN` (если используется CMS)
- `WEBFLOW_API_HOST` (опционально)
- Любые другие секретные ключи из `.env`

## SSL сертификат

Для production обязательно настройте HTTPS:

### С Cloudflare:
SSL настраивается автоматически

### С Nginx + Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Мониторинг

Рекомендуется настроить мониторинг:
- Cloudflare Analytics (встроен)
- PM2 monitoring: `pm2 monitor`
- Custom logging solution
