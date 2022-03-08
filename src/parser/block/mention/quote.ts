import { MentionParser } from '../../block';
import { eval } from '../../../combinator/data/parser';
import { union, some, block, line, validate, rewrite, creator, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { str, anyline } from '../../source';
import { autolink } from '../../autolink';
import { html, defrag } from 'typed-dom';

export const syntax = /^>+(?=[^\S\n])|^>(?=[^\s>])|^>+(?=[^\s>])(?![0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:]))/;

export const quote: MentionParser.QuoteParser = lazy(() => creator(block(fmap(validate(
  '>',
  union([
    rewrite(
      some(validate(new RegExp(syntax.source.split('|')[0]), anyline)),
      qblock),
    rewrite(
      validate(new RegExp(syntax.source.split('|').slice(1).join('|')), anyline),
      line(union([str(/^.+/)]))),
  ])),
  (ns: [string, ...(string | HTMLElement)[]]) => [
    html('span',
      ns.length > 1 || /^>+(?=[^\S\n])/.test(ns[0])
        ? { class: 'quote' }
        : {
            class: 'quote invalid',
            'data-invalid-syntax': 'quote',
            'data-invalid-type': 'syntax',
            'data-invalid-description': `Missing the whitespace after "${ns[0].split(/[^>]/, 1)[0]}".`,
          },
      ns),
    html('br'),
  ]),
  false)));

const qblock: MentionParser.QuoteParser.BlockParser = (source, context) => {
  source = source.replace(/\n$/, '');
  const lines = source.match(/^.*\n?/mg)!;
  assert(lines);
  const quotes = source.match(/^>+[^\S\n]/mg)!;
  assert(quotes);
  assert(quotes.length > 0);
  const content = lines.reduce((acc, line, row) => acc + line.slice(quotes[row].length), '');
  const nodes = eval(some(text)(content, context), []);
  nodes.unshift(quotes.shift()!);
  for (let i = 0; i < nodes.length; ++i) {
    const child = nodes[i] as string | Text | Element;
    if (typeof child === 'string') continue;
    if ('wholeText' in child) {
      nodes[i] = child.data;
      continue;
    }
    assert(child instanceof HTMLElement);
    if (child.tagName === 'BR') {
      assert(quotes.length > 0);
      nodes.splice(i + 1, 0, quotes.shift()!);
      ++i;
      continue;
    }
    if (child.classList.contains('cite') || child.classList.contains('quote')) {
      context.resources && (context.resources.budget -= child.childNodes.length);
      nodes.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      --i;
      continue;
    }
  }
  assert(nodes.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(quotes.length === 0);
  return [defrag(nodes), ''];
};

const text: MentionParser.QuoteParser.TextParser = union([
  math,
  autolink,
]);
