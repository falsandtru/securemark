import { ExtensionParser } from '../../inline';
import { template } from './template';
import { link } from '../link';
import { match } from '../../source/validation';

const syntax = /^[a-z]+(?:(?:-[a-z][0-9a-z]*|-[0-9]+[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)$/;

export const label: ExtensionParser.LabelParser = template(':', query => {
  if (!match(query, '', syntax)) return;
  const [[el = undefined] = [], rest = ''] = link(`[${query}](#${makeLabel(query)})`) || [];
  if (!el) return;
  assert(rest === '');
  void el.setAttribute('class', el.getAttribute('href')!.slice(1));
  return [[el], ''];
});

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
