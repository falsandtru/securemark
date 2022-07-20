import { AutolinkParser } from '../../inline';
import { union, some, creation, precedence, validate, focus, rewrite, convert, surround, open, lazy, fmap } from '../../../combinator';
import { unsafelink } from '../link';
import { unescsource } from '../../source';
import { define } from 'typed-dom/dom';

const closer = /^[-+*=~^,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], fmap(rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, some(union([bracket, some(unescsource, closer)])))),
  convert(
    url => `{ ${url} }`,
    union([unsafelink]))),
  ([el]) => [define(el, { class: 'url' })])));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creation(precedence(2, union([
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('"', precedence(8, some(unescsource, '"')), '"', true),
]))));
