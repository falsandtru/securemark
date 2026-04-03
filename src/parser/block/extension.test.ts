import { extension } from './extension';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = some(extension);

    it('invalid', () => {
      assert(!inspect(parser, input('')));
      assert(!inspect(parser, input('\n')));
      assert(!inspect(parser, input('~~~')));
      assert(!inspect(parser, input('~~~\n')));
      assert(!inspect(parser, input('~~~\n\n')));
      assert(inspect(parser, input('~~~\na~~~')));
      assert(!inspect(parser, input('~~~a')));
      assert(!inspect(parser, input('~~~a ~~~\n~~~')));
      assert(!inspect(parser, input('~~~a\n')));
      assert(!inspect(parser, input('~~~a\n\n')));
      assert(inspect(parser, input('~~~a\nb~~~')));
      assert(!inspect(parser, input(' ~~~a\nb~~~')));
      assert(!inspect(parser, input('$-name')));
      assert(!inspect(parser, input('$-name-0')));
      assert(!inspect(parser, input('$group-0')));
    });

    it('valid', () => {
      assert(inspect(parser, input('~~~\n~~~')));
      assert(inspect(parser, input('~~~\na\n~~~')));
      assert(inspect(parser, input('~~~a\n~~~')));
      assert(inspect(parser, input('~~~a\nb\n~~~')));
      //assert(inspect(parser, input('$-0')));
      //assert(inspect(parser, input('$-0\n')));
      //assert(inspect(parser, input('$-0\n\n')));
    });

  });

});
