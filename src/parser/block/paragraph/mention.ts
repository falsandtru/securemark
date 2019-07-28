import { ParagraphParser } from '../../block';
import { subsequence, some, block, bind } from '../../../combinator';
import { address } from './mention/address';
import { quote } from './mention/quote';
import { firstline } from '../../../combinator';
import { html } from 'typed-dom';

export const mention: ParagraphParser.MentionParser = block(bind(
  subsequence([
    some(address),
    quote,
  ]),
  (ns, rest) => [
    ns.reduceRight((acc, node) => {
      void acc.unshift(node, html('br'));
      return acc;
    }, firstline(rest).trim() === '' ? [ns.pop()!] : []),
    rest
  ]),
  false);
