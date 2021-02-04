import { undefined } from 'spica/global';
import { RubyParser } from '../inline';
import { eval, exec } from '../../combinator/data/parser';
import { sequence, validate, focus, creator, surround, lazy, bind } from '../../combinator';
import { htmlentity } from './htmlentity';
import { text as txt } from '../source';
import { isEndTight } from '../util';
import { html, defrag } from 'typed-dom';
import { unshift, push, join } from 'spica/array';

export const ruby: RubyParser = lazy(() => creator(bind(
  validate('[', ')', '\n',
  sequence([
    surround('[', focus(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+(?=]\()/, text), ']'),
    surround('(', focus(/^(?:\\[^\n]|[^\)\n])+(?=\))/, text), ')'),
  ])),
  ([texts, rubies], rest) => {
    if (!texts[0][0].trimStart()) return;
    if (!isEndTight(texts)) return;
    texts[texts.length - 1] || texts.pop();
    assert(texts[texts.length - 1].trim());
    switch (true) {
      case rubies.length <= texts.length:
        return [[html('ruby', defrag(texts
          .reduce((acc, _, i) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i]
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')]))
          , [])))], rest];
      case texts.length === 1 && [...texts[0]].length >= rubies.length:
        return [[html('ruby', defrag([...texts[0]]
          .reduce((acc, _, i, texts) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i]
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')]))
          , [])))], rest];
      default:
        assert(rubies.length > 0);
        return [[html('ruby', defrag(unshift(
          [join(texts, ' ')],
          [html('rp', '('), html('rt', join(rubies, ' ').trim()), html('rp', ')')])))
        ], rest];
    }
  })));

const text: RubyParser.TextParser = creator((source, context) => {
  const acc = [''];
  while (source !== '') {
    assert(source[0] !== '\n');
    switch (source[0]) {
      case ' ':
      case '　':
        acc.push('');
        source = source.slice(1);
        continue;
      case '&': {
        const result = htmlentity(source, context);
        acc[acc.length - 1] += eval(result, [source[0]])[0];
        source = exec(result, source.slice(1));
        continue;
      }
      default: {
        const result = txt(source, context)!;
        assert(result);
        acc[acc.length - 1] += eval(result)[0] ?? source.slice(0, source.length - exec(result).length);
        source = exec(result);
        continue;
      }
    }
  }
  return join(acc).trimStart()
    ? [[acc], '']
    : undefined;
});
