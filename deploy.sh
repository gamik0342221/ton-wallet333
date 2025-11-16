#!/bin/bash

# 🚀 Скрипт автоматического развертывания TON Wallet

echo "╔════════════════════════════════════════════╗"
echo "║   🚀 TON Wallet - Развертывание сайта     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Проверка Git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен!"
    exit 1
fi

echo "📦 Подготовка кода..."

# Добавляем все изменения
git add .

# Проверяем есть ли изменения
if git diff-index --quiet HEAD --; then
    echo "✅ Нет новых изменений"
else
    echo "💾 Сохранение изменений..."
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "📤 Загрузка на GitHub..."
echo ""
echo "⚠️  Вас попросят ввести:"
echo "    Username: gamik0342221"
echo "    Password: [Ваш Personal Access Token]"
echo ""

# Загружаем на GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║         ✅ КОД УСПЕШНО ЗАГРУЖЕН!          ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Теперь перейдите на Cloudflare Pages:"
    echo ""
    echo "   https://dash.cloudflare.com/"
    echo ""
    echo "📋 Что делать дальше:"
    echo ""
    echo "   1. Если сайт УЖЕ создан:"
    echo "      • Cloudflare автоматически обновит сайт"
    echo "      • Подождите 2-3 минуты"
    echo "      • Откройте: https://ton-wallet33.pages.dev"
    echo ""
    echo "   2. Если это ПЕРВЫЙ запуск:"
    echo "      • Откройте DEPLOY_NOW.md"
    echo "      • Следуйте инструкциям"
    echo ""
    echo "🎉 Готово!"
else
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║      ❌ ОШИБКА ПРИ ЗАГРУЗКЕ КОДА          ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "🔧 Возможные причины:"
    echo ""
    echo "   1. Неправильный Personal Access Token"
    echo "      Получите новый: https://github.com/settings/tokens"
    echo ""
    echo "   2. Нет доступа к репозиторию"
    echo "      Проверьте: https://github.com/gamik0342221/ton-wallet33"
    echo ""
    echo "   3. Проблема с интернетом"
    echo "      Проверьте подключение и попробуйте снова"
    echo ""
    echo "💡 Попробуйте вручную:"
    echo "   git push origin main"
    exit 1
fi
