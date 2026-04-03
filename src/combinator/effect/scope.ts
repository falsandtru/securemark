import { Parser, Input, Output, subinput } from '../parser';
import { always } from '../control/state';

interface Memory {
  readonly SID: number;
  readonly source: string;
  readonly position: number;
  readonly offset: number;
  readonly linebreak: number;
  readonly range: number;
}

export class Scope<I extends Input> {
  constructor(input: I) {
    this.inputs.push(input);
  }
  private readonly inputs: I[] = [];
  private readonly memories: Memory[] = [];
  public peek(): I {
    //assert(this.inputs.length > 0);
    return this.inputs.at(-1)!;
  }
  public focus(subsource: string): void {
    const input = this.peek();
    assert(subsource.length <= input.source.length);
    assert(input.position - subsource.length >= 0);
    input.position -= subsource.length;
    const { SID, source, position, offset, linebreak, range } = input;
    this.memories.push({
      SID,
      source,
      position,
      offset,
      linebreak,
      range,
    });
    subinput(subsource, input);
  }
  public unfocus(state = true, continuous = false): void {
    assert(this.memories.length > 0);
    const input = this.peek();
    const { source, position } = input;
    const memory = this.memories.pop()!;
    input.SID = memory.SID;
    input.position = state
      ? continuous && position > 0
        ? memory.position + position
        : memory.position + source.length
      : memory.position;
    input.source = memory.source;
    assert(position <= source.length);
    input.offset = memory.offset;
    input.linebreak = memory.linebreak;
    input.range = memory.range;
  }
  public push(source: string): I {
    const input = this.peek().clone(source);
    this.inputs.push(input);
    return input;
  }
  public pop(): I {
    this.inputs.pop();
    return this.peek();
  }
}

export function scope<P extends Parser>(
  conv: (input: Parser.Input<P>, output: Output<Parser.Node<P>>) => string,
  parser: P,
  isolation: boolean,
): P;
export function scope<T>(
  conv: (input: Input, output: Output<T>) => string,
  parser: Parser<T>,
  isolation: boolean,
): Parser<T> {
  assert(parser);
  return always([
    (input, output) => {
      const { source, position } = input;
      const src = conv(input, output);
      !isolation && input.position === position
        ? input.position = source.length
        : 0;
      isolation
        ? input.scope.push(src)
        : input.scope.focus(src);
      return output.context;
    },
    parser,
    (input, output) => {
      isolation
        ? input.scope.pop()
        : input.scope.unfocus();
      if (!output.state) return;
      assert(input.position <= input.source.length);
      return output.context;
    },
  ]);
}
