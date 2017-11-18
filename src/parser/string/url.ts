export function sanitize(url: string): string {
  url = url.trim().replace(/\s/g, encodeURIComponent);
  return isAcceptedProtocol(url)
    ? url
    : '';
}

const parser = document.createElement('a');
function isAcceptedProtocol(url: string): boolean {
  parser.setAttribute('href', url);
  return [
    'http:',
    'https:',
  ]
    .includes(parser.protocol);
}
