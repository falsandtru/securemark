import { Input, Segment } from './context';
import { Parser, Result, List, Node } from '../combinator/parser';

export function build(segment: Parser<string, Input>, block: Parser<HTMLElement, Input>): Result<HTMLElement> {
  interface Memory {
    readonly position: number;
  }
  const loop: Result<string | HTMLElement, Input<Memory | List<Node<string>>>> = [
    (input, output) => {
      input.segment = Segment.unknown;
      input.memory = {
        position: input.position,
      };
      output.push();
      return output.context;
    },
    segment,
    (input, output) => {
      input.segment |= Segment.write;
      const segs = output.pop() as List<Node<string>>;
      assert(input.memory = input.memory as Memory);
      if (segs.length === 0) {
        segs.push(new Node(input.source.slice(input.memory.position, input.position)));
      }
      input.memory = segs;
      return input.memory.length === 0
        ? output.context
        : subloop;
    },
    (input, output) => {
      input.header &&= false;
      return input.position === input.source.length
        ? output.context
        : loop;
    },
  ];
  const subloop: Result<HTMLElement, Input<List<Node<string>>>> = [
    (input, output) => {
      input.scope.focus(input.memory.shift()!.value);
      return output.context;
    },
    block,
    (input, output) => {
      input.scope.unfocus();
      return input.memory.length === 0
        ? output.context
        : subloop;
    },
  ];
  return loop;
}
