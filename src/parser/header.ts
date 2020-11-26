import { undefined, Symbol } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { block, validate, focus } from '../combinator';
import { segment } from './segment';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = block(validate('---', focus(
  // Must check the next line of the block.
  /^---[^\S\v\f\r\n]*\r?\n(?:[a-z][0-9a-z]*(?:-[a-z][0-9a-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n(?=[^\S\v\f\r\n]*(?:$|\r?\n)))/,
  source =>
    segment(source)[Symbol.iterator]().next().value === source
      ? [[html('div', { class: 'header' }, source.slice(source.indexOf('\n') + 1, source.lastIndexOf('\n', source.length - 2)))], '']
      : undefined)));
