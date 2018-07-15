import { html } from 'typed-dom';

export function sanitize(url: string): string {
  url = url.replace(/\s/g, encodeURI);
  return isAcceptedProtocol(url)
    ? url
    : '';
}

export function decode(url: string): string {
  try {
    url = decodeURI(url);
  }
  finally {
    return url
      .replace(/\s/g, encodeURIComponent);
  }
}

const parser = html('a');
function isAcceptedProtocol(url: string): boolean {
  parser.setAttribute('href', url);
  return [
    'http:',
    'https:',
    'tel:',
  ]
    .includes(parser.protocol);
}
