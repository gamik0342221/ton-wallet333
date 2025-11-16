#!/bin/bash

# Цвета для красивого вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Резервное копирование проекта TON Wallet"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Генерируем имя файла с датой и временем
BACKUP_NAME="ton-wallet-backup-$(date +%Y%m%d-%H%M%S)"

echo "📦 Создание архива: ${BLUE}$BACKUP_NAME.tar.gz${NC}"
echo ""

# Создаем архив, исключая ненужные папки
echo "📂 Архивирование файлов..."
tar -czf "$BACKUP_NAME.tar.gz" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='.astro' \
  --exclude='.wrangler' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='ton-wallet-*backup*.tar.gz' \
  . 2>/dev/null

# Проверяем успешность
if [ $? -eq 0 ]; then
    # Получаем размер архива
    SIZE=$(du -h "$BACKUP_NAME.tar.gz" | cut -f1)
    
    echo ""
    echo "${GREEN}✅ Резервная копия успешно создана!${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Информация об архиве:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  📁 Файл: ${BLUE}$BACKUP_NAME.tar.gz${NC}"
    echo "  💾 Размер: ${BLUE}$SIZE${NC}"
    echo "  📅 Дата: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # Показываем основные папки в архиве
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 Содержимое архива (основные папки):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    tar -tzf "$BACKUP_NAME.tar.gz" | grep -E '^\./(src|public|generated)/' | head -10
    echo "  ... и другие файлы"
    echo ""
    
    # Показываем что НЕ включено
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ Исключено из архива:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  • node_modules/ (можно восстановить: npm install)"
    echo "  • dist/ (можно создать: npm run build)"
    echo "  • .git/ (если используете GitHub)"
    echo "  • .astro/ и .wrangler/ (кэш)"
    echo ""
    
    # Инструкции по восстановлению
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📥 Как восстановить из этого архива:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  ${BLUE}# Распакуйте архив${NC}"
    echo "  tar -xzf $BACKUP_NAME.tar.gz"
    echo ""
    echo "  ${BLUE}# Установите зависимости${NC}"
    echo "  npm install"
    echo ""
    echo "  ${BLUE}# Запустите проект${NC}"
    echo "  npm run dev"
    echo ""
    
    # Показываем все существующие бэкапы
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Все резервные копии:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    BACKUP_COUNT=$(ls ton-wallet-*backup*.tar.gz 2>/dev/null | wc -l)
    
    if [ "$BACKUP_COUNT" -gt 0 ]; then
        ls -lht ton-wallet-*backup*.tar.gz | while read line; do
            echo "  📁 $line"
        done
        echo ""
        echo "  ${YELLOW}💡 Совет: Старые бэкапы можно удалить для экономии места${NC}"
    else
        echo "  (бэкапов пока нет)"
    fi
    echo ""
    
    # Дополнительные советы
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "💡 Рекомендации:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  1. ${GREEN}Сохраните архив в безопасное место${NC}"
    echo "     • На флешку / внешний диск"
    echo "     • В облако (Google Drive, Dropbox)"
    echo "     • На другой компьютер"
    echo ""
    echo "  2. ${GREEN}Используйте GitHub для долгосрочного хранения${NC}"
    echo "     • git add ."
    echo "     • git commit -m \"Update\""
    echo "     • git push"
    echo ""
    echo "  3. ${GREEN}Создавайте бэкапы регулярно${NC}"
    echo "     • Перед большими изменениями"
    echo "     • После завершения новых функций"
    echo "     • Раз в неделю (минимум)"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "${GREEN}✅ Готово!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📖 Подробная инструкция: ${BLUE}BACKUP_GUIDE.md${NC}"
    echo ""
    
else
    echo ""
    echo "${YELLOW}⚠️  Ошибка при создании архива${NC}"
    echo ""
    echo "Попробуйте запустить с правами администратора:"
    echo "  sudo bash backup-project.sh"
    echo ""
fi
