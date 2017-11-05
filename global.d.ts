declare global {
  interface HTMLCollectionOf<T extends Element> extends Iterable<T> { }
  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }
}

import assert from 'power-assert';

type Assert = typeof assert;

declare global {
  const assert: Assert;
}
