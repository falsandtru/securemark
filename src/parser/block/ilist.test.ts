import { ilist } from './ilist';
import { some } from '../../combinator';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = some(ilist);

    it('single', () => {
      assert(!parser('-'));
      assert(!parser('+'));
      assert(!parser('*'));
      assert(parser('- '));
      assert(parser('+ '));
      assert(parser('* '));
      assert(parser('-\n-'));
      assert(parser('+\n+'));
      assert(parser('*\n*'));
    });

  });

});
