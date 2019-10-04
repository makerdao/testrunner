import fetch from 'node-fetch';

const API_PATH = 'https://chat.makerdao.com/api/v1/chat.postMessage';
const channel = '#team-js-prod-dev-protected';

async function post(message) {
  console.log(`Posting to ${channel}...`);
  try {
    const res = await fetch(API_PATH, {
      method: 'post',
      headers: {
        'X-Auth-Token': process.env.ROCKET_CHAT_AUTH_TOKEN,
        'X-User-Id': process.env.ROCKET_CHAT_USER_ID
      },
      body: JSON.stringify({
        text: message,
        channel,
        emoji: ':robot:'
      })
    });
    if (!res.ok) {
      console.log(`Posting failed with ${res.statusCode}`);
      console.log(await res.text());
    }
  } catch (err) {
    console.error(err);
  }
}

async function alerter(level, report) {
  report = '```' + JSON.stringify(report, null, '  ') + '```';
  switch (level) {
    case 'info':
      return post(report);
    case 'error':
      if (!report.success) return post(report);
  }
}

export default function() {
  return alerter;
}
