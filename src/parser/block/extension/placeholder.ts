import { ExtensionParser } from '../../block';
import { List, Node } from '../../../combinator/data/parser';
import { block, fence, clear, fmap } from '../../../combinator';
import { unwrap, invalid } from '../../util';
import { html } from 'typed-dom/dom';

const opener = /(~{3,})(?!~)[^\n]*(?:$|\n)/y;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(
  clear(fence(opener, 300)));

export const segment_: ExtensionParser.PlaceholderParser.SegmentParser = block(
  clear(fence(opener, 300, false)), false);

export const placeholder: ExtensionParser.PlaceholderParser = block(fmap(
  fence(opener, Infinity),
  nodes => {
    const [body, overflow, closer, opener, delim] = unwrap(nodes);
    return new List([
      new Node(html('pre', {
        class: 'invalid',
        translate: 'no',
        ...invalid(
          'extension',
          'fence',
          !closer ? `Missing the closing delimiter "${delim}"` :
            overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
              'Invalid argument'),
      }, `${opener}${body}${overflow || closer}`)),
    ]);
  }));
