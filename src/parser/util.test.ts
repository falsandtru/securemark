import { visualize } from './util';

describe('Unit: parser/util', () => {
  describe('visualize', () => {
    it('stress', () => {
      visualize(s => [[s], ''])(`[# ${'a'.repeat(100000 - 6)} #]`);
      visualize(s => [[s], ''])(`[# ${'a\n'.repeat(100000 / 2 - 6 / 2)} #]`);
      visualize(s => [[s], ''])(`[# a${' '.repeat(100000 - 6)} #`);
    });

  });

});
