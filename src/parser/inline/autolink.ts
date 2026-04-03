import { AutolinkParser } from '../inline';
import { State } from '../context';
import { union, state, lazy } from '../../combinator';
import { url, lineurl } from './autolink/url';
import { email } from './autolink/email';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { isAlphanumeric } from '../source/text';

const p1 = lazy(() => union([
  hashtag,
  hashnum,
]));
const p2 = lazy(() => union([
  lineurl,
  url,
  email,
]));
const p3 = lazy(() => union([
  url,
  email,
]));
export const autolink: AutolinkParser = lazy(() =>
  state(~State.autolink,
  (input, output) => {
    const { source, position } = input;
    if (position === source.length) return;
    const char = source[position];
    switch (char) {
      case '@':
        return account(input, output);
      case '#':
        return p1(input, output);
      case '>':
        return anchor(input, output);
      case '!':
        if (!source.startsWith('http', position + 1)) break;
        if (position === 0) return lineurl(input, output);
        switch (source[position - 1]) {
          case '\r':
          case '\n':
            return lineurl(input, output);
        }
        break;
      case 'h':
        if (!source.startsWith('http', position)) return;
        if (position === 0) return p2(input, output);
        switch (source[position - 1]) {
          case '\r':
          case '\n':
            return p2(input, output);
        }
        return p3(input, output);
      default:
        if (isAlphanumeric(char)) return email(input, output);
    }
  }));
