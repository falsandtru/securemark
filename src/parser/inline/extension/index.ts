import { ExtensionParser } from '../../inline';
import { link } from '../link';
import { makeIndex } from '../../string/index';
import { template } from './template';

export const index: ExtensionParser.IndexParser = template((flag: string, query: string): [[HTMLAnchorElement], string] | undefined => {
  if (flag !== '#') return;
  const [[el = undefined] = [], rest = ''] = link(`[](#)`) || [];
  if (!el) return;
  void el.setAttribute('href', `#${makeIndex(query)}`);
  el.textContent = query;
  return [[el], rest];
});
