﻿import { loop } from '../../combinator/loop';
import { extension } from './extension';

describe('Unit: parser/extension', () => {
  describe('extension', () => {
    const parser = loop(extension);

    it('invalid', () => {
      assert(!parser(''));
      assert(!parser('\n'));
      assert(!parser('~~~'));
      assert(!parser('~~~\n'));
      assert(!parser('~~~\na~~~'));
      assert(!parser(' ~~~\n~~~'));
    });

    it('valid', () => {
      assert(parser('~~~\n~~~'));
    });

  });

});
