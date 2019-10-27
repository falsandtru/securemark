import { ParagraphParser } from '../../block';
import { subsequence, some, block, firstline, bind } from '../../../combinator';
import { address } from './mention/address';
import { quotation } from './mention/quotation';
import { html } from 'typed-dom';

export const mention: ParagraphParser.MentionParser = block(bind(
  subsequence([
    some(address),
    quotation,
  ]),
  (ns, rest) => [
    ns.reduceRight((acc, node) => {
      void acc.unshift(node, html('br'));
      return acc;
    }, firstline(rest).trim() === '' ? [ns.pop()!] : []),
    rest
  ]),
  false);
