import { html } from 'typed-dom';

const parser = html('a');

export function sanitize(uri: string, protocols: ('tel:')[] = []): string | undefined {
  uri = uri.replace(/\s+/g, encodeURI);
  void parser.setAttribute('href', uri);
  return ['http:', 'https:'].includes(parser.protocol) || protocols.includes(parser.protocol as any)
    ? uri
    : void 0;
}

export function decode(uri: string): string {
  try {
    uri = decodeURI(uri);
  }
  finally {
    return uri
      .replace(/\s+/g, encodeURIComponent);
  }
}
