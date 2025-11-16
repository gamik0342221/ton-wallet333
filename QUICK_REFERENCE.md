# ⚡ Быстрая памятка

## 🚀 Одна команда для запуска:

```bash
./deploy.sh
```

---

## 🔑 Что вам понадобится:

### 1. GitHub Personal Access Token

**Получить:** https://github.com/settings/tokens

**Настройки:**
- Note: `Cloudflare Deploy`
- Expiration: `No expiration`
- Scope: ✅ **repo** (все)

**Формат:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 2. Telegram Bot Token

**Получить:** Напишите [@BotFather](https://t.me/BotFather) → `/newbot`

**Формат:** `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

**Ваш токен:** `7898265031:AAH2cOpMXcLYsjNi11Y6cUxp6FnLmqXBPZk`

---

### 3. Telegram Chat ID

**Получить:** Напишите [@userinfobot](https://t.me/userinfobot) → Start

**Формат:** `1234567890`

**Ваш Chat ID:** `1078825066`

---

## 📝 Cloudflare Settings

### Build Settings:

```
Framework preset:      Astro
Build command:         npm run build
Build output:          dist
Root directory:        (оставьте пустым)
```

### Environment Variables:

```
TELEGRAM_BOT_TOKEN=7898265031:AAH2cOpMXcLYsjNi11Y6cUxp6FnLmqXBPZk
TELEGRAM_CHAT_ID=1078825066
```

⚠️ **БЕЗ кавычек и пробелов!**

---

## 🔗 Важные ссылки

| Что | Ссылка |
|-----|--------|
| **Ваш GitHub** | https://github.com/gamik0342221/ton-wallet33 |
| **Cloudflare Dashboard** | https://dash.cloudflare.com/ |
| **Cloudflare Pages Setup** | https://dash.cloudflare.com/sign-up/pages |
| **GitHub Tokens** | https://github.com/settings/tokens |
| **BotFather** | https://t.me/BotFather |
| **UserInfo Bot** | https://t.me/userinfobot |

---

## ⚡ Быстрые команды

### Загрузка на GitHub:

```bash
./deploy.sh
```

### Или вручную:

```bash
git add .
git commit -m "Update"
git push origin main
```

### Локальная разработка:

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка проекта
npm run preview      # Просмотр production
```

---

## 🎯 Процесс развертывания (10 минут)

```
1. ./deploy.sh                     [2 мин]
   ↓
2. Cloudflare → Sign up/Login      [2 мин]
   ↓
3. Connect GitHub → ton-wallet33   [1 мин]
   ↓
4. Configure Build Settings        [2 мин]
   ↓
5. Add Environment Variables       [1 мин]
   ↓
6. Save and Deploy                 [2 мин]
   ↓
7. ✅ https://ton-wallet33.pages.dev
```

---

## 📞 Помощь

Если что-то не получается, откройте:

1. **START_HERE.md** - общая информация
2. **DEPLOY_NOW.md** - пошаговая инструкция
3. **CLOUDFLARE_DEPLOYMENT_GUIDE.md** - детальное руководство

---

## ✅ Чеклист

- [ ] `./deploy.sh` выполнен
- [ ] Personal Access Token получен
- [ ] Cloudflare аккаунт создан
- [ ] GitHub подключен
- [ ] Build Settings настроены
- [ ] Environment Variables добавлены
- [ ] Deployment запущен
- [ ] Сайт работает
- [ ] Telegram получает сообщения

---

## 🎉 Готово!

После всех шагов ваш сайт будет доступен по адресу:

```
https://ton-wallet33.pages.dev
```

Откройте его на любом устройстве! 🚀
