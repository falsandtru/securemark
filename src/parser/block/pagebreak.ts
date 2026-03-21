import { PagebreakParser } from '../block';
import { List, Node } from '../../combinator/data/parser';
import { block, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const pagebreak: PagebreakParser = block(focus(
  /={3,}[^\S\r\n]*(?:$|\r?\n)/y,
  () => new List([new Node(html('hr'))])));
