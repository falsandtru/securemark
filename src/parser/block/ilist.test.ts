import { ilist } from './ilist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = (source: string) => some(ilist)(input(source, {}));

    it('single', () => {
      assert(!parser('-'));
      assert(!parser('+'));
      assert(!parser('*'));
      assert(!parser(' * '));
      assert(parser('- '));
      assert(parser('+ '));
      assert(parser('* '));
      assert(parser('-\n-'));
      assert(parser('+\n+'));
      assert(parser('*\n*'));
    });

  });

});
