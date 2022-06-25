export class Memo {
  private memory: Record<string, readonly [any[], number]>[/* pos */] = [];
  public get length(): number {
    return this.memory.length;
  }
  public offset = 0;
  public get(
    position: number,
    rule: number,
    syntax: number,
    state: number,
  ): readonly [any[], number] | undefined {
    //console.log('get', position + this.offset, rule, syntax, state, this.memory[position + this.offset - 1]?.[`${rule}:${syntax}:${state}`]);;
    return this.memory[position + this.offset - 1]?.[`${rule}:${syntax}:${state}`];
  }
  public set(
    position: number,
    rule: number,
    syntax: number,
    state: number,
    nodes: any[],
    offset: number,
  ): void {
    const record = this.memory[position + this.offset - 1] ??= {};
    assert(!record[`${rule}:${syntax}:${state}`]);
    record[`${rule}:${syntax}:${state}`] = [nodes, offset];
    //console.log('set', position + this.offset, rule, syntax, state);
  }
  public clear(position: number): void {
    const memory = this.memory;
    for (let i = position + this.offset, len = memory.length; i < len; ++i) {
      memory.pop();
    }
    //console.log(position);
  }
}
