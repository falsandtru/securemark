import { parse } from './parser';

describe('Unit: renderer/parser', () => {
  describe('parse', () => {
    it('result', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

});
