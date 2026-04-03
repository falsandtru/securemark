import { ParserOptions } from '../..';
import { Input, Options } from '../parser/context';
import { Output, run } from '../combinator/parser';
import { document } from '../parser/document';
import { ReadonlyURL } from 'spica/url';

interface Opts extends ParserOptions {
  readonly local?: boolean;
  readonly test?: boolean;
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
  for (const _ of run(document, new Input(options, source), output)) yield;
  assert(output.data.length === 1);
  assert(output.peek().length === 1);
  return output.peek().head!.value;
}
