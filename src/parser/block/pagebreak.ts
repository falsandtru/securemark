import { PagebreakParser } from '../block';
import { List, Data } from '../../combinator/data/parser';
import { block, line, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const pagebreak: PagebreakParser = block(line(focus(
  /={3,}[^\S\n]*(?:$|\n)/y,
  () => new List([new Data(html('hr'))]))));
