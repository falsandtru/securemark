import { EmojiParser } from '../inline';
import { subline, focus } from '../../combinator';
import '../source/unescapable';
import { html } from 'typed-dom';

export const emoji: EmojiParser = subline(focus(
  /^:([a-z0-9]+(?:_[a-z0-9]+)*):/,
  source =>
    [[html('span', { class: 'emoji', 'data-name': source.slice(1, -1) }, source)], '']));
