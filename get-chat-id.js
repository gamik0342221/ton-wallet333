// Скрипт для получения Chat ID
import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN?.replace(/"/g, '');

console.log('Получение последних обновлений от бота...\n');

const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

try {
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.ok && data.result.length > 0) {
    console.log('✅ Найдены сообщения!\n');
    
    data.result.forEach((update, index) => {
      if (update.message) {
        console.log(`Сообщение ${index + 1}:`);
        console.log('  Chat ID:', update.message.chat.id);
        console.log('  От:', update.message.chat.first_name || update.message.chat.username);
        console.log('  Текст:', update.message.text);
        console.log('');
      }
    });
    
    const lastChatId = data.result[data.result.length - 1].message?.chat.id;
    console.log('📝 Ваш Chat ID:', lastChatId);
    console.log('\nДобавьте это значение в .env файл:');
    console.log(`TELEGRAM_CHAT_ID="${lastChatId}"`);
  } else {
    console.log('❌ Нет сообщений.');
    console.log('\n💡 Откройте Telegram и отправьте /start боту @dasdjasduhcauhh12hiudas_bot');
    console.log('   Затем запустите этот скрипт снова.');
  }
} catch (error) {
  console.error('❌ Ошибка:', error.message);
}
