import { placeholder } from './placeholder';
import { loop } from '../../../combinator';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = loop(placeholder);

    it('invalid', () => {
      assert(!parser('[]'));
      assert(!parser('[a]'));
      assert(!parser('[ab]'));
      assert(!parser('[:a\nb]'));
      assert(!parser('[:a\\\nb]'));
      assert(!parser('[:\n]'));
      assert(!parser('[:\\\n]'));
      assert(!parser('[:\\]'));
      assert(!parser('[[]'));
      assert(!parser('[]]'));
    });

    it('valid', () => {
      assert(parser('[:]'));
      assert(parser('[: ]'));
      assert(parser('[:a]'));
      assert(parser('[:a b]'));
      assert(parser('[: a]'));
      assert(parser('[:a ]'));
      assert(parser('[:\\ ]'));
      assert(parser('[:\\ a]'));
      assert(parser('[:a\\ ]'));
      assert(parser('[:\\]]'));
      assert(parser('[:`a`]'));
      assert(parser('[[]]'));
      assert(parser('[[ ]]'));
      assert(parser('[[a]]'));
    });

  });

});
