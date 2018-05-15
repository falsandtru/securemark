import { html } from 'typed-dom';

export function sanitize(url: string): string {
  url = url.replace(/\s/g, encodeURI);
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
    'tel:',
  ]
    .includes(parser.protocol);
}
