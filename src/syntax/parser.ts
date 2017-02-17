import { loop } from '../parser/loop';
import { block } from './block';

export function parse(source: string): DocumentFragment {
  return Array.from((loop(block)(source) || [[]])[0])
    .reduce((doc, el) => (void doc.appendChild(el), doc), document.createDocumentFragment());
}
