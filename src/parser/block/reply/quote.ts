import { ReplyParser } from '../../block';
import { eval } from '../../../combinator/data/parser';
import { union, some, creation, block, line, validate, rewrite, lazy, fmap } from '../../../combinator';
import { math } from '../../inline/math';
import { autolink } from '../../inline/autolink';
import { linebreak, unescsource, str, anyline } from '../../source';
import { html, defrag } from 'typed-dom/dom';

export const syntax = /^>+(?=[^\S\n])|^>(?=[^\s>])|^>+(?=[^\s>])(?![0-9a-z]+(?:-[0-9a-z]+)*(?![0-9A-Za-z@#:]))/;

export const quote: ReplyParser.QuoteParser = lazy(() => creation(1, false, block(fmap(validate(
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
      ns.length > 1
        ? { class: 'quote' }
        : {
            class: 'quote invalid',
            'data-invalid-syntax': 'quote',
            'data-invalid-type': 'syntax',
            'data-invalid-message': `Missing the whitespace after "${ns[0].split(/[^>]/, 1)[0]}"`,
          },
      defrag(ns)),
    html('br'),
  ]),
  false)));

const qblock: ReplyParser.QuoteParser.BlockParser = ({ source, context }) => {
  source = source.replace(/\n$/, '');
  const lines = source.match(/^.*\n?/mg)!;
  assert(lines);
  const quotes = source.match(/^>+[^\S\n]/mg)!;
  assert(quotes);
  assert(quotes.length > 0);
  const content = lines.reduce((acc, line, i) => acc + line.slice(quotes[i].length), '');
  const nodes = eval(text({ source: `\r${content}`, context }), []);
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
    if (child.className === 'cite' || child.classList.contains('quote')) {
      context.resources && (context.resources.clock -= child.childNodes.length);
      nodes.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      --i;
      continue;
    }
  }
  nodes.unshift('');
  assert(nodes.length > 1);
  assert(nodes.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(quotes.length === 0);
  return [nodes, ''];
};

const text: ReplyParser.QuoteParser.TextParser = some(union([
  math, // quote補助関数が残した数式をパースする。他の構文で数式を残す場合はソーステキストを直接使用する。
  autolink,
  linebreak,
  unescsource,
]));
