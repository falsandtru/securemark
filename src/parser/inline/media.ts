﻿import { MediaParser } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { validate } from '../source/validation';
import { sanitize } from '../string/url';
import DOM from 'typed-dom';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLImageElement>(100);

const syntax = /^!\[[^\n]*?\]\n?\(/;

export const media: MediaParser = function (source: string): [[HTMLImageElement], string] | undefined {
  if (!validate(source, '![', syntax)) return;
  const [first, next] = bracket(
    '![',
    loop(combine<HTMLElement | Text, MediaParser.InnerParsers>([text]), /^\]\n?\(|^\n/),
    ']',
  )(source) || [[], source];
  if (!next.startsWith('(') && !next.startsWith('\n(')) return;
  const caption = first.reduce((s, c) => s + c.textContent, '').trim();
  const [second, rest] = bracket(
    '(',
    loop(escsource, /^\)|^\s/),
    ')',
  )(next.slice(next.indexOf('('))) || [[], source];
  if (rest === source) return;
  const url = sanitize(second.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1'));
  if (url === '') return;
  if (cache.has(url)) return [[cache.get(url)!.cloneNode(true) as HTMLImageElement], rest];
  const el = DOM.img({
    'data-src': url,
    alt: caption,
  }).element;
  return [[el], rest];
};
