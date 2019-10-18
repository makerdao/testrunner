import fetch from 'node-fetch';

let {
  ROCKET_CHAT_USER_ID,
  ROCKET_CHAT_AUTH_TOKEN,
  ROCKET_CHAT_API_PATH = 'https://chat.makerdao.com/api/v1/chat.postMessage',
  ROCKET_CHAT_CHANNEL = '#team-js-prod-dev-protected'
} = process.env;

async function post(message) {
  console.log(`Posting to ${ROCKET_CHAT_CHANNEL}...`);
  if (!ROCKET_CHAT_USER_ID || !ROCKET_CHAT_AUTH_TOKEN) {
    throw new Error(
      'Missing from environment: ROCKET_CHAT_USER_ID, ROCKET_CHAT_AUTH_TOKEN'
    );
  }
  const res = await fetch(ROCKET_CHAT_API_PATH, {
    method: 'post',
    headers: {
      'X-Auth-Token': ROCKET_CHAT_AUTH_TOKEN,
      'X-User-Id': ROCKET_CHAT_USER_ID
    },
    body: JSON.stringify({
      text: message,
      channel: ROCKET_CHAT_CHANNEL,
      emoji: ':robot:',
      alias: 'testrunner'
    })
  });
  if (!res.ok) {
    const body = await res.text();
    const message = `Posting failed with ${res.statusCode}:\n${body}`;
    throw new Error(message);
  }
}

function format(report) {
  if (!report.success) {
    const { message, name } = report.error;
    if (name.startsWith('AssertionError')) {
      report.error = { message };
    }
  }
  return '```' + JSON.stringify(report, null, '  ') + '```';
}

async function alerter(level, report) {
  switch (level) {
    case 'info':
      return post(format(report));
    case 'error':
      if (!report.success) {
        return post(format(report));
      } else {
        console.log('Run succeeded; sending no alert.');
      }
  }
}

export default function() {
  return alerter;
}
