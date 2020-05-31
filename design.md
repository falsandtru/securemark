# Design

## ドキュメント

### ソーステキストファースト

ドキュメントの可読性の基準はソーステキスト(Markdownテキスト)でありレンダリング後の可読性はオプションである。
よって構文はレンダリングを要さず直接意味付けの役割を果たさなければならない。

ゆえにすべての構文は直感に従い意味を解釈できる。

### ドキュメント指向

ドキュメントはHTMLドキュメントに要求される人的操作性を損なってはならない。
よって構文は次の操作的機能を備えなければならない。

- 参照性
  - 主要項目を識別子により参照可能である
- 編集性
  - 主要項目の識別子を任意の識別子で固定可能である
  - 識別子は記述位置に依存せず可搬である

ゆえに構文は識別子の設定および参照構文を備える。

### 全文展開

ドキュメントはその全文の閲覧のために追加の操作を必要としてはならない。
よってドキュメントはその全文を展開して表示しなければならない。

ゆえに構文はレンダリング後の操作により表示する内容および状態を変化させる構文を備えない。

### モノクロプリント対応

構文はモノクロ表示および印刷に対応していなければならない。

ゆえに構文はCSSにより次の通り表示を変更することで意味付けを維持したままモノクロ版に変換できる。

|Syntax|HTML|Presentation
|-|-|-
|==|\<mark>|下線(通常、幅広、または波型)
|++|\<ins>|下線(幅広または波型)
|~~|\<del>|打ち消し線

### 閲覧者によるマークアップ方法の確保

構文およびその表現は閲覧者による基本的なマークアップを妨げてはならない。

ゆえに構文は下線、打ち消し線のための構文を備えない。
ハイライトは閲覧者によるハイライトを妨げないよう線幅が40%以下かつ淡色でなければならない。
閲覧者によるマークアップはベースがカラーの場合は下線、モノクロの場合はモノクロ版に変換のうえマーカーにより行うことを企図している。

### ユニバーサルポータビリティ

ドキュメントは異なるサイトやツール上でも一貫して表示されなければならない。
よってパーサーは可変であってはならない。

ゆえにAPIはパーサーの設定項目を持たない。

### サードパーティドキュメントの共有および表示可能性

ドキュメントはそのセキュリティ上の信頼性にかかわらず共有および表示できなければならない。
よってパーサーおよびレンダラーはXSSをはじめとする悪意あるコードの注入に対して安全でなければならない。

#### XSS対応

パーサーはパース結果をオブジェクトとして生成しHTML等の文字列での表現を経由しない。

ゆえにパーサーはXSS安全である。
ただし外部メディアの表示等安全性を外部サービスに依存する部分はこの限りではない。

#### Fishing対応

パーサーはリンクテキストとリンク先の一致しないリンクを生成しない。

ゆえにパーサーはFishing安全である。

#### DOS対応

パーサーは入力文字列により実行環境を応答不能にすることはない。

ゆえにパーサーはDOS安全である。

##### パースコスト

パーサーは内部パーサーの使用回数が上限を超えるブロックをパースしない。

ゆえにブロックが構文の使用過多または長大なバックトラックにより実行環境を応答不能にすることはない。
なおこの上限は非常に高く設定されており通常の使用で上限を超えることは考えにくい。

##### バックトラック

パーサーはバックトラックが最小限となるよう実装される。
またバックトラックはこれにともない生じるパースコストにより制約される。

ゆえにブロックがバックトラックにより実行環境を応答不能にすることはない。
なおバックトラック回数は余分に生じたパース回数に比例せずこの情報を代替しないことに留意すること。

##### セグメントサイズ

パーサーはサイズが上限を超えるセグメントをパースしない。
またこれを超えないセグメントのパースも内部パーサーの使用回数およびバックトラック回数の上限を超えない。

ゆえにセグメントがパーサーの実行環境を応答不能にすることはない。
なお1セグメントは1ブロックに対応し、Headingパーサーのみ例外的に複数ブロックを出力するがパース単位としては1ブロックであるためこの制約は保たれる。
またネストしたブロックをパースする場合も各回数が同一ブロック内の全ブロックで共有されるため制約は保たれる。

##### インプットサイズ

パーサーはサイズが上限を超える入力をパースしない。
またこれを超えない入力は1秒以下でセグメントに分割され非同期で逐次パースすることが可能となる。

ゆえに入力がパーサーの実行環境を応答不能にすることはない。

## 構文

### 引用文可搬性

引用構文はコピー＆ペーストにより挿入されたテキストを無編集で使用できなければならない。

ゆえに引用構文は引用文をパースしない。

### オートリンク不変性

オートリンクは原則としてコピー＆ペーストによる引用等を経た際にその解釈が変わってはならない。

ゆえにハッシュタグ構文は構文が表示文字列と一致する構文であるオートリンク構文としてのみ構文化され、表示文字列からの構文の範囲の特定が不可能である通常の構文を持たない。

### 自動附番

ドキュメント内の参照はドキュメントの編集を妨げないよう参照先および参照元いずれも記述順序に非依存でなければならない。

ゆえに参照箇所に実体を記述する注釈構文および識別に文字列を使用する図表構文を採用し、その表示方法は任意とする。
脚注構文は附番が手作業となり参照と実体の対応の管理が困難であるため不採用とし注釈構文により生成可能とする。

### 羅列的知識への非依存

構文はその使用のために羅列的知識を求めてはならない。

ゆえに構文はHTMLエンティティの参照の有効性を検査しない。

### テンプレート対応

ソーステキストは自身をテンプレートとして別のソーステキストを生成するための構文を使用できなければならない。
またテンプレートとなるソーステキストもドキュメントとして正しく表示できなければならない。
よって構文はテンプレートのソーステキストとドキュメント間での表示上の一貫性のための構文を備えなければならない。

ゆえに構文はテンプレート構文を備える。

### 編集中のソーステキストのレンダリング結果の表示安定性

レンダリング結果の表示はソーステキストの編集にともなう高頻度または広範囲にわたる変化により視覚的負担をかけてはならない。
よって構文は編集過程で生じる不完全な構文を最大限補完してパースしなければならない。

ゆえにすべてのブロック構文は順次的編集過程で生じるすべての不完全な構文を補完してパースする。
またインラインのレンダリングに含まれる高価な処理はキャッシュにより即時化される。

### 構文階層独立性

上位区分の構文の一致は下位区分の構文から独立して上位構文の形式のみから判定されなければならない。
よって上位区分の構文の一致判定に下位区分の構文による内包文字列のパース結果を用いてはならない。

ゆえにすべてのブロック構文は構文の一致判定にインライン構文による内包文字列のパース結果を用いない。
またすべての構文は任意の包含関係において無効化および有効化できる。

### 構文不変性

任意のソーステキストの中で構文に一致する文字列は構文の拡張の前後において不変でなければならず追加の前後において最大限不変でなければならない。
よって構文の属性等のパラメータは値でなく書式で制約しなければならない。
また不正なパラメータまたは構成の文字列は誤入力および出力の将来的可変性を通知するパース結果を出力しなければならない。

ゆえにすべての構文はこのように実装される。

### 構文追加要件

構文の追加は次のいずれかの要求に対応するものでなければならない。

- HTML上の情報表示形式への対応
- HTML上で固有の視覚表現を持つ意味付けへの対応
- HTMLドキュメントに要求される操作的機能の充足

よって外観や制御のために構文を追加してはならない。
また他の構文と同じ視覚表現で異なる意味付けを行うHTMLタグを追加してはならない。

## スケーラビリティ

パーサーおよびレンダラーはドキュメントサイズの増大により以下の利用性を損なってはならない。

### 閲覧性

ドキュメントは即時ないし順次閲覧できなければならない。
よってドキュメントは全体のパースを待たず一定時間内に表示を開始しなければならない。
また高価な処理は必要時まで遅延しなければならない。

ゆえにパーサーはパースおよびその結果の返却を逐次的に行う。
またパーサーは外部リソースのリクエストその他の高価な処理を自身で行わずレンダラーに委ねる。

### 参照性

ドキュメントは各要素への参照、参照先への移動、および参照元への復帰方法を提供しなければならない。

ゆえにドキュメントはすべてのセクション、用語定義、図表、注釈、および出典をリンク機能を介して参照および復帰できる。

### 編集性

ドキュメントはそのサイズにかかわらず編集が容易でなければならない。
よってパースおよびレンダリングは差分更新により行わなければならない。

ゆえにパーサーは差分更新を行い、構文はこのために空行によるブロックの分割を必須とする。

## 注意事項

### AST

Blockquote構文を内包テキストまでシンタックスハイライトする場合、構文(>)と内包テキストが垂直に分割されるため構文と1対1で対応する単純なノードではASTを表現できず構文の断片を表現するノードが必要となり、さらにこれをエディタ上でシンタックスハイライトするためのHTMLに変換する際に各行においてこの断片のASTを断片のHTMLに正しく変換および表示しなければならずかなり複雑な作業を要する。

### バックトラック

SecuremarkのAnnotation構文に典型的であるようにスコープの生成規則を変える構文が存在する場合文脈の相違から解析結果を共用できない(`αABβ | αA'B`)バックトラックが再帰的に生じ、このような言語を線形時間で解析することは基本的に不可能であり直ちに文脈を確定する任意の構文または記号の前に文脈の差異が生じない(`αAB | αACβ`)場合のみバックトラックなしで解析できると思われる。
よって構文の選択やその細部の制御等はその可否の確定を待つことができるが内部構文の文脈の確定は待つことができないことから内部構文の文脈が事前の文脈または内部構文の解析結果等に依存すれど共通であり確定する言語は線形時間で解析できるが内部構文の文脈が内部構文の解析結果等により変化する(再帰的に確定されている)などの理由から事前に確定しない言語は線形時間で解析できない。
このため線形時間で解析可能な文法に制約されるCommonMarkがこの制約を破らずこのような文脈不確定文法を導入することは不可能であり一例としてSecuremarkにおけるAnnotation構文のような文脈独立の構文とHTML構文のような構文の再帰または特定の包含関係での使用の禁止等の再帰制御の両立ができないという拡張性の限界が存在する。なおLink構文は自身を始めとするリンクを生成する構文を包含できないためリンクを生成するAnnotation構文との関係においてこの問題を生じない。
またここで用いられる前述のバックトラック回避手法は基本的に開始記号による構文の決定性、ひいては可読性を損なうため人間の利便性のために供される言語の文法には適さず構文を拡張するほど可読性が多項式的に悪化する問題およびこの回避手法は入力箇所と離れた外側の構文の解釈を変更する直感的に理解しにくい挙動を生む問題がある。CommonMarkはこのバックトラック回避手法を使用しているため拡張性に問題があり一例としてリンクを生成する構文の追加は当該構文が他の構文を内包しない場合は線形に、する場合は多項式的に可読性および直感性を悪化させ、開始記号であることが実際には不明瞭なLink構文はまだしも相当程度明瞭なAnnotation、Reference、Extension構文においてこの問題が生じることは受け入れがたい。
さらにMarkdownのように自然言語と自身の文法を分離する汎用構造がないメタ言語は旧構文を破壊する新構文が自然言語の中に潜在せざるをえず構文を拡張する際に後方互換性を保証することが不可能であることからCommonMarkは拡張構文を標準化した次期標準仕様との互換性を確保させる役には立たずその有用性は構文の拡張を考慮しない範囲での効率的な実装方法の例示およびテストケースの集積による個別実装の支援ならびにその結果としての限定的互換性にとどまる。
よってMarkdownにおいて標準化はスナップショット以上の意味を持たず、CommonMarkはより高度な構文や機能の実装可能性を考慮していない点で拡張仕様において準拠すべき技術的正当性がない。
MarkdownはGFMのように最初から高機能で完成度の高い拡張不要な独自実装のほうが標準としての互換性を確保でき、構文に曖昧さがない通常の形式言語と異なり最小限の標準仕様を策定し拡張していく通常の標準化方法が適さない特殊な言語である。