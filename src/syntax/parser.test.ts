import { parse } from './parser';

describe('Unit: syntax/parser', () => {
  describe('parse', () => {
    it('return type', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

});
