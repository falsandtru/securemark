import { ExtensionParser } from '../../inline';
import { loop } from '../../../combinator';
import { link } from '../link';
import { text } from '../../source/text';
import { squash } from '../../squash';
import { isTightVisible } from '../../source/validation';
import { makeIndex } from '../../string/index';
import { template } from './template';

export const index: ExtensionParser.IndexParser = template((flag: string, query: string): [[HTMLAnchorElement], string] | undefined => {
  if (flag !== '#') return;
  const [[el = undefined] = [], rest = ''] = link(`[](#)`) || [];
  if (!el) return;
  el.textContent = squash((loop(text)(query) || [[]])[0]).textContent!;
  if (!isTightVisible(el.textContent)) return;
  void el.setAttribute('href', `#${makeIndex(el.textContent)}`);
  return [[el], rest];
});
