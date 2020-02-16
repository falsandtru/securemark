import { ExtensionParser, inline } from '../../inline';
import { Ctx, union, some, subline, creator, backtracker, surround, update, lazy, fmap, bind } from '../../../combinator';
import { startTight, isTight, defrag } from '../../util';
import { indexee } from './indexee';
import { str } from '../../source';
import { html, define } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const index: ExtensionParser.IndexParser = lazy(() => creator(fmap<HTMLAnchorElement, ExtensionParser.IndexParser>(indexee(bind(surround(
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
  backtracker(str(']'))),
  (ns, rest, _, context: DeepMutable<Ctx>) =>
    isTight(ns, 0, ns.length) || context.resource && void --context.resource.backtrack
      ? [[defrag(html('a', ns))], rest]
      : void 0)),
  ([el]) => [define(el, { id: null, class: 'index', href: el.id ? `#${el.id}` : void 0 }, el.childNodes)])));
