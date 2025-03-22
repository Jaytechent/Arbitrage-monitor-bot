require('dotenv').config();
const http = require('http');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000; // Render requires a running server

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Function to send message to Telegram
async function sendTelegramMessage(message) {
  try {
    await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
  }
}

async function getTokenTransferQuote() {
  const url = new URL('https://li.quest/v1/quote');

  const params = {
    fromAmount: '5',
    fromChain: '59144',
    fromToken: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    toChain: '59144',
    toToken: '0x3478dE5e82431676C87113001bBeeb359cb5eAa5',
    fromAddress: '0x0A4938cE5A06333117b0910CC2D57Fbb95Dd9a0e',
    toAddress: '0x0A4938cE5A06333117b0910CC2D57Fbb95Dd9a0e',
    order: 'FASTEST',
    slippage: '0.005',
  };

  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    return null;
  }
}

// Function to calculate percentage change and format message
async function processQuote(quote) {
  if (!quote || !quote.estimate) {
    console.log('No valid data found in API response.');
    return;
  }

  const fromAmount = parseFloat(quote.estimate.fromAmount);
  const toAmountMin = parseFloat(quote.estimate.toAmountMin);
  const convertedToAmount = toAmountMin / 1e9;
  const difference = convertedToAmount - fromAmount;
  const percentageChange = (difference / fromAmount) * 100;

  const changeIndicator = difference > 0 ? '✅✅✅' : '❌❌❌';
  const changeText = difference > 0 ? 'Increase' : 'Decrease';

  const message = `🚀 *ARBITRAGE AI RESULT FROM JUMPER USDC TO MIWETH* 🚀\n\n`
    + `💰 *Amount:* ${fromAmount} USDC\n`
    + `🔹 *To Amount Min:* ${toAmountMin}\n`
    + `${changeIndicator} *${changeText} by* ${Math.abs(percentageChange.toFixed(2))}%, *now at* ${convertedToAmount.toFixed(6)} USDC`;

  console.log(message);
  await sendTelegramMessage(message);
}

// Create HTTP server for Render deployment
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Execute the function and process response
(async () => {
  const quote = await getTokenTransferQuote();
  await processQuote(quote);
})();







// require('dotenv').config();
// const http = require('http');
// const fetch = require('node-fetch');

// const PORT = process.env.PORT || 3000; // Render requires a running server

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const CHAT_ID = process.env.CHAT_ID;
// const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// // Function to send message to Telegram
// async function sendTelegramMessage(message) {
//   try {
//     await fetch(TELEGRAM_API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: CHAT_ID,
//         text: message,
//         parse_mode: 'Markdown',
//       }),
//     });
//   } catch (error) {
//     console.error('Error sending Telegram message:', error.message);
//   }
// }

// async function getTokenTransferQuote() {
//   const url = new URL('https://li.quest/v1/quote');

//   const params = {
//     fromAmount: '5',
//     fromChain: '59144',
//     fromToken: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
//     toChain: '59144',
//     toToken: '0x3478dE5e82431676C87113001bBeeb359cb5eAa5',
//     fromAddress: '0x0A4938cE5A06333117b0910CC2D57Fbb95Dd9a0e',
//     toAddress: '0x0A4938cE5A06333117b0910CC2D57Fbb95Dd9a0e',
//     order: 'FASTEST',
//     slippage: '0.005',
//   };

//   Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

//   try {
//     const response = await fetch(url.toString(), {
//       method: 'GET',
//       headers: { accept: 'application/json' },
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} - ${await response.text()}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching quote:', error.message);
//     return null;
//   }
// }

// // Function to calculate percentage change and format message
// async function processQuote(quote) {
//   if (!quote || !quote.estimate) {
//     console.log('No valid data found in API response.');
//     return;
//   }

//   const fromAmount = parseFloat(quote.estimate.fromAmount);
//   const toAmountMin = parseFloat(quote.estimate.toAmountMin);
//   const convertedToAmount = toAmountMin / 1e9;
//   const difference = convertedToAmount - fromAmount;
//   const percentageChange = (difference / fromAmount) * 100;

//   const changeIndicator = difference > 0 ? '✅✅✅' : '❌❌❌';
//   const changeText = difference > 0 ? 'Increase' : 'Decrease';

//   const message = `🚀 *ARBITRAGE AI RESULT FROM JUMPER USDC TO MIWETH* 🚀\n\n`
//     + `💰 *Amount:* ${fromAmount} USDC\n`
//     + `🔹 *To Amount Min:* ${toAmountMin}\n`
//     + `${changeIndicator} *${changeText} by* ${Math.abs(percentageChange.toFixed(2))}%, *now at* ${convertedToAmount.toFixed(6)} USDC`;

//   console.log(message);
//   await sendTelegramMessage(message);
// }

// // Create HTTP server for Render deployment
// const server = http.createServer(async (req, res) => {
//   if (req.url === '/post-on-ping' && req.method === 'POST') {
//     const quote = await getTokenTransferQuote();
//     await processQuote(quote);

//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Quote processed successfully' }));
//   } else if (req.url === '/') {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Server is running!');
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ error: 'Not Found' }));
//   }
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
