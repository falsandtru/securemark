import { autolink } from './autolink';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink', () => {
  describe('autolink', () => {
    const parser = some(autolink);

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('!http://host')), [['!', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
    });

  });

});
