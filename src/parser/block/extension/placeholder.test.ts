import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = (source: string) => some(placeholder)(input(source, ctx));
    const { context: ctx } = input('', new Context());

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
