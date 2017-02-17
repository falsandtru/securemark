export function sanitize(url: string): string {
  url = url.trim();
  try {
    url = encodeURI(decodeURI(url));
  }
  catch (e) {
    url = '';
    console.error(e);
  }
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
