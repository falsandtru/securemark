import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ]> {
}
export namespace MarkdownParser {
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.BlankLineParser,
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
      BlockParser.ParagraphParser,
    ]> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface NewlineParser extends
      Block<'newline'>,
      Parser<never, [
        SourceParser.BlankLineParser,
      ]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser,
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        InlineParser.ExtensionParser.IndexerParser,
        InlineParser,
      ]> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ]> {
    }
    export namespace UListParser {
      export interface ListItemParser extends
        Block<'ulist/listitem'>,
        Parser<HTMLLIElement, [
          InlineParser,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ]>,
        ]> {
      }
    }
    export interface OListParser extends
      // #. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ]> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | Text, [
            SourceParser.UnescapableSourceParser,
            InlineParser,
          ]>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ]>,
        ]> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ]> {
    }
    export namespace IListParser {
      export type ListItemParser = UListParser.ListItemParser;
    }
    export interface DListParser extends
      // ~ term
      // : description
      Block<'dlist'>,
      Parser<HTMLDListElement, [
        DListParser.TermParser,
        DListParser.DescriptionParser,
      ]> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ]> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.AlignParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
      ]> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.IncellParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ]> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.IncellParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ]> {
        }
        export namespace CellParser {
          export type IncellParser = DataParser | AlignParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | Text, [
              InlineParser,
            ]> {
          }
          export interface AlignParser extends
            Block<'table/row/cell/align'>,
            Parser<Text, [
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
            ]> {
          }
        }
      }
    }
    export interface BlockquoteParser extends
      // > abc
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, [
        BlockquoteParser.TextParser,
        BlockquoteParser.SourceParser,
      ]> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
          SourceParser.ContentLineParser,
        ]> {
      }
      export interface TextParser extends
        Block<'blockquote/text'>,
        Parser<HTMLQuoteElement, [
          TextParser,
          AutolinkParser,
        ]> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          MarkdownParser,
        ]> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [
        AutolinkParser,
      ]> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ]> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser,
      ]> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ]> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigureParser,
        ExtensionParser.FigureParser,
        ExtensionParser.GraphParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.PlaceholderParser,
      ]> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<HTMLElement, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          GraphParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ]> {
      }
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
              CodeBlockParser,
              MathBlockParser,
              ExtensionParser.GraphParser,
              ExtensionParser.ExampleParser,
              BlockquoteParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
            ]>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ]>,
        ]> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<HTMLElement, [
            InlineParser.ExtensionParser.LabelParser,
            Parser<never, [
              Parser<never, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                ExtensionParser.GraphParser.SegmentParser,
                ExtensionParser.ExampleParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                SourceParser.ContentLineParser,
              ]>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.BlankLineParser,
                SourceParser.ContentLineParser,
              ]>,
            ]>,
          ]> {
        }
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<HTMLElement, [
            InlineParser.ExtensionParser.LabelParser,
            Parser<never, [
              CodeBlockParser.SegmentParser,
              MathBlockParser.SegmentParser,
              ExtensionParser.GraphParser.SegmentParser,
              ExtensionParser.ExampleParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              SourceParser.ContentLineParser,
            ]>,
          ]> {
        }
      }
      export interface GraphParser extends
        // ~~~graph
        // ~~~
        Block<'extension/graph'>,
        Parser<HTMLPreElement, Parser<HTMLPreElement, [SourceParser.UnescapableSourceParser]>[]> {
      }
      export namespace GraphParser {
        export interface SegmentParser extends
          Block<'extension/graph/segment'>,
          Parser<never, SourceParser.ContentLineParser[]> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Parser<HTMLElement, []>[]> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, []> {
        }
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, []> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, []> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ]> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuoteParser,
        ]> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >0a
          Block<'paragraph/mention/address'>,
          Parser<HTMLSpanElement, [
            InlineParser.LinkParser,
          ]> {
        }
        export interface QuoteParser extends
          // > text
          Block<'paragraph/mention/quote'>,
          Parser<HTMLSpanElement, [
            AutolinkParser,
            AutolinkParser,
          ]> {
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.AuthorityParser,
      InlineParser.TemplateParser,
      InlineParser.ExtensionParser,
      InlineParser.LinkParser,
      InlineParser.MediaParser,
      InlineParser.RubyParser,
      InlineParser.HTMLParser,
      InlineParser.CommentParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.EmphasisParser,
      InlineParser.StrongParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.HTMLEntityParser,
      InlineParser.ShortmediaParser,
      InlineParser.AutolinkParser,
      InlineParser.BracketParser,
      SourceParser.TextParser,
    ]> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ]> {
    }
    export interface AuthorityParser extends
      // [[abc]]
      Inline<'authority'>,
      Parser<HTMLElement, [
        InlineParser,
      ]> {
    }
    export interface TemplateParser extends
      // {{ abc }}
      Inline<'template'>,
      Parser<HTMLSpanElement | Text, [
        SourceParser.UnescapableSourceParser,
        Parser<HTMLSpanElement, [
          SourceParser.EscapableSourceParser,
        ]>,
      ]> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.DataParser,
        ExtensionParser.PlaceholderParser,
      ]> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ]> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLSpanElement, [
          IndexParser,
        ]> {
      }
      export interface LabelParser extends
        // [:group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ]> {
      }
      export interface DataParser extends
        // [~name]
        // [~name=value]
        // [~name=value|text]
        Inline<'extension/data'>,
        Parser<HTMLSpanElement, [
          SourceParser.UnescapableSourceParser,
          InlineParser,
        ]> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser,
        ]> {
      }
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        LinkParser.ContentParser,
        LinkParser.ParamParser,
      ]> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<DocumentFragment, [
          InlineParser,
        ]> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<DocumentFragment, [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ]> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/uri'>,
          Parser<Text, [
            UriParser.BracketParser,
            SourceParser.UnescapableSourceParser,
          ]> {
        }
        export namespace UriParser {
          export interface BracketParser extends
            Inline<'link/uri/bracket'>,
            Parser<Text, Parser<Text, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>[]> {
          }
        }
      }
    }
    export interface MediaParser extends
      // !{uri}
      // ![abc]{uri}
      Inline<'media'>,
      Parser<HTMLElement, [
        MediaParser.TextParser,
        MediaParser.ParamParser,
      ]> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<(HTMLElement | Text)[], [
          SourceParser.TextParser,
        ]> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ]> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser,
      ]> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<(HTMLElement | Text)[], [
          HTMLEntityParser,
          SourceParser.TextParser,
        ]> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
          HTMLParser.ContentParser,
        ]>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ]>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ]>,
      ]> {
    }
    export namespace HTMLParser {
      export interface ParamParser extends
        Inline<'html/param'>,
        Parser<Text[], [
          ParamParser.AttributeParser,
        ]> {
      }
      export namespace ParamParser {
        export interface AttributeParser extends
          Inline<'html/param/attribute'>,
          Parser<Text, [
            SourceParser.UnescapableSourceParser,
            SourceParser.CharParser.EqualParser,
            SourceParser.EscapableSourceParser,
          ]> {
        }
      }
      export interface ContentParser extends
        Inline<'html/content'>,
        Parser<(HTMLElement | Text)[], [
          InlineParser,
        ]> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, []> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement, [
        InlineParser,
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement, [
        InlineParser,
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser,
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser,
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | Text, [
        Parser<HTMLElement, [
          SourceParser.UnescapableSourceParser,
        ]>,
        SourceParser.UnescapableSourceParser,
      ]> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser,
      ]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, []> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, [
        MediaParser,
      ]> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | Text, [
        AutolinkParser.UriParser,
        AutolinkParser.EmailParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser,
      ]> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ]> {
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser,
          ]>,
          SourceParser.UnescapableSourceParser,
        ]> {
      }
      export interface ChannelParser extends
        // @account#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ]> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser,
          ]>,
          SourceParser.UnescapableSourceParser,
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement | Text, [
          Parser<HTMLAnchorElement, [
            SourceParser.UnescapableSourceParser,
          ]>,
          SourceParser.UnescapableSourceParser,
        ]> {
      }
    }
    export interface BracketParser extends
      // [abc]
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[]> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InlineParser.AutolinkParser,
      SourceParser.UnescapableSourceParser,
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
      export interface EqualParser extends
        // =
        Source<'char/equal'>,
        Parser<Text, []> {
      }
    }
  }
}
