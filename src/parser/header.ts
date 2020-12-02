import { MarkdownParser } from '../../markdown';
import { validate, focus } from '../combinator';
import { syntax } from './api/header';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = validate('---', focus(
  syntax,
  source => [[
    html('details', { class: 'header' }, [
      html('summary', 'Header'),
      source.slice(source.indexOf('\n') + 1, source.trimEnd().lastIndexOf('\n')),
    ])
  ], '']));
