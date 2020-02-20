import { Parser, Ctx } from './src/combinator';

declare abstract class Markdown<T> {
  private parser?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ], MarkdownParser.Context> {
}
export namespace MarkdownParser {
  export interface Context extends Ctx {
    readonly syntax?: {
      readonly inline?: {
        readonly link?: boolean;
        readonly media?: boolean;
        readonly annotation?: boolean;
        readonly reference?: boolean;
        readonly extension?: boolean;
        readonly autolink?: boolean;
      };
    };
    readonly state?: {
      readonly in?: {
        readonly bdx?: boolean;
        readonly supsub?: boolean;
        readonly small?: boolean;
      };
    };
    readonly insecure?: boolean;
  }
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<never, [
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.EmptyLineParser,
    ], Context> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
      SourceParser.EmptyLineParser,
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
    ], Context> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser,
      ], Context> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        InlineParser.ExtensionParser.IndexerParser,
        InlineParser,
      ], Context> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ], Context> {
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
          ], Context>,
        ], Context> {
      }
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ], Context> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | Text, [
            SourceParser.StrParser,
            SourceParser.StrParser,
            InlineParser,
          ], Context>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], Context>,
        ], Context> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ], Context> {
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
      ], Context> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Context> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ], Context> {
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
      ], Context> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.ContentParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ], Context> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.ContentParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ], Context> {
        }
        export namespace CellParser {
          export type ContentParser = DataParser | AlignmentParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | Text, [
              InlineParser,
            ], Context> {
          }
          export interface AlignmentParser extends
            Block<'table/row/cell/alignment'>,
            Parser<Text, [
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
            ], Context> {
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
      ], Context> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Context> {
      }
      export interface TextParser extends
        Block<'blockquote/text'>,
        Parser<HTMLQuoteElement, [
          TextParser,
          AutolinkParser,
        ], Context> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          MarkdownParser,
        ], Context> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [], Context> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [], Context> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement | HTMLPreElement, [], Context> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [], Context> {
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
      ], Context> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<never, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ], Context> {
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
            Parser<HTMLElement | Text, [
              TableParser,
              CodeBlockParser,
              MathBlockParser,
              ExtensionParser.ExampleParser,
              BlockquoteParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
            ], Context>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ], Context>,
        ], Context> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<never, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, [
              Parser<never, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                ExtensionParser.ExampleParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                SourceParser.ContentLineParser,
              ], Context>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.EmptyLineParser,
                SourceParser.ContentLineParser,
              ], Context>,
            ], Context>,
          ], Context> {
        }
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<never, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, [
              CodeBlockParser.SegmentParser,
              MathBlockParser.SegmentParser,
              ExtensionParser.ExampleParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              SourceParser.ContentLineParser,
            ], Context>,
          ], Context> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, [], Context> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, [], Context> {
        }
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, [], Context> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, [], Context> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ], Context> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuotationParser,
        ], Context> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >0a
          Block<'paragraph/mention/address'>,
          Parser<HTMLAnchorElement, [
            SourceParser.StrParser,
            Parser<HTMLElement | Text, [
              InlineParser.LinkParser,
              InlineParser.LinkParser,
            ], Context>,
          ], Context> {
        }
        export interface QuotationParser extends
          // > text
          Block<'paragraph/mention/quotation'>,
          Parser<HTMLSpanElement, [
            AutolinkParser,
            AutolinkParser,
          ], Context> {
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.EscapeParser,
      InlineParser.AnnotationParser,
      InlineParser.ReferenceParser,
      InlineParser.TemplateParser,
      InlineParser.ExtensionParser,
      InlineParser.RubyParser,
      InlineParser.LinkParser,
      InlineParser.MediaParser,
      InlineParser.HTMLParser,
      InlineParser.CommentParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.MarkParser,
      InlineParser.EmStrongParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.HTMLEntityParser,
      InlineParser.ShortmediaParser,
      InlineParser.AutolinkParser,
      InlineParser.BracketParser,
      SourceParser.TextParser,
    ], Context> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Context> {
    }
    export interface EscapeParser extends
      // ****
      // +++
      // ~~~
      // ===
      Inline<'escape'>,
      Parser<Text, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      Inline<'reference'>,
      Parser<HTMLElement, [
        ReferenceParser.AliasParser,
        InlineParser,
      ], Context> {
    }
    export namespace ReferenceParser {
      export interface AliasParser extends
        // ~Xyz2020:
        // ~X, 2020:
        // ~X, Y, 2020, p1-2:
        Inline<'reference/alias'>,
        Parser<HTMLElement, [
          SourceParser.UnescapableSourceParser,
        ], Context> {
      }
    }
    export interface TemplateParser extends
      // {{abc}}
      Inline<'template'>,
      Parser<HTMLSpanElement, [
        SourceParser.CharParser,
        InlineParser,
      ], Context> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement | Text, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.DataParser,
        ExtensionParser.PlaceholderParser,
      ], Context> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          InlineParser,
        ], Context> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLElement | Text, [
          IndexParser,
        ], Context> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
          SourceParser.StrParser,
        ], Context> {
      }
      export namespace LabelParser {
        export interface SegmentParser extends
          Inline<'extension/label/segment'>,
          Parser<never, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ], Context> {
        }
      }
      export interface DataParser extends
        // [~name]
        // [~name=value]
        // [~name=value|text]
        Inline<'extension/data'>,
        Parser<HTMLElement | Text, [
          SourceParser.StrParser,
          SourceParser.CharParser,
          InlineParser,
        ], Context> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLElement | Text, [
          InlineParser,
        ], Context> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        SourceParser.StrParser,
        SourceParser.StrParser,
      ], Context> {
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLElement, [
        LinkParser.ContentParser,
        LinkParser.ParamParser,
      ], Context> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<(HTMLElement | Text)[], [
          MediaParser,
          ShortmediaParser,
          InlineParser,
        ], Context> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          LinkParser.ParamParser.AttributeParser,
        ], Context> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/param/uri'>,
          Parser<Text, [
            SourceParser.StrParser,
          ], Context> {
        }
        export interface AttributeParser extends
          Inline<'link/param/attribute'>,
          Parser<Text, [
            SourceParser.StrParser,
          ], Context> {
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
      ], Context> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<Text[], [
          SourceParser.StrParser,
        ], Context> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          LinkParser.ParamParser.AttributeParser,
        ], Context> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement | Text, [
        HTMLParser.OpenTagParser,
        HTMLParser.TagParser,
        HTMLParser.TagParser,
      ], Context> {
    }
    export namespace HTMLParser {
      export interface OpenTagParser extends
        Inline<'html/opentag'>,
        Parser<HTMLElement | Text, [
          TagParser.AttributeParser,
        ], Context> {
      }
      export interface TagParser extends
        Inline<'html/tag'>,
        Parser<HTMLElement | Text, [
          InlineParser,
        ], Context> {
      }
      export namespace TagParser {
        export interface AttributeParser extends
          Inline<'html/tag/attribute'>,
          Parser<Text, [
            SourceParser.StrParser,
          ], Context> {
        }
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [], Context> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement | Text, [
        InlineParser,
      ], Context> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement | Text, [
        InlineParser,
      ], Context> {
    }
    export interface MarkParser extends
      // ==abc==
      Inline<'mark'>,
      Parser<HTMLElement | Text, [
        InlineParser,
      ], Context> {
    }
    export interface EmStrongParser extends
      // *abc*
      Inline<'emstrong'>,
      Parser<HTMLElement | Text, [
        InlineParser,
      ] | [
        EmphasisParser | StrongParser,
        InlineParser,
      ], Context> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement | Text, [
        StrongParser,
        InlineParser,
      ], Context> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement | Text, [
        EmphasisParser,
        InlineParser,
      ], Context> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | Text, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLElement, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, [], Context> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, [
        MediaParser,
      ], Context> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLElement | Text, [
        AutolinkParser.UrlParser,
        AutolinkParser.EmailParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashrefParser,
        SourceParser.StrParser,
      ], Context> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<HTMLElement, [
          LinkParser,
        ], Context> {
      }
      export namespace UrlParser {
        export interface BracketParser extends
          Inline<'url/bracket'>,
          Parser<Text, [
            Parser<Text, [
              BracketParser,
              SourceParser.StrParser,
            ], Context>,
            Parser<Text, [
              BracketParser,
              SourceParser.StrParser,
            ], Context>,
            Parser<Text, [
              BracketParser,
              SourceParser.StrParser,
            ], Context>,
            Parser<Text, [
              BracketParser,
              SourceParser.StrParser,
            ], Context>,
            SourceParser.UnescapableSourceParser,
          ], Context> {
        }
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Context> {
      }
      export interface ChannelParser extends
        // @account#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ], Context> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Context> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Context> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Context> {
      }
    }
    export interface BracketParser extends
      // ()
      // []
      // {}
      Inline<'bracket'>,
      Parser<HTMLElement | Text, [
        InlineParser,
        InlineParser,
        InlineParser,
      ], Context> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InlineParser.AutolinkParser,
      SourceParser.LinebreakParser,
      SourceParser.UnescapableSourceParser,
    ], Context> {
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, [], Context> {
    }
    export interface LinebreakParser extends
      Source<'linebreak'>,
      Parser<HTMLBRElement, [TextParser], Context> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, [], Context> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, [], Context> {
    }
    export interface StrParser extends
      Source<'str'>,
      Parser<Text, [], Context> {
    }
    export interface CharParser extends
      Source<'char'>,
      Parser<Text, [], Context> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, [], Context> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, [], Context> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, [], Context> {
    }
  }
}
