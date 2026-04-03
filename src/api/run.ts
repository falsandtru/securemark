export function run(parser: Iterator<void, DocumentFragment, void>): DocumentFragment {
  for (;;) {
    const { value, done } = parser.next();
    if (done) return value;
  }
}
