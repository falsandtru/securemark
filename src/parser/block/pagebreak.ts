import { PagebreakParser } from '../block';
import { block, line, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const pagebreak: PagebreakParser = block(line(focus(
  /^={3,}[^\S\n]*(?:$|\n)/,
  () => [[html('hr')]])));
