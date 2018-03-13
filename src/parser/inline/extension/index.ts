import { ExtensionParser } from '../../inline';
import { line } from '../../source/line';
import { hasTightText } from '../util/verification';
import { template } from './template';
import { link } from '../link';
import { defineIndex } from '../../block/indexer';

export const index: ExtensionParser.IndexParser = line(template('#', query => {
  const [[el = undefined] = [], rest = ''] = link(`[${query}]()`) || [];
  if (!el) return;
  assert(rest === '');
  if (!hasTightText(el)) return;
  void defineIndex(el);
  void el.setAttribute('href', `#${el.id.toLowerCase()}`);
  void el.removeAttribute('id');
  return [[el], ''];
}), false);
