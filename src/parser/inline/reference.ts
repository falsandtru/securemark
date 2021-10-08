import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { union, subsequence, some, validate, verify, focus, guard, context, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isStartTight, markVerboseTail, stringify } from '../util';
import { html, defrag } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(validate('[[', ']]', '\n', fmap(surround(
  '[[',
  guard(context => context.syntax?.inline?.reference ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //index: true,
    //label: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  subsequence([
    abbr,
    focus('^', c => [['', c], '']),
    some(inline, ']', /^\\?\n/),
  ])))),
  ']]'),
  ns => [html('sup', attributes(ns), markVerboseTail(defrag(ns)))]))));

const abbr: ReferenceParser.AbbrParser = creator(fmap(verify(surround(
  '^',
  union([str(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:['-]|[.,]? |\., )[0-9A-Za-z]+)*/)]),
  /^[^\S\n]?\|?(?=]])|^\|[^\S\n]/),
  (_, rest, context) => isStartTight(rest, context)),
  ([source]) => [html('abbr', source)]));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
    ? {
        class: 'reference',
        'data-abbr': stringify([ns.shift()!]),
      }
    : ns[0] === ''
      ? {
          class: 'reference invalid',
          'data-invalid-syntax': 'reference',
          'data-invalid-type': 'syntax',
          'data-invalid-description': 'Invalid abbr.',
        }
      : { class: 'reference' };
}
