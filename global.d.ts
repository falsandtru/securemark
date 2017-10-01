declare global {
  interface Element {
    cloneNode(deep?: boolean): this;
  }
  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }
}

import assert from 'power-assert';

type Assert = typeof assert;

declare global {
  const assert: Assert;
}
