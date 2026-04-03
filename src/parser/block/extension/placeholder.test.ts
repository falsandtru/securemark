import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = some(placeholder);

    it('invalid', () => {
      assert(!inspect(parser, input('')));
      assert(!inspect(parser, input('\n')));
      assert(!inspect(parser, input('~~~')));
      assert(!inspect(parser, input('~~~\n')));
      assert(!inspect(parser, input('~~~a ~~~\n~~~')));
    });

    it('valid', () => {
      assert(inspect(parser, input('~~~\n~~~')));
      assert(inspect(parser, input('~~~a\n~~~')));
      assert(inspect(parser, input('~~~a \n~~~')));
      assert(inspect(parser, input('~~~a b \n~~~')));
      assert(inspect(parser, input('~~~~a\n~~~~')));
      assert(inspect(parser, input('~~~~a\n~~~~\n')));
    });

  });

});
