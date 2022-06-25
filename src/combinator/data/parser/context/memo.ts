import { splice } from 'spica/array';

export class Memo {
  private memory: Record<string, readonly [any[], number]>[/* pos */] = [];
  public get length(): number {
    return this.memory.length;
  }
  public get(
    position: number,
    rule: number,
    syntax: number,
    state: number,
  ): readonly [any[], number] | undefined {
    return this.memory[position - 1]?.[`${rule}:${syntax}:${state}`];
  }
  public set(
    position: number,
    rule: number,
    syntax: number,
    state: number,
    nodes: any[],
    offset: number,
  ): void {
    const record = this.memory[position - 1] ??= {};
    record[`${rule}:${syntax}:${state}`] = [nodes, offset];
  }
  public clear(position: number): void {
    splice(this.memory, position, this.memory.length - position);
  }
}
