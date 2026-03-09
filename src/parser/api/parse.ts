import { ParserOptions } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { input } from '../../combinator/data/parser';
import { segment } from '../segment';
import { block } from '../block';
import { normalize } from './normalize';
import { headers } from './header';
import { figure } from '../processor/figure';
import { note } from '../processor/note';
import { ReadonlyURL } from 'spica/url';
import { frag } from 'typed-dom/dom';

interface Options extends ParserOptions {
  readonly test?: boolean;
}

export function parse(source: string, options: Options = {}, context?: MarkdownParser.Options): DocumentFragment {
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? normalize(source) : source;
  context = {
    host: options.host ?? context?.host ?? new ReadonlyURL(location.pathname, location.origin),
    url: url ? new ReadonlyURL(url as ':') : context?.url,
    id: options.id ?? context?.id,
    caches: context?.caches,
    resources: context?.resources,
  };
  assert(!context.offset);
  assert(!context.precedence);
  assert(!context.delimiters);
  assert(!context.state);
  if (context.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = frag();
  // @ts-expect-error
  context.header = true;
  for (const seg of segment(source)) {
    node.append(
      ...block(input(seg, context))
        ?.foldl<HTMLElement[]>((acc, { value }) => void acc.push(value) || acc, []) ?? []);
    // @ts-expect-error
    context.header = false;
  }
  assert(options.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  if (options.test) return node;
  for (const _ of figure(node, options.notes, context));
  for (const _ of note(node, options.notes, context));
  assert(options.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(options.id !== '' || !options.notes?.references.querySelector('[id], .index[href], .label[href]'));
  return node;
}
