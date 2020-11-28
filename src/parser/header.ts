import { undefined, Symbol } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { validate, focus, convert } from '../combinator';
import { normalize } from './api/normalize';
import { segment } from './segment';
import { html } from 'typed-dom';

// Case-insensitive

export const header: MarkdownParser.HeaderParser = validate('---', focus(
  // Must ensure that the next line is blank.
  /^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n(?=[^\S\v\f\r\n]*(?:$|\r?\n)))/,
  convert(normalize,
  source =>
    segment(source)[Symbol.iterator]().next().value === source
      ? [[html('details', { class: 'header' }, [html('summary', 'Header'), source.slice(source.indexOf('\n') + 1, source.lastIndexOf('\n', source.length - 2))])], '']
      : undefined)));
