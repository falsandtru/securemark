import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<HTMLElement, [
    MarkdownParser.BlockParser
  ]> {
}
export namespace MarkdownParser {
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.PretextParser,
      BlockParser.MathParser,
      BlockParser.ExtensionParser,
      SourceParser.ContentLineParser,
      SourceParser.BlankLineParser
    ]> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
      BlockParser.NewlineParser,
      BlockParser.HorizontalRuleParser,
      BlockParser.HeadingParser,
      BlockParser.UListParser,
      BlockParser.OListParser,
      BlockParser.IListParser,
      BlockParser.DListParser,
      BlockParser.TableParser,
      BlockParser.PretextParser,
      BlockParser.MathParser,
      BlockParser.ExtensionParser,
      BlockParser.BlockquoteParser,
      BlockParser.ParagraphParser
    ]> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface NewlineParser extends
      Block<'newline'>,
      Parser<never, [
        SourceParser.BlankLineParser
      ]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        IndexerParser,
        InblockParser
      ]> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        ListItemParser
      ]> {
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        ListItemParser
      ]> {
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        ListItemParser
      ]> {
    }
    export interface ListItemParser extends
      Block<'listitem'>,
      Parser<HTMLLIElement, [
        InblockParser,
        Parser<HTMLUListElement | HTMLOListElement, [
          UListParser,
          OListParser,
          IListParser
        ]>
      ]> {
    }
    export interface DListParser extends
      // ~ term
      // : description
      Block<'dlist'>,
      Parser<HTMLDListElement, [
        DListParser.TermParser,
        DListParser.DescriptionParser
      ]> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          IndexerParser,
          InblockParser
        ]> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InblockParser
        ]> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser,
        TableParser.RowParser,
        TableParser.RowParser
      ]> {
    }
    export namespace TableParser {
      export interface RowParser extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          CellParser
        ]> {
      }
      export interface CellParser extends
        Block<'table/cell'>,
        Parser<HTMLTableDataCellElement, [
          DataParser | AlignParser
        ]> {
      }
      export interface DataParser extends
        Block<'table/data'>,
        Parser<HTMLElement | Text, [
          InblockParser
        ]> {
      }
      export interface AlignParser extends
        Block<'table/align'>,
        Parser<Text, Parser<Text, []>[]> {
      }
    }
    export interface BlockquoteParser extends
      // > abc
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, [
        Parser<HTMLElement | Text, [
          SourceParser.UnescapableSourceParser
        ]>,
        Parser<HTMLElement | Text, [
          MarkdownParser
        ]>
      ]> {
    }
    export interface PretextParser extends
      // ```
      // abc
      // ```
      Block<'pretext'>,
      Parser<HTMLPreElement, [
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathParser extends
      // $$
      // expr
      // $$
      Block<'math'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface ExtensionParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigureParser,
        ExtensionParser.FigureParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionParser {
      export interface FigureParser extends
        // ~~~figure [:group-name]
        // !https://host/image.png
        //
        // caption
        // ~~~
        //
        // [:group-name]
        // !https://host/image.png
        Block<'extension/figure'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.LabelParser,
          Parser<HTMLElement | Text, [
            Parser<HTMLElement, [
              TableParser,
              PretextParser,
              MathParser,
              ExtensionParser.ExampleParser,
              BlockquoteParser,
              InlineParser.LinkParser, // Take media syntax and convert to link syntax.
              InlineParser.AutolinkParser.UriParser
            ]>,
            Parser<HTMLElement | Text, [
              SourceParser.EmptyLineParser,
              Parser<HTMLElement | Text, [
                SourceParser.EmptyLineParser,
                InblockParser
              ]>
            ]>
          ]>
        ]> {
      }
      export interface ExampleParser extends
        // ~~~markdown
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Parser<HTMLElement, []>[]> {
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, []> {
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.ReferenceParser,
        InblockParser
      ]> {
    }
    export namespace ParagraphParser {
      export interface ReferenceParser extends
        // >0a
        Block<'paragraph/reference'>,
        Parser<HTMLElement | Text, [
          Parser<HTMLAnchorElement | HTMLBRElement, [
            SourceParser.UnescapableSourceParser
          ]>,
          InlineParser
        ]> {
      }
    }
    export interface IndexerParser extends
      // [#index]
      Block<'indexer'>,
      Parser<HTMLAnchorElement, [
        InlineParser.ExtensionParser.IndexParser
      ]> {
    }
  }
  export interface InblockParser extends
    Markdown<'inblock'>,
    Parser<HTMLElement | Text, [
      InblockParser.AnnotationParser,
      InblockParser.AuthorityParser,
      InblockParser.AutolinkParser,
      InlineParser, InlineParser
    ]> {
  }
  export namespace InblockParser {
    interface Inblock<T> extends Markdown<['inblock', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inblock<'annotation'>,
      Parser<HTMLElement, [
        InblockParser
      ]> {
    }
    export interface AuthorityParser extends
      // [[abc]]
      Inblock<'authority'>,
      Parser<HTMLElement, [
        InblockParser
      ]> {
    }
    export interface AutolinkParser extends
      Inblock<'autolink'>,
      Parser<HTMLAnchorElement | Text, [
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface ChannelParser extends
        // @account#tag
        Inblock<'channel'>,
        Parser<HTMLAnchorElement, [
          AccountParser,
          HashtagParser
        ]> {
      }
      export interface AccountParser extends
        // @account
        Inblock<'account'>,
        Parser<HTMLAnchorElement | Text, [
          SourceParser.UnescapableSourceParser,
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser
          ]>
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inblock<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.ExtensionParser,
      InlineParser.LinkParser,
      InlineParser.HTMLParser,
      InlineParser.CommentParser,
      InlineParser.EmphasisParser,
      InlineParser.StrongParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.MediaParser,
      InlineParser.BracketParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      SourceParser.TextParser
    ]> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface LinkParser extends
      // [abc](uri)
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
      ] | [
        Parser<Text, [
          LinkParser.BracketParser,
          SourceParser.UnescapableSourceParser
        ]>,
        LinkParser.AttributeParser
      ]> {
    }
    export namespace LinkParser {
      export interface BracketParser extends
        // ()
        Inline<'link/bracket'>,
        Parser<Text, Parser<Text, [BracketParser, SourceParser.UnescapableSourceParser]>[]> {
      }
      export interface AttributeParser extends
        // nofollow
        Inline<'link/attribute'>,
        Parser<Text, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.PlaceholderParser
      ]> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser
        ]> {
      }
      export interface LabelParser extends
        // [:group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser
        ]> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser
        ]> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      // <!-- comment -->
      Inline<'comment'>,
      Parser<never, [
        Parser<never, never>,
        Parser<never, never>
      ]> {
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export namespace HTMLParser {
      export interface AttributeParser extends
        // attr=""
        Inline<'html/attribute'>,
        Parser<Text, [
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement, [
        SourceParser.CharParser.BackquoteParser,
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathParser extends
      // $expr$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface MediaParser extends
      // ![abc](uri)
      Inline<'media'>,
      Parser<HTMLElement, [
        SourceParser.TextParser
      ] | [
        Parser<Text, [
          LinkParser.BracketParser,
          SourceParser.UnescapableSourceParser
        ]>,
        LinkParser.AttributeParser
      ]> {
    }
    export interface BracketParser extends
      // [abc]
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, []> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | Text, [
        AutolinkParser.UriParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement | Text, [
          SourceParser.UnescapableSourceParser,
          LinkParser,
          LinkParser
        ]> {
      }
    }
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, []> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, []> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, []> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, []> {
    }
    export interface BlankLineParser extends
      Source<'blankline'>,
      Parser<never, []> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, []> {
    }
    export namespace CharParser {
      export interface SharpParser extends
        // #
        Source<'char/sharp'>,
        Parser<Text, []> {
      }
      export interface BackquoteParser extends
        // `
        Source<'char/backquote'>,
        Parser<Text, []> {
      }
    }
  }
}
