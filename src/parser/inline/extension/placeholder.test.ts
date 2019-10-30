import { placeholder } from './placeholder';
import { some } from '../../../combinator';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)(source, {});

    it('invalid', () => {
      assert(!parser('[]'));
      assert(!parser('[a]'));
      assert(!parser('[ab]'));
      assert(!parser('[^]'));
      assert(!parser('[^]]'));
      assert(!parser('[^a\nb]'));
      assert(!parser('[^a\\\nb]'));
      assert(!parser('[^\n]'));
      assert(!parser('[^\\\n]'));
      assert(!parser('[^\\]'));
      assert(!parser('[[]'));
      assert(!parser('[]]'));
      assert(!parser('[[]]'));
      assert(!parser('[[ ]]'));
      assert(!parser('[[a]]'));
    });

    it('valid', () => {
      assert(parser('[^ ]'));
      assert(parser('[^a]'));
      assert(parser('[^a b]'));
      assert(parser('[^ a]'));
      assert(parser('[^a ]'));
      assert(parser('[^\\ ]'));
      assert(parser('[^\\ a]'));
      assert(parser('[^a\\ ]'));
      assert(parser('[^\\]]'));
      assert(parser('[^`a`]'));
    });

  });

});
