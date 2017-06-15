import { parse } from './parser';

describe('Unit: parser', () => {
  describe('parse', () => {
    it('return type', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

});
