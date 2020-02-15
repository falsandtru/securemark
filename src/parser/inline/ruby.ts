import { RubyParser } from '../inline';
import { Ctx, sequence, creator, backtracker, surround, bind } from '../../combinator';
import { defrag } from '../util';
import { htmlentity } from './htmlentity';
import { str, char } from '../source';
import { concat } from 'spica/concat';
import { html, text } from 'typed-dom';

export const ruby: RubyParser = creator(bind(
  sequence([
    surround('[', str(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/), backtracker(char(']'))),
    backtracker(surround('(', str(/^(?:\\[^\n]|[^\)\n])+/), backtracker(char(')')))),
  ]),
  ([{ data: t }, { data: r }], rest, _, context) => {
    const texts = parse(t, context);
    const rubies = parse(r, context);
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

function parse(target: string, context: Ctx): string[] {
  const acc: string[] = [''];
  for (let i = 0; i < target.length; ++i) {
    switch (target[i].trim()) {
      case '':
        void acc.push('');
        continue;
      case '\\':
        acc[acc.length - 1] += target[++i];
        continue;
      case '&': {
        const [[{ data = '&' }] = [{}], rest = target.slice(i + data.length)] = htmlentity(target.slice(i), context) || [];
        acc[acc.length - 1] += data;
        i = target.length - rest.length - 1;
        continue;
      }
      default:
        acc[acc.length - 1] += target[i];
        continue;
    }
  }
  return acc;
}
