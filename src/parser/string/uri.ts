import { html } from 'typed-dom';

export function sanitize(uri: string): string {
  uri = uri.replace(/\s/g, encodeURI);
  return isAcceptedProtocol(uri)
    ? uri
    : '';
}

export function decode(uri: string): string {
  try {
    uri = decodeURI(uri);
  }
  finally {
    return uri
      .replace(/\s/g, encodeURIComponent);
  }
}

const parser = html('a');
function isAcceptedProtocol(uri: string): boolean {
  parser.setAttribute('href', uri);
  return [
    'http:',
    'https:',
    'tel:',
  ]
    .includes(parser.protocol);
}
