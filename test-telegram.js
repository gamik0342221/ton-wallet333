// Тестовый скрипт для проверки Telegram API
import 'dotenv/config';

const botToken = process.env.TELEGRAM_BOT_TOKEN?.replace(/"/g, '');
const chatId = process.env.TELEGRAM_CHAT_ID?.replace(/"/g, '');

console.log('=== Testing Telegram API ===');
console.log('Bot Token:', botToken ? `${botToken.substring(0, 10)}...` : 'NOT SET');
console.log('Chat ID:', chatId || 'NOT SET');
console.log('');

if (!botToken || !chatId) {
  console.error('❌ Missing credentials!');
  process.exit(1);
}

// Тест 1: Проверка бота
console.log('Test 1: Checking bot info...');
const botInfoUrl = `https://api.telegram.org/bot${botToken}/getMe`;

try {
  const botResponse = await fetch(botInfoUrl);
  const botData = await botResponse.json();
  
  if (botData.ok) {
    console.log('✅ Bot is valid!');
    console.log('   Bot name:', botData.result.username);
    console.log('   Bot ID:', botData.result.id);
  } else {
    console.log('❌ Bot check failed:', botData.description);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking bot:', error.message);
  process.exit(1);
}

console.log('');

// Тест 2: Отправка тестового сообщения
console.log('Test 2: Sending test message...');
const sendUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

try {
  const response = await fetch(sendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🧪 Test message from Telegram API test script',
    }),
  });

  const data = await response.json();
  
  if (data.ok) {
    console.log('✅ Message sent successfully!');
    console.log('   Message ID:', data.result.message_id);
    console.log('   Chat ID:', data.result.chat.id);
    console.log('   Chat type:', data.result.chat.type);
  } else {
    console.log('❌ Failed to send message');
    console.log('   Error code:', data.error_code);
    console.log('   Description:', data.description);
    console.log('');
    console.log('💡 Possible issues:');
    console.log('   1. Chat ID is incorrect');
    console.log('   2. Bot is not started (send /start to bot)');
    console.log('   3. Bot is blocked');
  }
} catch (error) {
  console.error('❌ Error sending message:', error.message);
}
