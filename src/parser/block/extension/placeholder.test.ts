import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = some(placeholder);

    it('invalid', () => {
      assert(!parser(input('', new Context())));
      assert(!parser(input('\n', new Context())));
      assert(!parser(input('~~~', new Context())));
      assert(!parser(input('~~~\n', new Context())));
      assert(!parser(input('~~~a ~~~\n~~~', new Context())));
    });

    it('valid', () => {
      assert(parser(input('~~~\n~~~', new Context())));
      assert(parser(input('~~~a\n~~~', new Context())));
      assert(parser(input('~~~a \n~~~', new Context())));
      assert(parser(input('~~~a b \n~~~', new Context())));
      assert(parser(input('~~~~a\n~~~~', new Context())));
      assert(parser(input('~~~~a\n~~~~\n', new Context())));
    });

  });

});
