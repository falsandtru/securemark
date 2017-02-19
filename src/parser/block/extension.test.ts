import { loop } from '../../combinator/loop';
import { extension } from './extension';

describe('Unit: parser/extension', () => {
  describe('extension', () => {
    it('invalid', () => {
      const parser = loop(extension);
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~\na~~~'));
      assert(!parser(' ~~~\n~~~'));
    });

    it('valid', () => {
      const parser = loop(extension);
      assert(parser('~~~\n~~~'));
    });

  });

});
