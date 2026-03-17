import { AutolinkParser } from '../inline';
import { State } from '../context';
import { state, lazy } from '../../combinator';
import { url, lineurl } from './autolink/url';
import { email } from './autolink/email';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';
import { hashnum } from './autolink/hashnum';
import { anchor } from './autolink/anchor';
import { isAlphanumeric } from '../source/text';

export const autolink: AutolinkParser = lazy(() =>
  state(~State.autolink,
  input => {
    const { source, position } = input;
    if (position === source.length) return;
    const char = source[position];
    switch (char) {
      case '@':
        return account(input);
      case '#':
        return hashtag(input) || hashnum(input);
      case '>':
        return anchor(input);
      case '!':
        if (!source.startsWith('http', position + 1)) break;
        if (position === 0) return lineurl(input);
        switch (source[position - 1]) {
          case '\r':
          case '\n':
            return lineurl(input);
        }
        break;
      case 'h':
        if (!source.startsWith('http', position)) return;
        if (position === 0) return lineurl(input) || url(input) || email(input);
        switch (source[position - 1]) {
          case '\r':
          case '\n':
            return lineurl(input) || url(input) || email(input);
        }
        return url(input) || email(input);
      default:
        if (isAlphanumeric(char)) return email(input);
    }
  }));
