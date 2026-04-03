import { always } from '../control/state';
import { Parser, Input } from '../parser';
import { Scope } from './scope';

interface Data {
  readonly segment: number;
  readonly position: number;
  readonly range: number;
  readonly linebreak: number;
}

export class Backtrack {
  constructor(
    private readonly scope: Scope<Input>,
  ) {
  }
  private readonly stack: Data[] = [];
  public memory(data: Data): void {
    this.stack.push(data);
  }
  private unmemory(): void {
    this.stack.pop();
  }
  private backtrack(): void {
    assert(this.stack.length > 0);
    const { segment, position, range, linebreak } = this.stack.pop()!;
    const input = this.scope.peek();
    input.segment = segment;
    input.position = position;
    input.range = range;
    input.linebreak = linebreak;
  }
  public handle(state: boolean): void {
    state
      ? this.unmemory()
      : this.backtrack();
  }
}

export function backtrack<P extends Parser>(parser: P): P;
export function backtrack<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return always([
    (input, output) => {
      const { backtrack, segment, position, range, linebreak } = input;
      backtrack.memory({
        segment,
        position,
        range,
        linebreak,
      });
      output.push();
      return output.context;
    },
    parser,
    ({ backtrack }, output) => {
      output.state
        ? output.flat()
        : output.pop();
      backtrack.handle(output.state);
      return output.context;
    },
  ]);
}
