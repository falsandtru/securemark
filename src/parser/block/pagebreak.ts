import { PagebreakParser } from '../block';
import { Node } from '../../combinator/parser';
import { block, focus } from '../../combinator';
import { html } from 'typed-dom/dom';

export const pagebreak: PagebreakParser = block(focus(
  /={3,}[^\S\r\n]*(?:$|\r?\n(?=[^\S\r\n]*(?:$|\r?\n)))/y,
  (_, output) => output.append(new Node(html('hr')))));
