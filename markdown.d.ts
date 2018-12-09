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
    Parser<never, [
      BlockParser.CodeBlockParser,
      BlockParser.MathBlockParser,
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
      BlockParser.CodeBlockParser,
      BlockParser.MathBlockParser,
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
          AutolinkParser
        ]>,
        Parser<HTMLElement | Text, [
          MarkdownParser
        ]>
      ]> {
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
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
        ExtensionParser.GraphParser,
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
          Parser<HTMLElement, [
            FigureParser.ContentParser,
            SourceParser.EmptyLineParser,
            FigureParser.CaptionParser
          ]>
        ]> {
      }
      export namespace FigureParser {
        export interface ContentParser extends
          Block<'extension/figure/content'>,
          Parser<HTMLElement, [
            TableParser,
            CodeBlockParser,
            MathBlockParser,
            ExtensionParser.GraphParser,
            ExtensionParser.ExampleParser,
            BlockquoteParser,
            InlineParser.LinkParser, // Take media syntax and convert to link syntax.
            InlineParser.AutolinkParser.UriParser
          ]> {
        }
        export interface CaptionParser extends
          Block<'extension/figure/caption'>,
          Parser<HTMLElement, [
            SourceParser.BlankLineParser,
            InblockParser
          ]> {
        }
      }
      export interface GraphParser extends
        // ~~~graph
        // ~~~
        Block<'extension/graph'>,
        Parser<HTMLPreElement, SourceParser.UnescapableSourceParser[]> {
      }
      export interface ExampleParser extends
        // ~~~example
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
      InblockParser.AutolinkParser,
      InlineParser, InlineParser
    ]> {
  }
  export namespace InblockParser {
    interface Inblock<T> extends Markdown<['inblock', T]> { }
    export interface AutolinkParser extends
      Inblock<'autolink'>,
      Parser<HTMLAnchorElement | Text, [
        AutolinkParser.ChannelParser,
        AutolinkParser.HashtagParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface ChannelParser extends
        // @account#tag
        Inblock<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          HashtagParser
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inblock<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.AuthorityParser,
      InlineParser.ExtensionParser,
      InlineParser.LinkParser,
      InlineParser.RubyParser,
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
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InblockParser
      ]> {
    }
    export interface AuthorityParser extends
      // [[abc]]
      Inline<'authority'>,
      Parser<HTMLElement, [
        InblockParser
      ]> {
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
    export interface LinkParser extends
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        LinkParser.TextParser,
        LinkParser.ParamParser
      ]> {
    }
    export namespace LinkParser {
      export interface TextParser extends
        Inline<'link/text'>,
        Parser<DocumentFragment, [
          InlineParser
        ]> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<DocumentFragment, [
          LinkParser.ParamParser.UriParser,
          LinkParser.ParamParser.AttributeParser
        ]> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/uri'>,
          Parser<Text, [
            UriParser.BracketParser,
            SourceParser.UnescapableSourceParser
          ]> {
        }
        export namespace UriParser {
          export interface BracketParser extends
            Inline<'link/uri/bracket'>,
            Parser<Text, Parser<Text, [
              BracketParser,
              SourceParser.UnescapableSourceParser
            ]>[]> {
          }
        }
        export interface AttributeParser extends
          Inline<'link/attribute'>,
          Parser<Text, [
            SourceParser.UnescapableSourceParser,
            SourceParser.UnescapableSourceParser
          ]> {
        }
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser
      ]> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<Array<HTMLElement | Text>, [
          HTMLEntityParser,
          SourceParser.TextParser
        ]> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        Parser<HTMLElement, [
          HTMLParser.AttributeParser,
          InlineParser
        ]>,
        Parser<HTMLElement, [
          HTMLParser.AttributeParser
        ]>,
        Parser<HTMLElement, [
          HTMLParser.AttributeParser
        ]>
      ]> {
    }
    export namespace HTMLParser {
      export interface AttributeParser extends
        // attr=""
        Inline<'html/attribute'>,
        Parser<Text | DocumentFragment, [
          SourceParser.UnescapableSourceParser,
          SourceParser.EscapableSourceParser
        ]> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [
        SourceParser.UnescapableSourceParser
      ]> {
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
        SourceParser.UnescapableSourceParser,
        SourceParser.UnescapableSourceParser
      ]> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser
      ]> {
    }
    export interface MediaParser extends
      // ![abc]{uri}
      Inline<'media'>,
      Parser<HTMLElement, [
        MediaParser.TextParser,
        MediaParser.ParamParser
      ]> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<DocumentFragment, [
          SourceParser.TextParser
        ]> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text, [
          LinkParser.ParamParser.UriParser,
          LinkParser.ParamParser.AttributeParser
        ]> {
      }
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
        AutolinkParser.UriParser,
        AutolinkParser.EmailParser,
        AutolinkParser.AccountParser
      ]> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement | Text, [
          LinkParser,
          LinkParser,
          SourceParser.UnescapableSourceParser
        ]> {
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser
          ]>,
          SourceParser.UnescapableSourceParser
        ]> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser
          ]>,
          SourceParser.UnescapableSourceParser
        ]> {
      }
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InblockParser.AutolinkParser,
      InlineParser.AutolinkParser,
      SourceParser.UnescapableSourceParser
    ]> {
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
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, []> {
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
    }
  }
}
