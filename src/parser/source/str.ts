import { undefined } from 'spica/global';
import { StrParser } from '../source';
import { Parser, Context } from '../../combinator/data/parser';
import { creation } from '../../combinator';

export function str(pattern: string | RegExp): StrParser;
export function str(pattern: string | RegExp): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  return typeof pattern === 'string'
    ? creation(1, false, ({ source }) => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      })
    : creation(1, false, ({ source }) => {
        if (source === '') return;
        const m = source.match(pattern);
        return m && m[0].length > 0
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      });
}

export function stropt(pattern: string | RegExp): StrParser;
export function stropt(pattern: string | RegExp): Parser<string, Context<StrParser>, []> {
  assert(pattern);
  return typeof pattern === 'string'
    ? creation(1, false, ({ source }) => {
        if (source === '') return;
        return source.slice(0, pattern.length) === pattern
          ? [[pattern], source.slice(pattern.length)]
          : undefined;
      })
    : creation(1, false, ({ source }) => {
        if (source === '') return;
        const m = source.match(pattern);
        return m
          ? [[m[0]], source.slice(m[0].length)]
          : undefined;
      });
}
