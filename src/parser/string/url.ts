export function sanitize(url: string): string {
  url = url.trim();
  return isAcceptedProtocol(url)
    ? url
    : '';
}

const parser = document.createElement('a');
function isAcceptedProtocol(url: string): boolean {
  parser.setAttribute('href', url);
  return [
    'http:',
    'https:'
  ]
    .indexOf(parser.protocol) !== -1;
}
