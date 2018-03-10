import { html } from 'typed-dom';

export function sanitize(url: string): string {
  url = url.trim().replace(/\s/g, encodeURIComponent);
  return isAcceptedProtocol(url)
    ? url
    : '';
}

const parser = html('a');
function isAcceptedProtocol(url: string): boolean {
  parser.setAttribute('href', url);
  return [
    'http:',
    'https:',
  ]
    .includes(parser.protocol);
}
