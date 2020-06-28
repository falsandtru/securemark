import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { block, focus, validate } from '../combinator';
import { segment } from './segment';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = block(validate('---', focus(
  // Must check the next line of the block.
  /^---[^\S\n]*\n(?:[a-z][^\n]*\n){1,100}---[^\S\n]*(?:$|\n(?=[^\S\n]*(?:$|\n)))/,
  // TODO: Set the specified base URL.
  source =>
    segment(source)[0] === source
      ? [[html('div', { class: 'header' }, source.slice(source.indexOf('\n') + 1, source.lastIndexOf('\n', -1)))], '']
      : undefined)));
