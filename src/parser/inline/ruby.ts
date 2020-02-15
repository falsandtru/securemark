import { RubyParser } from '../inline';
import { Parser, union, sequence, some, creator, backtracker, surround, fmap, bind, eval } from '../../combinator';
import { htmlentity } from './htmlentity';
import { str, char } from '../source';
import { defrag } from '../util';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

const parser: Parser<string> = some(union([
  fmap(htmlentity, (ts: Text[]) => [ts[0].data]),
  (s: string) => {
    const i = s.indexOf('&');
    return i === -1
      ? [[s], '']
      : [[s.slice(0, i || 1)], s.slice(i || 1)];
  }
]));

export const ruby: RubyParser = creator(bind(
  sequence([
    surround('[', str(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/), backtracker(char(']'))),
    backtracker(surround('(', str(/^(?:\\[^\n]|[^\)\n])+/), backtracker(char(')')))),
  ]),
  ([{ data: t }, { data: r }], rest, _, context) => {
    const texts = split(eval(parser(t, context)).join(''));
    const rubies = split(eval(parser(r, context)).join(''));
    if (!texts.join('').trim() || !rubies.join('').trim()) return;
    switch (true) {
      case rubies.length <= texts.length:
        return [[defrag(html('ruby', texts
          .reduce<(HTMLElement | Text)[]>((acc, _, i) =>
            concat(concat(acc, [text(texts[i])]),
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')])
          , [])))], rest];
      case texts.length === 1 && [...texts[0]].length >= rubies.length:
        return [[defrag(html('ruby', [...texts[0]]
          .reduce<(HTMLElement | Text)[]>((acc, _, i, texts) =>
            concat(concat(acc, [text(texts[i])]),
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')])
          , [])))], rest];
      default:
        return [[
          defrag(html('ruby', [
            text(texts.join(' ')),
            html('rp', '('),
            html('rt', rubies.join(' ') || void 0),
            html('rp', ')')]))
        ], rest];
    }
  }));

function split(target: string): string[] {
  const acc: string[] = [''];
  for (let i = 0; i < target.length; ++i) {
    switch (target[i]) {
      case ' ':
      case '\t':
        void acc.push('');
        continue;
      case '\\':
        acc[acc.length - 1] += target[++i];
        continue;
      default:
        acc[acc.length - 1] += target[i];
        continue;
    }
  }
  return acc;
}
