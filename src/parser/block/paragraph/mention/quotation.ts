import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, creator, fmap, convert, lazy, eval } from '../../../../combinator';
import { defrag } from '../../../util';
import { contentline } from '../../../source';
import { autolinkblock } from '../../../autolinkblock';
import { html } from 'typed-dom';

export const quotation: ParagraphParser.MentionParser.QuotationParser = lazy(() => creator(block(fmap(
  union([
    rewrite(
      some(validate(/^>+(?:$|\s)/, contentline)),
      convert(source => source.replace(/\n$/, ''), text)),
    rewrite(
      some(validate(/^>+/, contentline)),
      convert(source => source.replace(/\n$/, ''), text)),
  ]),
  ns => [html('span', { class: 'quotation' }, ns)]),
  false)));

const text: ParagraphParser.MentionParser.QuotationParser.TextParser = (source, context) => {
  const lines = source.match(/^.*\n?/mg)!;
  assert(lines);
  const flags = source.match(/^>+(?:$|\s)/.test(source) ? /^>+(?:$|\s)/mg : /^>+/mg)!;
  assert(flags);
  assert(flags.length > 0);
  const block = lines.reduce((block, line, row) => block + line.slice(flags[row].length), '');
  const ns = eval(autolinkblock(block, context), []);
  void ns.unshift(flags.shift()!);
  for (let i = 0; i < ns.length; ++i) {
    const child = ns[i] as string | Text | Element;
    if (typeof child === 'string') continue;
    if ('wholeText' in child) {
      ns[i] = child.data;
      continue;
    }
    assert(child instanceof HTMLElement);
    if (child.tagName === 'BR') {
      assert(flags.length > 0);
      void ns.splice(i + 1, 0, flags.shift()!);
      void ++i;
      continue;
    }
    if (child.classList.contains('quotation')) {
      context.resources && void (context.resources.creation -= child.childNodes.length);
      void ns.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      void --i;
      continue;
    }
  }
  assert(ns.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(flags.length === 0);
  return [defrag(ns), ''];
};
