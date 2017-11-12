import { Result } from '../../../combinator';
import { ExtensionParser } from '../../inline';
import { TextParser } from '../../source';
import { link } from '../link';
import { makeIndex } from '../../string/index';
import { template } from './template';

type SubParsers = [TextParser];

export const index: ExtensionParser.IndexParser = template(function (flag: string, query: string): Result<HTMLAnchorElement, SubParsers> {
  if (flag !== '#') return;
  const result = link(`[](#)`);
  if (!result) return;
  const [[el]] = result;
  void el.setAttribute('href', `#${makeIndex(query)}`);
  el.textContent = query;
  return result as Result<HTMLAnchorElement, SubParsers>;
});
