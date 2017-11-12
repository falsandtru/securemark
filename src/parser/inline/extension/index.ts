import { ExtensionParser } from '../../inline';
import { link } from '../link';
import { makeIndex } from '../../string/index';
import { template } from './template';

export const index: ExtensionParser.IndexParser = template(function (flag: string, query: string): [[HTMLAnchorElement], string] | undefined {
  if (flag !== '#') return;
  const result = link(`[](#)`);
  if (!result) return;
  const [[el], rest] = result;
  void el.setAttribute('href', `#${makeIndex(query)}`);
  el.textContent = query;
  return [[el], rest];
});
