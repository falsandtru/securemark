import { extension } from './extension';
import { some } from '../../combinator';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = some(extension);

    it('invalid', () => {
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser(' ~~~\n~~~'));
    });

    it('valid', () => {
      assert(parser('~~~'));
      assert(parser('~~~\n'));
      assert(parser('~~~\n\n'));
      assert(parser('~~~\na~~~'));
      assert(parser('~~~\n~~~'));
      assert(parser('~~~\na\n~~~'));
    });

  });

});
