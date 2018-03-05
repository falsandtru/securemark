import { ExtensionParser } from '../../inline';
import { template } from './template';
import { link } from '../link';
import { defineIndex } from '../../block/util/indexer';
import { isTightVisible } from '../../source/validation';

export const index: ExtensionParser.IndexParser = template('#', query => {
  const [[el = undefined] = [], rest = ''] = link(`[${query}]()`) || [];
  if (!el) return;
  assert(rest === '');
  if (!isTightVisible(el.textContent!)) return;
  void defineIndex(el);
  void el.setAttribute('href', `#${el.id}`);
  void el.removeAttribute('id');
  return [[el], ''];
});
