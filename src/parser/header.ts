import { MarkdownParser } from '../../markdown';
import { block, focus, validate } from '../combinator';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = block(validate('---', focus(
  /^---[^\S\n]*\n(?:[a-z].*\n){1,100}---\s*$/,
  // TODO: Set the specified base URL.
  source => [[html('div', { class: 'header' }, source.slice(source.indexOf('\n') + 1, source.lastIndexOf('\n', -1)))], ''])));
