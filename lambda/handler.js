// lambda/handler.js
// simple AWS Lambda handler for a contact form
// expects a JSON body with { name, email, message }
// forwards the details to a Telegram chat using a bot token

const fetch = require('node-fetch'); // or rely on built-in fetch in Node 18+

exports.handler = async (event) => {
  try {
    // API Gateway usually sends the body as a string
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { name, email, mobile, message } = body;

    if (!name || !email || !mobile) {
      return {
        statusCode: 400,
        body: 'Missing required fields',
      };
    }

    const text = `📬 *New contact request*\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Mobile:* ${mobile}\n` +
      (message ? `*Message:* ${message}\n` : '');

    // environment variables set in the Lambda configuration
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('bot token or chat id not configured');
      return {
        statusCode: 500,
        body: 'Server configuration error',
      };
    }

    // send message via Telegram API
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (err) {
    console.error('handler error', err);
    return {
      statusCode: 500,
      body: 'Internal server error',
    };
  }
};
