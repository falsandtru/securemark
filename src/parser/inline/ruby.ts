import { RubyParser } from '../inline';
import { Ctx, sequence, creator, bind, surround } from '../../combinator';
import { defrag } from '../util';
import { htmlentity } from './htmlentity';
import { str } from '../source';
import { html } from 'typed-dom';
import { unshift, push, join } from 'spica/array';

export const ruby: RubyParser = creator(bind(
  sequence([
    surround('[', str(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/), ']'),
    surround('(', str(/^(?:\\[^\n]|[^\)\n])+/), ')'),
  ]),
  ([t, r], rest, context) => {
    const texts = parse(t, context);
    const rubies = parse(r, context);
    if (!join(texts).trim() || !join(rubies).trim()) return;
    switch (true) {
      case rubies.length <= texts.length:
        return [[html('ruby', defrag(texts
          .reduce<(HTMLElement | string)[]>((acc, _, i) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')] as typeof acc))
          , [])))], rest];
      case texts.length === 1 && [...texts[0]].length >= rubies.length:
        return [[html('ruby', defrag([...texts[0]]
          .reduce<(HTMLElement | string)[]>((acc, _, i, texts) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')] as typeof acc))
          , [])))], rest];
      default:
        return [[
          html('ruby', defrag(unshift<HTMLElement | string>(
            [join(texts, ' ')],
            rubies.length === 0
              ? []
              : [
                  html('rp', '('),
                  html('rt', join(rubies, ' ')),
                  html('rp', ')'),
                ])))
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
        const [[data = '&'] = [], rest = target.slice(i + data.length)] = htmlentity(target.slice(i), context) || [];
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
