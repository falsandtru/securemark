import { Delimiters } from './delimiter';
import { Backtrack } from './effect/backtrack';
import { Scope } from './effect/scope';
import { List, Node } from './parser/list';

// パーサーは基本的に成否の文脈に関わらず実行され成否による処理の分岐は可能な限り
// 文脈の検査でなく継続の分岐により行わなければならない。
export type Parser<T = unknown, I extends Input = Input, S extends SubParsers<unknown, I> = SubParsers<never, I>> =
  (input: I, output: Output<T>) => Result<T, I, S>;
export type SubParsers<T, I extends Input = Input> = readonly Parser<T, I, SubParsers<never, I>>[];
export namespace Parser {
  export type Node<P extends Parser> = P extends Parser<infer T> ? T : never;
  export type Input<P extends Parser> = P extends Parser<unknown, infer I> ? I : never;
  export type SubParsers<P extends Parser> = P extends Parser<unknown, any, infer S> ? S : never;
  export type IntermediateParser<P extends Parser> = Parser<SubNode<P>, Input<P>, SubParsers<P>>;
  export type SubNode<P extends Parser> = NonNever<ExtractSubNode<SubParsers<P>>, Node<P>>;
  type NonNever<T, U> = [T] extends [never] ? U : T;
  type ExtractSubNode<S extends readonly Parser[]> = ExtractSubParser<S> extends infer P ? P extends Parser<infer T> ? T : never : never;
  type ExtractSubParser<S extends readonly Parser[]> = S extends readonly (infer P)[] ? P : never;
}
export type Result<T, I extends Input = Input, S extends SubParsers<unknown, I> = SubParsers<never, I>> =
  | Result.Cont<T, I, S>
  | Result.Fail
  | Result.Skip;
export namespace Result {
  export type Cont<T, I extends Input = Input, S extends SubParsers<unknown, I> = SubParsers<never, I>> =
    readonly Parser<T, I, S>[];
  export type Succ = readonly [];
  export type Fail = undefined;
  export type Skip = null;
  export const succ = [] as const;
  export const fail = undefined;
  export const skip = null;
}

let SID = 0;
function sid(): number {
  return SID = ++SID >>> 0 || 1;
}
export class Input<M extends object = object> {
  constructor(
    {
      source,
      position,
      resources,
      linebreak,
      range,
      offset,
      delimiters,
      backtracks,
      scope,
      backtrack,
      precedence,
      state,
      memory,
    }: Options = {},
  ) {
    this.source = source ?? '';
    this.position = position ?? 0;
    this.resources = resources;
    this.linebreak = linebreak ?? 0;
    this.range = range ?? 0;
    this.offset = offset ?? 0;
    this.delimiters = delimiters ?? new Delimiters();
    this.backtracks = backtracks ?? {};
    this.scope = scope as Scope<this> ?? new Scope(this);
    this.backtrack = backtrack ?? new Backtrack(this.scope);
    this.precedence = precedence ?? 0;
    this.state = state ?? 0;
    this.memory = memory ?? Queue.none;
  }
  public SID: number = sid();
  public source: string;
  public segment: number = Segment.unknown;
  public position: number;
  public readonly resources?: {
    clock: number;
    recursions: number[];
    interval?: number;
  };
  public linebreak: number;
  public range: number;
  public offset: number;
  public delimiters: Delimiters;
  // Objectの内部実装を利用する。
  // 探索木を直接使用する場合は探索速度が重要で挿入は相対的に少なく削除は不要かつ不確実であるため
  // AVL木が適当と思われる。
  // メモリの局所性を得るために木ごとに最初の数十から数百byte分のノードをプールしノードが不足した場合は
  // 使い捨てノードを追加またはテーブルに移行するとよいだろう。
  // 最大セグメントサイズ10KB内で探索コストが平均実行性能を圧迫するほど大きくなるとは考えにくいが
  // 探索コストを減らすにはバックトラック位置数が規定数を超えた場合一定区間ごとに探索木を分割する方法が考えられる。
  // 10KBの入力すべてを保持する探索木を1024文字ごとに分割するために必要なテーブルサイズは64bit*98=784byteとなる。
  // 128文字ごとでもテーブルサイズは入力全体の1%未満であるため無視でき16文字ごとでさえ6.25%に過ぎない。
  // 探索木のポインタによるオーバーヘッドを考慮すれば一定サイズ以上ではテーブルのほうが効率的となる。
  // 区間別テーブルは固定サイズであるためプールして再使用できる。
  // 従って分割時のデータ構造は区間ごとに探索木を動的に生成しデータ数に応じてテーブルに移行するのが最も効率的である。
  // これにより最悪時間計算量線形化に要する最悪空間計算量が+1nに局限される。
  // またはテーブルの参照が高速なら変換せず併用してもよい。
  // 木とテーブルいずれにおいてもバックトラックデータとオーバーヘッドを合わせた追加データサイズの最大値は
  // セグメントサイズに制約されるため入力サイズに対する最大追加データサイズの平均比率はかなり小さくなる。
  // 必要なテーブルの最大サイズは最大セグメントサイズであるため最大追加データサイズは入力サイズにかかわらず
  // 10KB*並列数に留まり最大数百文字以下の短文ならば数百byte*並列数となる。
  //
  // 1. データ数が規定数を超えたら区間テーブルを生成しデータを振り分ける。
  //   - 子ノードのポインタだけ保持するとしても1ノード複数データ保持で圧縮できるかは微妙。
  //     - 1ノードに2データ保持すれば2連続データを1/2の確率で捕捉し1バックトラックあたりの平均追加データサイズは
  //       -7byte(((16+1)*2-(16+2))*2+((16+1)*2-(16+2)*2)*2)/4=(32-4)/4=7の10byteに減少する。
  //       2連続データの発生確率が1/5なら-3.2byteの13.8byte、1/10なら+0.4byteの17.4byteに増加する。
  //     - 1ノードに4データ保持すれば2連続データを3/4の確率で捕捉し1バックトラックあたりの平均追加データサイズは
  //       -9byte(((16+1)*2-(16+4))*3+((16+1)*2-(16+4)*2))/4=(42-6)/4=9の8byteに減少する。
  //       2連続データの発生確率が1/5なら-3.6byteの13.4byte、1/10なら+1.2byteの18.2byteに増加する。
  // 2. 区間内のデータ構造は探索木から開始しデータ数が規定数を超えたらテーブルに変換する。
  //   - 1ノード1データ1区間1024文字ならば1024<(64/8*2+1)*61から1区間61データ以上でテーブルのほうが小さくなる。
  //   - 64/8*2+1=17文字に1か所以下のバックトラックでテーブル以上の効率となる。
  //   - 通常の入力でバックトラックが17文字に平均1か所以上となることは考えられず
  //     1段落数百文字あたり平均2、3か所以下が妥当な頻度でありこの場合の最大追加データサイズは
  //     入力内の最大セグメントサイズの10%前後である。
  //
  public backtracks: Record<number, number>;
  public readonly scope: Scope<this>;
  public readonly backtrack: Backtrack;
  public precedence: number;
  public state: number;
  // 必ず自分の継続ブロックの中で使い汚染を防ぐ
  // 本来はスタックのほうが使い捨てオブジェクトを作らず効率的だが全体としては誤差か
  public memory: M;
  public clone(source: string): this {
    // @ts-ignore
    const i = input(source, new this.constructor(this)) as this;
    i.offset = 0;
    i.backtracks = {};
    return i;
  }
}
export type Options = Partial<Input>;
export class Output<T> {
  constructor(
    public readonly data: [List<Node<T>>, ...List<Node<T>>[]] = [new List()],
  ) {
    assert(data.length > 0);
  }
  public state: boolean = true;
  public context: Result.Succ | Result.Fail = Result.succ;
  public error?: Error = undefined;
  public peek(): List<Node<T>> {
    assert(this.data.length > 0);
    return this.data.at(-1)!;
  }
  public prepend(node: Node<T>): Result.Succ | Result.Fail {
    this.data.at(-1)!.unshift(node);
    return Result.succ;
  }
  public append(node: Node<T>): Result.Succ | Result.Fail {
    this.data.at(-1)!.push(node);
    return Result.succ;
  }
  public import(list: List<Node<T>>): Result.Succ | Result.Fail {
    this.data.at(-1)!.import(list);
    return Result.succ;
  }
  public replace(list: List<Node<T>>): Result.Succ | Result.Fail {
    assert(this.data.length > 1);
    this.data[this.data.length - 1] = list;
    return Result.succ;
  }
  public flat(): Result.Succ | Result.Fail {
    assert(this.data.length > 1);
    this.import(this.data.pop()!);
    return Result.succ;
  }
  public push(list: List<Node<T>> = new List()): void {
    this.data.push(list);
  }
  public pop(): List<Node<T>> {
    //assert(this.data.length > +!force);
    return this.data.pop()!;
  }
}
export const enum Segment {
  unknown = 0,
  read = 0,
  write = 1,
}

export { List, Node };

export function input<I extends Input>(source: string, input: I): I;
export function input(source: string, input?: Input): Input;
export function input(source: string, input: Input = new Input()): Input {
  input = subinput(source, input);
  input.segment &= Segment.write;
  return input;
}

export function subinput<I extends Input>(source: string, input: I): I;
export function subinput(source: string, input?: Input): Input;
export function subinput(source: string, input: Input = new Input()): Input {
  input.SID = sid();
  input.source = source;
  input.offset += input.position;
  input.position = 0;
  input.linebreak = 0;
  input.range = 0;
  return input;
}

// 全継続を末尾再帰にすればスタック不要になるがパーサーを複合すると後処理の予約のスタックを
// 避けられないため不可能。
export function* run
  <T, I extends Input, O extends Output<T>>
  (parser: Parser<T, I>, input: I, output: O)
  : Generator<void, void, void> {
  assert(output.data.length > 0);
  const { scope, resources = { clock: 0, interval: 0 } } = input;
  const { interval = 0 } = resources;
  const stack: Queue<Parser<T, I>>[] = [];
  let index = stack.length;
  let time = interval && Date.now();
  for (let queue = Queue.from([parser]); ;) {
    if (interval && resources.clock << 32 - 16 === 0 && Date.now() - time > interval) {
      yield;
      time = Date.now();
    }
    if (output.state && output.error) {
      output.state = false;
      output.context = Result.fail;
    }
    const input = scope.peek();
    //assert(input.position <= input.source.length);
    const result = queue.pop()(input, output);

    if (result) {
      //assert(result.every(f => f));
      output.state = true;
      output.context = Result.succ;
      if (result.length !== 0) {
        if (queue.length !== 0) {
          queue.memory = input.memory;
          stack[index++] = queue;
        }
        else {
          Queue.dispose(queue);
        }
        queue = Queue.from(result);
        continue;
      }
    }
    else {
      if (result === Result.skip) {
        queue.length = 0;
      }
      output.state = false;
      output.context = Result.fail;
    }

    if (queue.length !== 0) continue;
    Queue.dispose(queue);
    if (index === 0) break;
    queue = stack[--index];
    scope.peek().memory = queue.memory;
    //stack.length - index === 256 && stack.pop();
  }
}

class Queue<T> {
  private static readonly pool: Queue<any>[] = Array(256).fill(null);
  private static index = 0;
  public static from<T>(items: readonly T[]): Queue<T> {
    if (this.index === 0) return new Queue(items);
    const queue = this.pool[--this.index];
    queue.items = items;
    queue.length = items.length;
    return queue;
  }
  public static dispose(queue: Queue<any>): void {
    queue.items = Result.succ;
    queue.memory = this.none;
    if (this.index === this.pool.length) return;
    this.pool[this.index++] = queue;
  }
  private constructor(
    public items: readonly T[],
  ) {
  }
  public static readonly none = Object.freeze(Object.create(null));
  public memory: object = Queue.none;
  public length = this.items.length;
  public pop(): T {
    //assert(this.length > 0);
    const { items } = this;
    return items[items.length - this.length--];
  }
}
