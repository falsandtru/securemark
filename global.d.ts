declare global {
  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }
}

import assert from 'power-assert';

type Assert = typeof assert;

declare global {
  const assert: Assert;
}
