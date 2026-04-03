import { ExtensionParser } from '../../block';
import { Node } from '../../../combinator/parser';
import { inits, block, fence } from '../../../combinator';
import { unwrap, invalid } from '../../util';
import { html } from 'typed-dom/dom';

const opener = /(~{3,})(?!~)[^\r\n]*(?:$|\r?\n)/y;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(
  fence(opener, false));

export const segment_: ExtensionParser.PlaceholderParser.SegmentParser = block(
  fence(opener, false, false), false);

export const placeholder: ExtensionParser.PlaceholderParser = block(inits([
  fence(opener, true),
  (_, output) => {
    const [body, overflow, closer, opener, delim] = unwrap(output.pop()) as string[];
    return output.append(
      new Node(html('pre',
        {
          class: 'invalid',
          translate: 'no',
          ...invalid(
            'extension',
            'fence',
            !closer ? `Missing the closing delimiter "${delim}"` :
              overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                'Invalid argument'),
        },
        `${opener}${body}${overflow || closer}`)));
  },
]));
