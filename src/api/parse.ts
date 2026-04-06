import { ParserOptions } from '../..';
import { Input, Options } from '../parser/context';
import { Output, List, Node, run } from '../combinator/parser';
import { document } from '../parser/document';
import { ReadonlyURL } from 'spica/url';

export interface Opts extends ParserOptions {
  readonly local?: boolean;
  readonly test?: boolean;
  readonly labels?: List<Node<HTMLAnchorElement>>;
  readonly annotations?: List<Node<HTMLElement>>;
  readonly references?: List<Node<HTMLElement>>;
}

export function* parse(source: string, opts: Opts = {}, options?: Options): Generator<void, DocumentFragment, void> {
  options = {
    host: opts.host ?? options?.host ?? new ReadonlyURL(location.pathname, location.origin),
    url: options?.url,
    id: opts.id ?? options?.id,
    notes: opts.notes ?? options?.notes,
    caches: options?.caches,
    resources: options?.resources,
    header: true,
    test: opts.test,
  };
  if (options.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (options.host?.origin === 'null') throw new Error(`Invalid host: ${options.host.href}`);
  const output = new Output<DocumentFragment>();
  assert(output.labels[0] = opts.labels ?? output.labels[0]);
  assert(output.annotations[0] = opts.annotations ?? output.annotations[0]);
  assert(output.references[0] = opts.references ?? output.references[0]);
  yield* run(document, new Input(options, source), output);
  assert(output.data.length === 1);
  assert(output.peek().length === 1);
  return output.peek().head!.value;
}
