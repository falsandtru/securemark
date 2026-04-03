import { ilist } from './ilist';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ilist', () => {
  describe('ilist', () => {
    const parser = some(ilist);

    it('single', () => {
      assert(!inspect(parser, input('-')));
      assert(!inspect(parser, input('+')));
      assert(!inspect(parser, input('*')));
      assert(inspect(parser, input('- ')));
      assert(inspect(parser, input('+ ')));
      assert(inspect(parser, input('* ')));
    });

  });

});
