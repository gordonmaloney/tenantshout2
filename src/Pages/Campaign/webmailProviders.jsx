//This  is  to  construct  the send URL  based on the user's email client, so we can avoid using 'mailto' as much as possible


export const webmailProviders = [
  {
    name: 'gmail',
    domains: ['gmail.com', 'googlemail.com'],
    mxHint: 'google.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'outlook',
    domains: ['outlook.com', 'hotmail.com', 'live.com'],
    mxHint: 'outlook.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'yahoo',
    domains: ['yahoo.com', 'ymail.com'],
    mxHint: 'yahoodns.net',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.yahoo.com/d/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'aol',
    domains: ['aol.com'],
    mxHint: 'aol.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.aol.com/webmail-std/en-us/suite/compose-message.aspx?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'icloud',
    domains: ['icloud.com', 'me.com', 'mac.com'],
    mxHint: 'icloud.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://www.icloud.com/mail?compose=1&to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'zoho',
    domains: ['zoho.com'],
    mxHint: 'zoho.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.zoho.com/zm/#compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'protonmail',
    domains: ['protonmail.com'],
    mxHint: 'protonmail.ch',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.protonmail.com/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'gmx',
    domains: ['gmx.com', 'gmx.co.uk'],
    mxHint: 'gmx.net',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://www.gmx.com/mail/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'yandex',
    domains: ['yandex.com', 'yandex.ru'],
    mxHint: 'yandex.net',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://mail.yandex.com/?compose=1&to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  },
  {
    name: 'fastmail',
    domains: ['fastmail.com'],
    mxHint: 'fastmail.com',
    composeUrl: (to, subject, body, bcc) => {
      let url = `https://www.fastmail.com/mail/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (bcc) url += `&bcc=${encodeURIComponent(bcc)}`;
      return url;
    }
  }
];
