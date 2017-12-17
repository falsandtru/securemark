import { ExtensionParser } from '../../inline';
import { link } from '../link';
import { isTightVisible } from '../../source/validation';
import { defineIndex } from '../../block/util/index';
import { template } from './template';

export const index: ExtensionParser.IndexParser = template((flag, query, frag): [[HTMLAnchorElement], string] | undefined => {
  if (flag !== '#') return;
  if (frag.textContent === flag) return;
  const [[el = undefined] = [], rest = ''] = link(`[${query}]()`) || [];
  if (!el) return;
  assert(rest === '');
  if (!isTightVisible(el.textContent!)) return;
  void defineIndex(el);
  void el.setAttribute('href', `#${el.id}`);
  void el.removeAttribute('id');
  return [[el], rest];
});
