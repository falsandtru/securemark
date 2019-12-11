import { placeholder } from './placeholder';
import { some } from '../../../combinator';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)(source, {});

    it('invalid', () => {
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~\n~~~'));
      assert(!parser('~~~\n~~~\n'));
      assert(!parser('~~~a\n~~~\n~~~'));
      assert(!parser('~~~a\n~~~~'));
      assert(!parser('~~~a\n~~~~\n'));
      assert(!parser('~~~~a\n~~~'));
      assert(!parser('~~~~a\n~~~\n'));
      assert(!parser('~~~ a\n~~~'));
      assert(!parser('~~~\n<"\n~~~'));
      assert(!parser(' ~~~\n~~~'));
    });

    it('valid', () => {
      assert(parser('~~~a\n~~~'));
      assert(parser('~~~a \n~~~'));
      assert(parser('~~~a b \n~~~'));
      assert(parser('~~~~a\n~~~~'));
      assert(parser('~~~~a\n~~~~\n'));
    });

  });

});
