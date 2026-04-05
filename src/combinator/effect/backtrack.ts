import { always } from '../control/state';
import { Parser, Input, Output, List } from '../parser';
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
  public handle(output: Output<unknown>): void {
    output.state
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
      output.labels.push(new List());
      output.annotations.push(new List());
      output.references.push(new List());
      return output.context;
    },
    parser,
    ({ backtrack }, output) => {
      backtrack.handle(output);
      if (output.state) {
        output.import(output.pop());
        output.labels.at(-2)!.import(output.labels.pop()!);
        output.annotations.at(-2)!.import(output.annotations.pop()!);
        output.references.at(-2)!.import(output.references.pop()!);
      }
      else {
        output.pop();
        output.labels.pop();
        output.annotations.pop();
        output.references.pop();
      }
      return output.context;
    },
  ]);
}
