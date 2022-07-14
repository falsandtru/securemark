import { placeholder } from './placeholder';
import { some } from '../../../combinator';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)({ source, context: {} });

    it('invalid', () => {
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~a ~~~\n~~~'));
    });

    it('valid', () => {
      assert(parser('~~~\n~~~'));
      assert(parser('~~~a\n~~~'));
      assert(parser('~~~a \n~~~'));
      assert(parser('~~~a b \n~~~'));
      assert(parser('~~~~a\n~~~~'));
      assert(parser('~~~~a\n~~~~\n'));
    });

  });

});
