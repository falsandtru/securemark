import { extension } from './extension';
import { some } from '../../combinator';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = (source: string) => some(extension)(source, {});

    it('invalid', () => {
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~\n\n'));
      assert(!parser('~~~\na~~~'));
      assert(!parser('~~~\n~~~'));
      assert(!parser('~~~\na\n~~~'));
      assert(!parser('~~~a'));
      assert(!parser('~~~a\n'));
      assert(!parser('~~~a\n\n'));
      assert(!parser('~~~a\nb~~~'));
      assert(!parser(' ~~~\n~~~'));
    });

    it('valid', () => {
      assert(parser('~~~a\n~~~'));
      assert(parser('~~~a\nb\n~~~'));
    });

  });

});
