import { ExtensionParser } from '../../inline';
import { line } from '../../source/line';
import { template } from './template';
import { match } from '../../source/validation';
import { link } from '../link';

const syntax = /^[a-z]+(?:(?:-[a-z][0-9a-z]*|-[0-9]+[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)$/;

export const label: ExtensionParser.LabelParser = line(template(':', query => {
  if (!match(query, '', syntax)) return;
  const [[el = undefined] = [], rest = ''] = link(`[${query}](#${makeLabel(query)})`) || [];
  if (!el) return;
  assert(rest === '');
  void el.setAttribute('class', el.getAttribute('href')!.slice(1));
  return [[el], ''];
}), false);

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
