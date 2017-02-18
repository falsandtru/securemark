import { Result } from '../../../parser.d';
import { ExtensionParser, consumeBlockEndEmptyLine } from '../../block';

type SubParsers = [never];

export const placeholder: ExtensionParser.PlaceholderParser = function (source: string): Result<HTMLElement, SubParsers> {
  const el = document.createElement('p');
  while (true) {
    const line = source.split('\n', 1)[0];
    el.textContent += line;
    source = source.slice(line.length + 1);
    if (source === '') break;
  }
  return consumeBlockEndEmptyLine<HTMLElement, SubParsers>([el], source);
}
