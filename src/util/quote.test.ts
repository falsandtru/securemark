import { quote } from './quote';
import { parse } from '../parser';

describe('Unit: util/quote', () => {
  describe('quote', () => {
    it('basic', () => {
      const range = document.createRange();
      const el = parse('>>1\n> a\n>0 `b` ${c}$ !{d}\n[e](f)').firstElementChild!;
      range.setStart(el.firstChild!.firstChild!, 0);
      range.setEnd(el.lastChild!.lastChild!.lastChild!, 1);
      assert(quote('2', range) === `>>>1\n>> a\n>>2\n> >0 \`b\` \${c}$ !${new URL('d', location.href).href}\n> e`);
    });

    it('adjustment', () => {
      const range = document.createRange();
      const el = parse('>>>1\n>> a').firstElementChild!;
      range.setEnd(el.lastChild!.lastChild!, 4);
      range.setStart(el.firstChild!.firstChild!, 0);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.firstChild!.firstChild!, 1);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.firstChild!.firstChild!, 2);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.children[0].firstElementChild!.firstChild!, 0);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.children[0].firstElementChild!.firstChild!, 1);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.children[0].firstElementChild!.firstChild!, 2);
      assert(quote('2', range) === '>>>>1\n>>> a\n>>2');
      range.setStart(el.children[1], 0);
      assert(quote('2', range) === '>>> a\n>>2');
      range.setStart(el.children[2].firstChild!, 0);
      assert(quote('2', range) === '>>> a\n>>2');
      range.setStart(el.children[2].firstChild!, 1);
      assert(quote('2', range) === '>>> a\n>>2');
      range.setStart(el.children[2].firstChild!, 2);
      assert(quote('2', range) === '>>> a\n>>2');
      range.setStart(el.children[2].firstChild!, 3);
      assert(quote('2', range) === '>>2\n> a');
      range.setStart(el.children[2].firstChild!, 4);
      assert(quote('2', range) === '');
    });

  });

});