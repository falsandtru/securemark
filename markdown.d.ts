import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private parser?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ], MarkdownParser.State, MarkdownParser.Config> {
}
export namespace MarkdownParser {
  export interface Config {
    readonly syntax?: {
      readonly inline?: {
        readonly emphasis?: boolean;
        readonly strong?: boolean;
        readonly link?: boolean;
        readonly media?: boolean;
        readonly insertion?: boolean;
        readonly deletion?: boolean;
        readonly annotation?: boolean;
        readonly reference?: boolean;
      };
    };
    readonly insecure?: boolean;
  }
  export interface State {
  }
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.EmptyLineParser,
    ], State, Config> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
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
    ], State, Config> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser,
      ], State, Config> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        SourceParser.CharParser.SharpParser,
        Parser<HTMLElement | Text, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], State, Config>,
      ], State, Config> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ], State, Config> {
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
          ], State, Config>,
        ], State, Config> {
      }
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ], State, Config> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | Text, [
            SourceParser.UnescapableSourceParser,
            InlineParser,
          ], State, Config>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], State, Config>,
        ], State, Config> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ], State, Config> {
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
      ], State, Config> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], State, Config> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ], State, Config> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.AlignmentParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
      ], State, Config> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.ContentParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ], State, Config> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.ContentParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ], State, Config> {
        }
        export namespace CellParser {
          export type ContentParser = DataParser | AlignmentParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | Text, [
              InlineParser,
            ], State, Config> {
          }
          export interface AlignmentParser extends
            Block<'table/row/cell/alignment'>,
            Parser<Text, [
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
            ], State, Config> {
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
      ], State, Config> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], State, Config> {
      }
      export interface TextParser extends
        Block<'blockquote/text'>,
        Parser<HTMLQuoteElement, [
          TextParser,
          AutolinkParser,
        ], State, Config> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          MarkdownParser,
        ], State, Config> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [
        AutolinkParser,
      ], State, Config> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], State, Config> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser,
      ], State, Config> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], State, Config> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigureParser,
        ExtensionParser.FigureParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.PlaceholderParser,
      ], State, Config> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<HTMLElement, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ], State, Config> {
      }
      export interface FigureParser extends
        // ~~~figure [$group-name]
        // !https://host/image.png
        //
        // caption
        // ~~~
        //
        // [$group-name]
        // !https://host/image.png
        Block<'extension/figure'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.LabelParser,
          Parser<HTMLElement | Text, [
            Parser<HTMLElement, [
              TableParser,
              CodeBlockParser,
              MathBlockParser,
              ExtensionParser.ExampleParser,
              BlockquoteParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
            ], State, Config>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ], State, Config>,
        ], State, Config> {
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
                ExtensionParser.ExampleParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                SourceParser.ContentLineParser,
              ], State, Config>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.EmptyLineParser,
                SourceParser.ContentLineParser,
              ], State, Config>,
            ], State, Config>,
          ], State, Config> {
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
              ExtensionParser.ExampleParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              SourceParser.ContentLineParser,
            ], State, Config>,
          ], State, Config> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Parser<HTMLElement, [], State, Config>[], State, Config> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, [], State, Config> {
        }
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, [], State, Config> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, [], State, Config> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ], State, Config> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuotationParser,
        ], State, Config> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >0a
          Block<'paragraph/mention/address'>,
          Parser<HTMLAnchorElement, [
            SourceParser.CharParser.GreaterThanParser,
            Parser<HTMLAnchorElement, [
              InlineParser.LinkParser,
              InlineParser.LinkParser,
            ], State, Config>,
          ], State, Config> {
        }
        export interface QuotationParser extends
          // > text
          Block<'paragraph/mention/quotation'>,
          Parser<HTMLSpanElement, [
            AutolinkParser,
            AutolinkParser,
          ], State, Config> {
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.ReferenceParser,
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
    ], State, Config> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ], State, Config> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      Inline<'reference'>,
      Parser<HTMLElement, [
        InlineParser,
      ], State, Config> {
    }
    export interface TemplateParser extends
      // {{abc}}
      Inline<'template'>,
      Parser<HTMLSpanElement | Text, [
        SourceParser.CharParser.ExclamationParser,
        InlineParser,
      ], State, Config> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.DataParser,
        ExtensionParser.PlaceholderParser,
      ], State, Config> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], State, Config> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLSpanElement, [
          IndexParser,
        ], State, Config> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
          LinkParser,
        ], State, Config> {
      }
      export interface DataParser extends
        // [~name]
        // [~name=value]
        // [~name=value|text]
        Inline<'extension/data'>,
        Parser<HTMLSpanElement, [
          SourceParser.UnescapableSourceParser,
          InlineParser,
        ], State, Config> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser,
        ], State, Config> {
      }
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        LinkParser.ContentParser,
        LinkParser.ParamParser,
      ], State, Config> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<(HTMLElement | Text)[], [
          MediaParser,
          ShortmediaParser,
          InlineParser,
        ], State, Config> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], State, Config> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/uri'>,
          Parser<Text, [
            UriParser.BracketParser,
            SourceParser.UnescapableSourceParser,
          ], State, Config> {
        }
        export namespace UriParser {
          export interface BracketParser extends
            Inline<'link/uri/bracket'>,
            Parser<Text, Parser<Text, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], State, Config>[], State, Config> {
          }
        }
      }
    }
    export interface MediaParser extends
      // !{uri}
      // ![abc]{uri}
      Inline<'media'>,
      Parser<HTMLAnchorElement, [
        MediaParser.TextParser,
        MediaParser.ParamParser,
      ], State, Config> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<(HTMLElement | Text)[], [
          SourceParser.TextParser,
        ], State, Config> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], State, Config> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser,
      ], State, Config> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<(HTMLElement | Text)[], [
          HTMLEntityParser,
          SourceParser.TextParser,
        ], State, Config> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
          HTMLParser.ContentParser,
        ], State, Config>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ], State, Config>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
          HTMLParser.ContentParser,
        ], State, Config>,
      ], State, Config> {
    }
    export namespace HTMLParser {
      export interface ParamParser extends
        Inline<'html/param'>,
        Parser<Text[], [
          ParamParser.AttributeParser,
        ], State, Config> {
      }
      export namespace ParamParser {
        export interface AttributeParser extends
          Inline<'html/param/attribute'>,
          Parser<Text, [
            SourceParser.UnescapableSourceParser,
            SourceParser.CharParser.EqualParser,
            SourceParser.EscapableSourceParser,
          ], State, Config> {
        }
      }
      export interface ContentParser extends
        Inline<'html/content'>,
        Parser<(HTMLElement | Text)[], [
          InlineParser,
        ], State, Config> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [], State, Config> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], State, Config> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], State, Config> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser,
      ], State, Config> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser,
      ], State, Config> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | Text, [
        Parser<HTMLElement, [
          SourceParser.UnescapableSourceParser,
        ], State, Config>,
        SourceParser.CharParser.BackquoteParser,
      ], State, Config> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser,
      ], State, Config> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, [], State, Config> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLAnchorElement, [
        MediaParser,
      ], State, Config> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | Text, [
        AutolinkParser.UriParser,
        AutolinkParser.EmailParser,
        SourceParser.UnescapableSourceParser,
        SourceParser.UnescapableSourceParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashrefParser,
        SourceParser.UnescapableSourceParser,
      ], State, Config> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], State, Config> {
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], State, Config> {
      }
      export interface ChannelParser extends
        // @account#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ], State, Config> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], State, Config> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], State, Config> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], State, Config> {
      }
    }
    export interface BracketParser extends
      // ()
      // []
      // {}
      // ""
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[], State, Config> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InlineParser.AutolinkParser,
      SourceParser.NewlineParser,
      SourceParser.UnescapableSourceParser,
    ], State, Config> {
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, [], State, Config> {
    }
    export interface NewlineParser extends
      Source<'newline'>,
      Parser<HTMLBRElement, [TextParser], State, Config> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, [], State, Config> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, [], State, Config> {
    }
    export namespace CharParser {
      export interface SharpParser extends
        // #
        Source<'char/sharp'>,
        Parser<Text, [], State, Config> {
      }
      export interface GreaterThanParser extends
        // >
        Source<'char/greater-than'>,
        Parser<Text, [], State, Config> {
      }
      export interface ExclamationParser extends
        // !
        Source<'char/exclamation'>,
        Parser<Text, [], State, Config> {
      }
      export interface EqualParser extends
        // =
        Source<'char/equal'>,
        Parser<Text, [], State, Config> {
      }
      export interface BackquoteParser extends
        // `
        Source<'char/backquote'>,
        Parser<Text, [], State, Config> {
      }
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, [], State, Config> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, [], State, Config> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, [], State, Config> {
    }
  }
}
