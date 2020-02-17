import { ExtensionParser, inline } from '../../inline';
import { Ctx, union, some, subline, creator, backtracker, surround, clear, update, lazy, fmap } from '../../../combinator';
import { startTight, isTight, defrag } from '../../util';
import { indexee } from './indexee';
import { char } from '../../source';
import { html, define } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap(indexee(surround(
  '[#',
  subline(
  update({ syntax: { inline: {
    link: false,
    media: false,
    annotation: false,
    reference: false,
    extension: false,
    autolink: false,
  }}},
  startTight(union([some(inline, ']')])))),
  backtracker(clear(char(']'))), false,
  ([, bs = []], rest, _, context: DeepMutable<Ctx>) =>
    isTight(bs, 0, bs.length) || context.resource && void --context.resource.backtrack
      ? [[defrag(html('a', bs))], rest]
      : void 0)),
  ([el]: [HTMLElement]) =>
    [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
